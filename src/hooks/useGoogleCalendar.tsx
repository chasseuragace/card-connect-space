import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

declare global {
  interface Window {
    gapi: any
  }
}

export const useGoogleCalendar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const initializeGoogleAuth = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => {
        window.gapi.load('auth2:client', () => {
          window.gapi.client.init({
            clientId: '766411854924-4oq8nqrj1q6o4q8qu7p7g3tb9q1r4t5p.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/calendar.readonly'
          }).then(() => {
            resolve(window.gapi.auth2.getAuthInstance())
          }).catch(reject)
        })
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      const authInstance = await initializeGoogleAuth() as any
      const user = await authInstance.signIn()
      const accessToken = user.getAuthResponse().access_token
      
      // Get current user from Supabase
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        throw new Error('No authenticated user')
      }

      // Sync calendar events
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'sync-events',
          userId: currentUser.id,
          accessToken: accessToken
        }
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: `Synced ${data.eventsCount} calendar events`
      })

      // Update user profile with calendar integration
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          calendar_integration: {
            google_calendar_id: user.getBasicProfile().getEmail(),
            show_public_events: true,
            last_sync: new Date().toISOString()
          }
        })
        .eq('user_id', currentUser.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
      }

      return true
    } catch (error) {
      console.error('Google Calendar sync error:', error)
      toast({
        title: 'Error',
        description: 'Failed to sync Google Calendar',
        variant: 'destructive'
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signInWithGoogle,
    isLoading
  }
}