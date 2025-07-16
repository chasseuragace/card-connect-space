import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Container } from '@/components/ui/container'
import { Navbar } from '@/components/ui/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeedbackDashboard } from '@/components/FeedbackDashboard'
import { Button } from '@/components/ui/button'
import { User, MessageSquare, Calendar, ExternalLink } from 'lucide-react'

const Profile = () => {
  const { user, loading } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ["current-user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user wants to view their own profile page, redirect them
  if (userProfile?.id && window.location.pathname === '/profile') {
    return <Navigate to={`/profile/${userProfile.id}`} replace />;
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background-secondary">
      <Navbar />
      <Container className="py-8">
        <div className="space-y-6">
          {/* Header */}
          <Card className="premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">Your Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage your profile and view feedback
                  </p>
                </div>
                {userProfile && (
                  <Button variant="outline" asChild>
                    <a 
                      href={`/profile/${userProfile.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Public Profile
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="feedback" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feedback">
              <FeedbackDashboard />
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Booking Management</h3>
                  <p className="text-muted-foreground">
                    Booking management features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
                  <p className="text-muted-foreground">
                    Profile editing features coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default Profile;