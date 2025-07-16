import { useState } from 'react'
import { FeedbackForm } from '@/components/FeedbackForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MessageSquare, Users, Heart, TrendingUp } from 'lucide-react'

interface FeedbackCTAProps {
  profileId: string
  profileName: string
  feedbackCount?: number
}

export const FeedbackCTA = ({ profileId, profileName, feedbackCount = 0 }: FeedbackCTAProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Share Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Help {profileName} grow by sharing anonymous feedback
            </p>
            {feedbackCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {feedbackCount} people have already shared their thoughts
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Anonymous</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Constructive</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>Helpful</span>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Give Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Anonymous Feedback</DialogTitle>
            </DialogHeader>
            <FeedbackForm 
              profileId={profileId} 
              profileName={profileName}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}