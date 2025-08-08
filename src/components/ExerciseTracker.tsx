import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Check, 
  Flame, 
  Play, 
  Clock,
  Trophy,
  Coins,
  Star,
  X
} from "lucide-react";

interface ExerciseDay {
  day: number;
  completed: boolean;
  current: boolean;
  coins: number;
  videoId: string;
}

export const ExerciseTracker = () => {
  const [streak, setStreak] = useState(4);
  const [totalCoins, setTotalCoins] = useState(120);
  const [selectedDay, setSelectedDay] = useState<ExerciseDay | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  
  const [exerciseDays, setExerciseDays] = useState<ExerciseDay[]>([
    { day: 1, completed: true, current: false, coins: 15, videoId: "--jhKVdZOJM" },
    { day: 2, completed: true, current: false, coins: 20, videoId: "v7AYKMP6rOE" },
    { day: 3, completed: true, current: false, coins: 15, videoId: "4C-gxOE0j7s" },
    { day: 4, completed: true, current: false, coins: 25, videoId: "7KGZnS1rS9A" },
    { day: 5, completed: false, current: true, coins: 20, videoId: "8oFpcJMK3wE" },
    { day: 6, completed: false, current: false, coins: 20, videoId: "UItWltVZZmE" },
    { day: 7, completed: false, current: false, coins: 30, videoId: "MLY3n5UoVqg" },
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

  const handleDayClick = (day: ExerciseDay) => {
    setSelectedDay(day);
  };

  const startExercise = (videoId: string, title: string) => {
    setCurrentVideoId(videoId);
    setCurrentVideoTitle(title);
    setIsVideoDialogOpen(true);
    setSelectedDay(null);
  };

  const startWeeklyChallenge = () => {
    setCurrentVideoId("yB6DFubjzq0");
    setCurrentVideoTitle("Weekly PCOD Challenge");
    setIsVideoDialogOpen(true);
  };

  const exercises = [
    {
      title: "PCOD Yoga Flow",
      duration: "20 min",
      difficulty: "Beginner",
      benefits: "Reduces stress, improves circulation",
      videoId: "Y2eJb6L6LhE"
    },
    {
      title: "Zumba Dance Workout",
      duration: "20 min", 
      difficulty: "Intermediate",
      benefits: "Boosts metabolism, improves mood",
      videoId: "FPfQMVf4vwQ"
    },
    {
      title: "Yoga & Stretching",
      duration: "20 min",
      difficulty: "Beginner",
      benefits: "Flexibility and stress relief",
      videoId: "fq5EdfX2HqY"
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
                    onClick={() => handleDayClick(day)}
                    className={`
                      timeline-dot w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:scale-105 transition-transform
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

      {/* Day Selection Dialog */}
      {selectedDay && (
        <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
          <DialogContent className="rounded-gentle">
            <DialogHeader>
              <DialogTitle>Day {selectedDay.day} Exercise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {selectedDay.completed 
                  ? "Great job! You've completed this day's exercise. Want to do it again?"
                  : selectedDay.current
                  ? "Ready to start today's exercise?"
                  : "This exercise will be unlocked when you complete the previous days."
                }
              </p>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-warning" />
                <span className="text-sm">Earn {selectedDay.coins} coins</span>
              </div>
              <Button 
                onClick={() => startExercise(selectedDay.videoId, `Day ${selectedDay.day} Exercise`)}
                className="w-full rounded-soft"
                disabled={!selectedDay.completed && !selectedDay.current}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Exercise
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Video Player Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl rounded-gentle">
          <DialogHeader>
            <DialogTitle>{currentVideoTitle}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
              title={currentVideoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-soft"
            />
          </div>
        </DialogContent>
      </Dialog>

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
                    <div className="aspect-video bg-muted rounded-soft overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${exercise.videoId}`}
                        title={exercise.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
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
                      onClick={() => startExercise(exercise.videoId, exercise.title)}
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
          <div className="mt-4">
            <Button 
              onClick={startWeeklyChallenge}
              className="rounded-soft"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Weekly Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};