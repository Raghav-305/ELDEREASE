import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Heart, Calendar, MessageCircle, Shield, Users } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading ElderEase...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ElderEase</h1>
              <p className="text-sm text-muted-foreground">Healthcare Made Simple</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Profile
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium">Welcome back!</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Your Health Companion
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering elderly patients with smart medication reminders, AI health assistance, and seamless doctor connectivity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Medicine Reminders</CardTitle>
              <CardDescription>
                Never miss a dose with intelligent scheduling and real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/medicine')}>
                View My Medications
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-full w-fit">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>AI Health Assistant</CardTitle>
              <CardDescription>
                Get instant answers about food interactions, medication guidance, and health tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/health-assistant')}>
                Chat with Assistant
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-full w-fit">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Doctor Appointments</CardTitle>
              <CardDescription>
                Book consultations and manage your healthcare schedule effortlessly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/appointments')}>
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Stats Dashboard Placeholder */}
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Today's Health Overview</CardTitle>
                <CardDescription>Your daily medication and health summary</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">3/4</div>
                <p className="text-sm text-muted-foreground">Medications Taken</p>
              </div>
              <div className="p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">2</div>
                <p className="text-sm text-muted-foreground">Upcoming Reminders</p>
              </div>
              <div className="p-4 bg-accent/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">1</div>
                <p className="text-sm text-muted-foreground">Doctor Appointment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Benefits */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Why Choose ElderEase?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Secure & Professional</h4>
              <p className="text-muted-foreground text-sm">
                Enterprise-grade security protecting your health information
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Trusted by Healthcare</h4>
              <p className="text-muted-foreground text-sm">
                Designed with input from doctors and elderly care specialists
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Eco-Friendly</h4>
              <p className="text-muted-foreground text-sm">
                Reducing paper waste and unnecessary hospital visits
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
