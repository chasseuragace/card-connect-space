import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleEvent {
  id: string
  summary: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  location?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, accessToken } = await req.json()

    if (action === 'sync-events') {
      // Get user profile to check calendar integration settings
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('calendar_integration, id')
        .eq('user_id', userId)
        .single()

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError)
        return new Response(
          JSON.stringify({ error: 'Profile not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Fetch events from Google Calendar
      const calendarResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      )

      if (!calendarResponse.ok) {
        console.error('Google Calendar API error:', await calendarResponse.text())
        return new Response(
          JSON.stringify({ error: 'Failed to fetch calendar events' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const calendarData = await calendarResponse.json()
      const events = calendarData.items || []

      // Process and save events
      const processedEvents = events
        .filter((event: GoogleEvent) => event.start?.dateTime || event.start?.date)
        .map((event: GoogleEvent) => ({
          google_event_id: event.id,
          user_id: profile.id,
          title: event.summary || 'Untitled Event',
          start_time: event.start?.dateTime || event.start?.date,
          end_time: event.end?.dateTime || event.end?.date,
          location: event.location || null,
          is_public: profile.calendar_integration?.show_public_events || false,
          is_confirmed_attendance: true,
        }))

      // Delete existing Google Calendar events for this user
      await supabase
        .from('calendar_events')
        .delete()
        .eq('user_id', profile.id)
        .not('google_event_id', 'is', null)

      // Insert new events
      if (processedEvents.length > 0) {
        const { error: insertError } = await supabase
          .from('calendar_events')
          .insert(processedEvents)

        if (insertError) {
          console.error('Error inserting events:', insertError)
          return new Response(
            JSON.stringify({ error: 'Failed to save events' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      console.log(`Synced ${processedEvents.length} events for user ${userId}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          eventsCount: processedEvents.length,
          message: 'Calendar events synced successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})