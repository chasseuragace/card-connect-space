-- Create calendar_events table for Google sync
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  google_event_id TEXT,
  title TEXT NOT NULL,
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_confirmed_attendance BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, google_event_id)
);

-- Create booking_requests table with status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'rejected');

CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requested_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location_preference TEXT,
  note TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create anonymous_feedback table
CREATE TABLE public.anonymous_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (char_length(message) > 0),
  CHECK (word_count <= 200)
);

-- Add indexes for performance optimization
CREATE INDEX idx_calendar_events_user_time ON public.calendar_events(user_id, start_time);
CREATE INDEX idx_calendar_events_public ON public.calendar_events(user_id, is_public, is_confirmed_attendance);
CREATE INDEX idx_booking_requests_user_status ON public.booking_requests(user_id, status);
CREATE INDEX idx_booking_requests_time ON public.booking_requests(requested_time);
CREATE INDEX idx_anonymous_feedback_target ON public.anonymous_feedback(target_user_id);
CREATE INDEX idx_anonymous_feedback_created ON public.anonymous_feedback(created_at);

-- Enable Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_events
CREATE POLICY "Users can view their own calendar events" 
ON public.calendar_events 
FOR SELECT 
USING (user_id IN (
  SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Public calendar events are viewable by everyone" 
ON public.calendar_events 
FOR SELECT 
USING (is_public = true AND is_confirmed_attendance = true);

CREATE POLICY "Users can manage their own calendar events" 
ON public.calendar_events 
FOR ALL 
USING (user_id IN (
  SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
));

-- RLS Policies for booking_requests
CREATE POLICY "Users can view their own booking requests" 
ON public.booking_requests 
FOR SELECT 
USING (user_id IN (
  SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Anyone can create booking requests" 
ON public.booking_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own booking requests" 
ON public.booking_requests 
FOR UPDATE 
USING (user_id IN (
  SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
));

-- RLS Policies for anonymous_feedback
CREATE POLICY "Anyone can create anonymous feedback" 
ON public.anonymous_feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view feedback about themselves" 
ON public.anonymous_feedback 
FOR SELECT 
USING (target_user_id IN (
  SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
));

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to count words in feedback
CREATE OR REPLACE FUNCTION public.count_words(input_text TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN array_length(string_to_array(trim(input_text), ' '), 1);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set word count
CREATE OR REPLACE FUNCTION public.set_feedback_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = public.count_words(NEW.message);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_anonymous_feedback_word_count
  BEFORE INSERT OR UPDATE ON public.anonymous_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.set_feedback_word_count();