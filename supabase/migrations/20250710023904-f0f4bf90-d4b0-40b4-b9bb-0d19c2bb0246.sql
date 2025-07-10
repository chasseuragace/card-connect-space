-- Insert sample companies
INSERT INTO public.companies (id, name, location, logo_url, theme_settings) VALUES 
(
  '123e4567-e89b-12d3-a456-426614174000',
  'TechCorp Solutions',
  'San Francisco, CA',
  'https://example.com/techcorp-logo.png',
  '{"primary_color": "#2563eb", "logo_position": "center"}'::jsonb
),
(
  '123e4567-e89b-12d3-a456-426614174001',
  'Innovation Labs',
  'New York, NY',
  'https://example.com/innovation-logo.png',
  '{"primary_color": "#7c3aed", "logo_position": "left"}'::jsonb
);

-- Insert sample user profiles (these will be created automatically when users sign up)
-- But we can insert additional sample data for testing
INSERT INTO public.user_profiles (id, user_id, company_id, name, position, email, phone, bio, calendar_integration) VALUES
(
  '223e4567-e89b-12d3-a456-426614174000',
  '323e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  'John Smith',
  'CEO',
  'john@techcorp.com',
  '+1 (555) 123-4567',
  'Passionate about technology and innovation. Leading TechCorp Solutions to new heights.',
  '{"google_calendar_id": "john@techcorp.com", "show_public_events": true}'::jsonb
),
(
  '223e4567-e89b-12d3-a456-426614174001',
  '323e4567-e89b-12d3-a456-426614174001',
  '123e4567-e89b-12d3-a456-426614174000',
  'Sarah Johnson',
  'CTO',
  'sarah@techcorp.com',
  '+1 (555) 123-4568',
  'Technology leader with 15+ years of experience in software development and team management.',
  '{"google_calendar_id": "sarah@techcorp.com", "show_public_events": true}'::jsonb
),
(
  '223e4567-e89b-12d3-a456-426614174002',
  '323e4567-e89b-12d3-a456-426614174002',
  '123e4567-e89b-12d3-a456-426614174000',
  'Mike Chen',
  'VP of Engineering',
  'mike@techcorp.com',
  '+1 (555) 123-4569',
  'Building scalable systems and leading engineering teams. Coffee enthusiast and open source contributor.',
  '{"google_calendar_id": "mike@techcorp.com", "show_public_events": true}'::jsonb
);

-- Insert sample teams
INSERT INTO public.teams (id, name, leader_id, company_id) VALUES
(
  '333e4567-e89b-12d3-a456-426614174000',
  'Executive Team',
  '223e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000'
),
(
  '333e4567-e89b-12d3-a456-426614174001',
  'Engineering Team',
  '223e4567-e89b-12d3-a456-426614174002',
  '123e4567-e89b-12d3-a456-426614174000'
);

-- Insert sample team memberships
INSERT INTO public.team_memberships (team_id, user_id) VALUES
('333e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174000'),
('333e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001'),
('333e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174001'),
('333e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174002');

-- Insert sample calendar events
INSERT INTO public.calendar_events (user_id, google_event_id, title, location, start_time, end_time, is_public, is_confirmed_attendance) VALUES
(
  '223e4567-e89b-12d3-a456-426614174000',
  'google_event_1',
  'Board Meeting',
  'Conference Room A, TechCorp HQ',
  '2024-01-15 09:00:00-08:00',
  '2024-01-15 10:30:00-08:00',
  true,
  true
),
(
  '223e4567-e89b-12d3-a456-426614174000',
  'google_event_2',
  'Client Presentation',
  'Downtown Office, Suite 400',
  '2024-01-15 14:00:00-08:00',
  '2024-01-15 15:30:00-08:00',
  true,
  true
),
(
  '223e4567-e89b-12d3-a456-426614174001',
  'google_event_3',
  'Technical Review',
  'TechCorp Labs',
  '2024-01-15 11:00:00-08:00',
  '2024-01-15 12:00:00-08:00',
  true,
  true
);

-- Insert sample booking requests
INSERT INTO public.booking_requests (user_id, requester_name, requester_email, requested_time, duration_minutes, location_preference, note, status) VALUES
(
  '223e4567-e89b-12d3-a456-426614174000',
  'Alex Rodriguez',
  'alex@example.com',
  '2024-01-16 10:00:00-08:00',
  60,
  'TechCorp Office',
  'Would like to discuss potential partnership opportunities.',
  'pending'
),
(
  '223e4567-e89b-12d3-a456-426614174000',
  'Emily Davis',
  'emily@startup.com',
  '2024-01-16 15:00:00-08:00',
  30,
  'Coffee Shop near office',
  'Quick chat about the new product launch.',
  'confirmed'
),
(
  '223e4567-e89b-12d3-a456-426614174001',
  'David Wilson',
  'david@techcompany.com',
  '2024-01-17 09:00:00-08:00',
  45,
  'Video Call',
  'Technical discussion about system architecture.',
  'pending'
);

-- Insert sample anonymous feedback
INSERT INTO public.anonymous_feedback (target_user_id, message) VALUES
(
  '223e4567-e89b-12d3-a456-426614174000',
  'Great leadership skills and always approachable. Really appreciate the open door policy and how you handle difficult situations with grace.'
),
(
  '223e4567-e89b-12d3-a456-426614174000',
  'Excellent communication during team meetings. Your technical insights are always valuable and help the team make better decisions.'
),
(
  '223e4567-e89b-12d3-a456-426614174001',
  'Outstanding technical expertise and mentoring skills. Always willing to help team members grow and learn new technologies.'
),
(
  '223e4567-e89b-12d3-a456-426614174002',
  'Great at breaking down complex problems into manageable tasks. Your code reviews are thorough and educational.'
);

-- Verify data integrity with some test queries
-- These are just comments to show what we would test, not actual queries to run
-- SELECT * FROM public.companies;
-- SELECT * FROM public.user_profiles;
-- SELECT * FROM public.teams t JOIN public.team_memberships tm ON t.id = tm.team_id;
-- SELECT * FROM public.calendar_events WHERE is_public = true;
-- SELECT * FROM public.booking_requests;
-- SELECT target_user_id, COUNT(*) as feedback_count FROM public.anonymous_feedback GROUP BY target_user_id;