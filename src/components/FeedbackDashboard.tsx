import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/integrations/supabase/client'
import { MessageSquare, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'

interface FeedbackItem {
  id: string
  message: string
  word_count: number
  created_at: string
}

export const FeedbackDashboard = () => {
  const { user } = useAuth()

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name')
        .eq('user_id', user.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const { data: feedback, isLoading } = useQuery({
    queryKey: ['user-feedback', profile?.id],
    queryFn: async () => {
      if (!profile) return []
      const { data, error } = await supabase
        .from('anonymous_feedback')
        .select('*')
        .eq('target_user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FeedbackItem[]
    },
    enabled: !!profile,
  })

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to view your feedback.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!feedback || feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
            <p className="text-muted-foreground mb-4">
              When people share anonymous feedback about you, it will appear here.
            </p>
            <Button variant="outline" asChild>
              <a href={`/profile/${profile?.id}`} target="_blank" rel="noopener noreferrer">
                <Users className="h-4 w-4 mr-2" />
                View Your Public Profile
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalWords = feedback.reduce((sum, item) => sum + item.word_count, 0)
  const avgWordsPerFeedback = Math.round(totalWords / feedback.length)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{feedback.length}</p>
                <p className="text-xs text-muted-foreground">Total Feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{avgWordsPerFeedback}</p>
                <p className="text-xs text-muted-foreground">Avg Words</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalWords}</p>
                <p className="text-xs text-muted-foreground">Total Words</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div key={item.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs">
                        #{feedback.length - index}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(item.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.word_count} words</span>
                    </div>
                  </div>
                  
                  {index < feedback.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}