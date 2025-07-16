import { useState } from 'react'
import { BookingForm } from '@/components/BookingForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, Users } from 'lucide-react'

interface BookingCTAProps {
  profileId: string
  profileName: string
}

export const BookingCTA = ({ profileId, profileName }: BookingCTAProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card className="premium">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Ready to Connect?</h2>
            <p className="text-lg text-muted-foreground">
              Schedule a meeting with {profileName} to discuss your ideas
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Quick Response</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Easy Booking</span>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="premium" className="px-8">
                <Calendar className="h-5 w-5 mr-2" />
                Book a Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule Your Meeting</DialogTitle>
              </DialogHeader>
              <BookingForm 
                profileId={profileId} 
                profileName={profileName}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}