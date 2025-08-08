import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Moon, 
  Dumbbell, 
  Scale,
  Zap,
  Calendar,
  Plus
} from "lucide-react";

export const Dashboard = () => {
  const [symptoms, setSymptoms] = useState({
    acneDays: 2,
    sleepQuality: 7,
    exerciseMinutes: 30,
    weight: 65,
    mood: 6
  });

  // Calculate PCOD Severity Score (simplified algorithm)
  const calculateSeverityScore = () => {
    const acneScore = Math.max(0, 10 - symptoms.acneDays);
    const sleepScore = symptoms.sleepQuality;
    const exerciseScore = Math.min(10, symptoms.exerciseMinutes / 3);
    const moodScore = symptoms.mood;
    
    return Math.round((acneScore + sleepScore + exerciseScore + moodScore) / 4 * 10);
  };

  const severityScore = calculateSeverityScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const };
    if (score >= 60) return { label: "Good", variant: "secondary" as const };
    return { label: "Needs Attention", variant: "destructive" as const };
  };

  const scoreBadge = getScoreBadge(severityScore);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="rounded-gentle bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-muted-foreground">
                Let's check how you're feeling today
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                <span className={getScoreColor(severityScore)}>
                  {severityScore}%
                </span>
              </div>
              <Badge variant={scoreBadge.variant} className="rounded-soft">
                {scoreBadge.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PCOD Severity Score */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            PCOD Severity Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Health</span>
              <span className="font-semibold">{severityScore}%</span>
            </div>
            <Progress value={severityScore} className="h-3 rounded-soft" />
            <p className="text-sm text-muted-foreground">
              Based on your recent symptoms, sleep, exercise, and mood tracking
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-gentle">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/20 rounded-soft">
                <Calendar className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acne Days</p>
                <p className="text-lg font-semibold">{symptoms.acneDays}/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-gentle">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-soft">
                <Moon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sleep Quality</p>
                <p className="text-lg font-semibold">{symptoms.sleepQuality}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-gentle">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-soft">
                <Dumbbell className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exercise</p>
                <p className="text-lg font-semibold">{symptoms.exerciseMinutes}min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-gentle">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-soft">
                <Scale className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg font-semibold">{symptoms.weight}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle>Quick Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="rounded-soft h-auto p-4 flex flex-col gap-2">
              <Plus className="h-4 w-4" />
              <span className="text-xs">Log Symptoms</span>
            </Button>
            <Button variant="outline" className="rounded-soft h-auto p-4 flex flex-col gap-2">
              <Moon className="h-4 w-4" />
              <span className="text-xs">Sleep Entry</span>
            </Button>
            <Button variant="outline" className="rounded-soft h-auto p-4 flex flex-col gap-2">
              <Dumbbell className="h-4 w-4" />
              <span className="text-xs">Exercise Log</span>
            </Button>
            <Button variant="outline" className="rounded-soft h-auto p-4 flex flex-col gap-2">
              <Scale className="h-4 w-4" />
              <span className="text-xs">Weight Check</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle>This Week's Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-soft">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-success">Sleep Quality</p>
                <p className="text-sm text-muted-foreground">Improved by 15%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-soft">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-success">Exercise</p>
                <p className="text-sm text-muted-foreground">Up by 20 min/day</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-soft">
              <TrendingDown className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium text-warning">Acne Days</p>
                <p className="text-sm text-muted-foreground">2 days this week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};