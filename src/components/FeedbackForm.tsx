import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageSquare, Send, Star, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

const feedbackSchema = z.object({
  message: z.string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback must be less than 1000 characters'),
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

interface FeedbackFormProps {
  profileId: string
  profileName: string
}

export const FeedbackForm = ({ profileId, profileName }: FeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  })

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('anonymous_feedback')
        .insert({
          target_user_id: profileId,
          message: data.message,
          word_count: data.message.split(' ').length,
        })

      if (error) throw error

      toast({
        title: 'Feedback Sent!',
        description: 'Your anonymous feedback has been submitted successfully.',
      })

      setSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Feedback submission error:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <ThumbsUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Thank You!</h3>
              <p className="text-muted-foreground">
                Your anonymous feedback has been sent to {profileName}. 
                Your input helps them grow and improve.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSubmitted(false)}
            >
              Send Another Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentLength = form.watch('message')?.length || 0
  const maxLength = 1000

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Send Anonymous Feedback to {profileName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your thoughts, suggestions, or appreciation anonymously. 
          Your feedback helps them improve and grow.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Your Feedback</label>
              <Badge variant={currentLength > maxLength ? 'destructive' : 'secondary'}>
                {currentLength}/{maxLength}
              </Badge>
            </div>
            <Textarea
              placeholder={`Share your thoughts about ${profileName}... This could be about their work, collaboration style, ideas for improvement, or just general appreciation.`}
              className="min-h-[150px] resize-none"
              {...form.register('message')}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Tips for helpful feedback:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Be specific and constructive</li>
                  <li>Focus on behaviors rather than personality</li>
                  <li>Include both positive observations and areas for growth</li>
                  <li>Keep it professional and respectful</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || currentLength < 10}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Sending Feedback...' : 'Send Anonymous Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}