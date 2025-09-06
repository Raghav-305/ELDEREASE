import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Clock, ArrowLeft, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==================
// Types
// ==================
interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];   // e.g. ["08:00", "18:00"]
  nextDose: string;
  status: "active" | "inactive";
  startDate: string;     // ISO format "YYYY-MM-DD"
  durationDays: number;
  takenToday: boolean;
}

// ==================
// Utilities
// ==================

// Check if medicine is still active (within duration)
const isActive = (med: Medication): boolean => {
  const start = new Date(med.startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + Number(med.durationDays)); // ✅ cast to number
  const today = new Date();
  return today >= start && today <= end;
};

// Check if it's time to take a dose (within ±30 mins)
const isTimeToTake = (timeString: string): boolean => {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);
  const medTime = new Date();
  medTime.setHours(hours, minutes, 0, 0);
  return Math.abs(now.getTime() - medTime.getTime()) <= 30 * 60 * 1000;
};

const Medicine = () => {
  const navigate = useNavigate();

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeOfDay: ["08:00"],
      nextDose: "08:00",
      status: "active",
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 30,
      takenToday: false
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeOfDay: ["08:00", "18:00"],
      nextDose: "18:00",
      status: "active",
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 60,
      takenToday: false
    }
  ]);

  // form states
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [durationDays, setDurationDays] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddMedication = () => {
    if (!medicationName || !dosage || !frequency || !durationDays) return;

    const freqLabel =
      frequency === "once" ? "Once daily" :
      frequency === "twice" ? "Twice daily" :
      frequency === "three" ? "Three times daily" :
      frequency === "four" ? "Four times daily" :
      "As needed";

    const newMed: Medication = {
      id: medications.length + 1,
      name: medicationName,
      dosage,
      frequency: freqLabel,
      timeOfDay: timesOfDay.length ? timesOfDay : ["08:00"],
      nextDose: timesOfDay[0] || "08:00",
      status: "active",
      startDate,
      durationDays: Number(durationDays), // ✅ ensure number
      takenToday: false
    };

    setMedications([...medications, newMed]);

    // reset form
    setMedicationName("");
    setDosage("");
    setFrequency("");
    setTimesOfDay([]);
    setDurationDays("");
    setStartDate(new Date().toISOString().split('T')[0]);

    setIsDialogOpen(false);
  };

  // toggle taken
  const markAsTaken = (id: number, time: string) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, takenToday: true, nextDose: time } : med
      )
    );
  };

  const todayMeds = medications.filter((med) => isActive(med));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Medications</h1>
                <p className="text-sm text-muted-foreground">Manage your medicine schedule</p>
              </div>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>Enter the details of your new medication</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicationName">Medication Name</Label>
                  <Input
                    id="medicationName"
                    placeholder="Enter medication name"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 10mg"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="How often?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="three">Three times daily</SelectItem>
                        <SelectItem value="four">Four times daily</SelectItem>
                        <SelectItem value="asneeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time of day */}
                {frequency && frequency !== "asneeded" && (
                  <div className="space-y-2">
                    <Label>Time of Day</Label>
                    <div className="grid gap-2">
                      {Array.from(
                        { length: frequency === "once" ? 1 :
                                  frequency === "twice" ? 2 :
                                  frequency === "three" ? 3 :
                                  frequency === "four" ? 4 : 0 },
                        (_, i) => (
                          <Input
                            key={i}
                            type="time"
                            value={timesOfDay[i] || ""}
                            onChange={(e) => {
                              const newTimes = [...timesOfDay];
                              newTimes[i] = e.target.value;
                              setTimesOfDay(newTimes);
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (days)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleAddMedication}>
                  Add Medication
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Today's Schedule */}
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your medication reminders for today</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayMeds.map((med) =>
                med.timeOfDay.map((time, i) => (
                  <div
                    key={`${med.id}-${i}`}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      med.takenToday ? "bg-green-100" : "bg-accent/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Pill className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {med.name} {med.dosage}
                        </p>
                        <p className="text-sm text-muted-foreground">{time}</p>
                      </div>
                    </div>
                    {med.takenToday ? (
                      <Badge variant="secondary">Taken</Badge>
                    ) : isTimeToTake(time) ? (
                      <Button size="sm" onClick={() => markAsTaken(med.id, time)}>
                        Take
                      </Button>
                    ) : (
                      <Badge>Upcoming</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Medications */}
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Medications</CardTitle>
            <CardDescription>Complete list of your current medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{med.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {med.timeOfDay.join(", ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {med.durationDays} days (from {med.startDate})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={med.status === "active" ? "default" : "secondary"}>
                      {med.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Medicine;
