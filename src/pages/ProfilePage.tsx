import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/ui/container";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { CalendarIntegration } from "@/components/CalendarIntegration";
import { BookingCTA } from "@/components/BookingCTA";
import { Mail, Phone, MapPin, Calendar, Users, MessageSquare, Building } from "lucide-react";

// Types for profile data
interface UserProfile {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  bio: string;
  avatar_url: string;
  companies: {
    name: string;
    location: string;
    logo_url: string;
  };
}

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(`
          id,
          name,
          position,
          email,
          phone,
          bio,
          avatar_url,
          companies (
            name,
            location,
            logo_url
          )
        `)
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId,
  });

  const { data: todaysEvents } = useQuery({
    queryKey: ["calendar-events", userId],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", userId)
        .eq("is_public", true)
        .eq("is_confirmed_attendance", true)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_memberships")
        .select(`
          user_profiles!team_memberships_user_id_fkey (
            id,
            name,
            position,
            avatar_url
          )
        `)
        .eq("teams.leader_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: feedbackCount } = useQuery({
    queryKey: ["feedback-count", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("anonymous_feedback")
        .select("*", { count: "exact", head: true })
        .eq("target_user_id", userId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="animate-fade-in" variant="glass">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <Card className="animate-fade-in" variant="premium">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background-secondary">
      <Navbar />
      <Container className="py-8">
        {/* Hero Section */}
        <Card className="animate-fade-in premium mb-6">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name?.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">
                  {profile.name}
                </h1>
                <p className="text-xl text-muted-foreground">{profile.position}</p>
                <p className="text-lg text-muted-foreground">{profile.companies?.name}</p>
              </div>

              {feedbackCount > 0 && (
                <Badge variant="secondary" className="text-sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {feedbackCount} Reviews
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="premium">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {profile.phone && (
            <Card className="premium">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {profile.companies?.location && (
            <Card className="premium">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{profile.companies.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Today's Schedule */}
        {todaysEvents && todaysEvents.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Where I'll Be Today</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Date(event.start_time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar Integration */}
        <div className="mb-6">
          <CalendarIntegration userId={profile.id} />
        </div>

        {/* Booking CTA */}
        <div className="mb-6">
          <BookingCTA profileId={profile.id} profileName={profile.name} />
        </div>

        {/* Company Footer */}
        {profile.companies && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <Building className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{profile.companies.name}</h3>
                  <p className="text-muted-foreground">{profile.companies.location}</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  Download Our App
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default ProfilePage;