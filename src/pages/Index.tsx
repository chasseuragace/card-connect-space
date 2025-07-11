import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Navbar } from "@/components/ui/navbar";
import { Link } from "react-router-dom";
import { QrCode, Users, Calendar, MessageSquare, LogOut } from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-radial from-background to-background-secondary">
        <Navbar />
        <Container className="py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-2xl premium">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold mb-4">Smart Business Cards</CardTitle>
                <CardDescription className="text-xl">
                  Transform your networking with intelligent digital business cards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <QrCode className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">QR Code Integration</h3>
                      <p className="text-sm text-muted-foreground">Instant profile access via QR scan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Calendar Integration</h3>
                      <p className="text-sm text-muted-foreground">Show your real-time availability</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Team Management</h3>
                      <p className="text-sm text-muted-foreground">Manage your entire team hierarchy</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Anonymous Feedback</h3>
                      <p className="text-sm text-muted-foreground">Receive honest team insights</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button variant="premium" size="lg" asChild className="w-full md:w-auto">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-background-secondary">
      <Navbar />
      <Container className="py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Manage your digital business card</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Manage your professional information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Active since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button asChild>
                <Link to="/profile">View Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your professional profile and QR code
              </p>
              <Button className="w-full" asChild>
                <Link to="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sync your Google Calendar and manage bookings
              </p>
              <Button className="w-full" variant="outline">Setup Calendar</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage your team members and hierarchy
              </p>
              <Button className="w-full" variant="outline">Manage Team</Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Index;