import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays, Clock, MapPin, User, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const bookingSchema = z.object({
  requesterName: z.string().min(2, 'Name must be at least 2 characters'),
  requesterEmail: z.string().email('Please enter a valid email'),
  requestedTime: z.date({
    required_error: 'Please select a date and time',
  }),
  durationMinutes: z.number().min(15).max(240),
  locationPreference: z.string().optional(),
  note: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  profileId: string
  profileName: string
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
]

const durations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
]

export const BookingForm = ({ profileId, profileName }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      durationMinutes: 60,
    },
  })

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Missing Information',
        description: 'Please select both a date and time',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const requestedDateTime = new Date(selectedDate)
      requestedDateTime.setHours(hours, minutes, 0, 0)

      const { error } = await supabase
        .from('booking_requests')
        .insert({
          user_id: profileId,
          requester_name: data.requesterName,
          requester_email: data.requesterEmail,
          requested_time: requestedDateTime.toISOString(),
          duration_minutes: data.durationMinutes,
          location_preference: data.locationPreference || null,
          note: data.note || null,
        })

      if (error) throw error

      toast({
        title: 'Booking Request Sent!',
        description: `Your meeting request has been sent to ${profileName}. They will respond soon.`,
      })

      // Reset form
      form.reset()
      setSelectedDate(undefined)
      setSelectedTime(undefined)
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send booking request. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Book a Meeting with {profileName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requesterName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name
              </Label>
              <Input
                id="requesterName"
                placeholder="Enter your full name"
                {...form.register('requesterName')}
              />
              {form.formState.errors.requesterName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.requesterName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesterEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="requesterEmail"
                type="email"
                placeholder="your.email@example.com"
                {...form.register('requesterEmail')}
              />
              {form.formState.errors.requesterEmail && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.requesterEmail.message}
                </p>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Select Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration
              </Label>
              <Select
                value={form.watch('durationMinutes')?.toString()}
                onValueChange={(value) => form.setValue('durationMinutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Preference */}
          <div className="space-y-2">
            <Label htmlFor="locationPreference" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Meeting Location (Optional)
            </Label>
            <Input
              id="locationPreference"
              placeholder="e.g., Coffee shop, Office, Video call"
              {...form.register('locationPreference')}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="note"
              placeholder="Brief description of what you'd like to discuss..."
              className="min-h-[100px]"
              {...form.register('note')}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}