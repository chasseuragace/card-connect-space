import { Calendar, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { format, isToday, isTomorrow } from 'date-fns'

interface CalendarEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  location?: string
  is_public: boolean
}

export const CalendarIntegration = ({ userId }: { userId: string }) => {
  const { signInWithGoogle, isLoading } = useGoogleCalendar()

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['calendar-events', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5)

      if (error) throw error
      return data as CalendarEvent[]
    }
  })

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    let dateLabel = ''
    if (isToday(start)) {
      dateLabel = 'Today'
    } else if (isTomorrow(start)) {
      dateLabel = 'Tomorrow'
    } else {
      dateLabel = format(start, 'MMM d')
    }

    const timeRange = `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`
    
    return { dateLabel, timeRange }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Calendar Integration
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="h-8"
        >
          {isLoading ? 'Syncing...' : 'Sync Google Calendar'}
        </Button>
      </CardHeader>
      <CardContent>
        {eventsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => {
              const { dateLabel, timeRange } = formatEventTime(event.start_time, event.end_time)
              return (
                <div key={event.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    {event.is_public && (
                      <Badge variant="secondary" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{dateLabel} • {timeRange}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No upcoming events. Sync your Google Calendar to see events here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}