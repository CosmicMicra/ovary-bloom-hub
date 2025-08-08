import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Flame, 
  Play, 
  Clock,
  Trophy,
  Coins,
  Star
} from "lucide-react";

interface ExerciseDay {
  day: number;
  completed: boolean;
  current: boolean;
  coins: number;
}

export const ExerciseTracker = () => {
  const [streak, setStreak] = useState(4);
  const [totalCoins, setTotalCoins] = useState(120);
  
  const [exerciseDays, setExerciseDays] = useState<ExerciseDay[]>([
    { day: 1, completed: true, current: false, coins: 15 },
    { day: 2, completed: true, current: false, coins: 20 },
    { day: 3, completed: true, current: false, coins: 15 },
    { day: 4, completed: true, current: false, coins: 25 },
    { day: 5, completed: false, current: true, coins: 20 },
    { day: 6, completed: false, current: false, coins: 20 },
    { day: 7, completed: false, current: false, coins: 30 },
  ]);

  const completeCurrentDay = () => {
    setExerciseDays(prev => {
      const updated = prev.map(day => {
        if (day.current) {
          setTotalCoins(total => total + day.coins);
          setStreak(s => s + 1);
          return { ...day, completed: true, current: false };
        }
        return day;
      });
      
      // Move to next day
      const currentIndex = prev.findIndex(d => d.current);
      if (currentIndex < prev.length - 1) {
        updated[currentIndex + 1].current = true;
      }
      
      return updated;
    });
  };

  const exercises = [
    {
      title: "PCOD Yoga Flow",
      duration: "15 min",
      difficulty: "Beginner",
      benefits: "Reduces stress, improves circulation",
      videoId: "yoga-flow"
    },
    {
      title: "Core Strengthening",
      duration: "12 min", 
      difficulty: "Intermediate",
      benefits: "Strengthens core, improves posture",
      videoId: "core-strength"
    },
    {
      title: "Cardio Walk",
      duration: "20 min",
      difficulty: "Beginner",
      benefits: "Boosts metabolism, improves mood",
      videoId: "cardio-walk"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Streak & Coins Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-gentle bg-gradient-to-r from-success/20 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/20 rounded-gentle">
                <Flame className="h-6 w-6 text-success streak-pulse" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-success">{streak} days</p>
                <p className="text-xs text-success/80">Keep it up! 🔥</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-gentle bg-gradient-to-r from-warning/20 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/20 rounded-gentle">
                <Coins className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Coins</p>
                <p className="text-3xl font-bold text-warning">{totalCoins}</p>
                <p className="text-xs text-warning/80">Great progress! ⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duolingo-style Progress Timeline */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Weekly Exercise Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-border"></div>
            
            {/* Timeline Dots */}
            <div className="flex justify-between items-center relative z-10">
              {exerciseDays.map((day) => (
                <div key={day.day} className="flex flex-col items-center">
                  <div
                    className={`
                      timeline-dot w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold
                      ${day.completed ? 'completed' : day.current ? 'current' : 'upcoming'}
                    `}
                  >
                    {day.completed ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span>Day {day.day}</span>
                    )}
                  </div>
                  
                  {day.completed && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <Coins className="h-3 w-3 text-warning" />
                      <span className="text-warning font-medium">+{day.coins}</span>
                    </div>
                  )}
                  
                  {day.current && (
                    <Badge variant="secondary" className="mt-2 text-xs rounded-soft">
                      Today
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Motivational Message */}
          <div className="mt-6 text-center p-4 bg-primary/10 rounded-soft">
            <p className="text-primary font-medium">
              Amazing! You're {streak} days in. Just 3 more days to complete the week! 🎯
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Exercise */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle>Today's Recommended Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, index) => (
              <Card key={index} className="rounded-soft border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-soft flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{exercise.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs rounded-soft">
                          {exercise.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.duration}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {exercise.benefits}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full rounded-soft"
                      onClick={index === 0 ? completeCurrentDay : undefined}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenge */}
      <Card className="rounded-gentle bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Weekly Challenge
              </h3>
              <p className="text-muted-foreground text-sm">
                Complete 7 days in a row to earn a special badge
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <span className="font-semibold text-warning">50 bonus coins</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};