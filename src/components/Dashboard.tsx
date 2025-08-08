import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Moon, 
  Dumbbell, 
  Scale,
  Zap,
  Calendar,
  Plus,
  Download,
  Loader2
} from "lucide-react";
import jsPDF from 'jspdf';

export const Dashboard = () => {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState({
    acneDays: 2,
    sleepQuality: 7,
    exerciseMinutes: 30,
    weight: 65,
    mood: 6
  });

  const [formData, setFormData] = useState({
    Age: '',
    BMI: '',
    CycleLength: '',
    AcneDays: '',
    WeightGain: '',
    HormoneLevel: '',
    ExerciseToday: '',
    SleepQuality: ''
  });

  const [showForm, setShowForm] = useState(true); // Always show form
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    severity: string;
    insights: string;
    score: number;
  } | null>(null);

  // Calculate PCOD Severity Score (simplified algorithm)
  const calculateSeverityScore = () => {
    const acneScore = Math.max(0, 10 - symptoms.acneDays);
    const sleepScore = symptoms.sleepQuality;
    const exerciseScore = Math.min(10, symptoms.exerciseMinutes / 3);
    const moodScore = symptoms.mood;
    
    return Math.round((acneScore + sleepScore + exerciseScore + moodScore) / 4 * 10);
  };

  const severityScore = 22; // Set to 22 as requested
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('https://a5c2a0f63c37.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
          Age: Number(formData.Age),
          BMI: Number(formData.BMI),
          CycleLength: Number(formData.CycleLength),
          AcneDays: Number(formData.AcneDays),
          WeightGain: Number(formData.WeightGain),
          HormoneLevel: Number(formData.HormoneLevel),
          ExerciseToday: Number(formData.ExerciseToday),
          SleepQuality: Number(formData.SleepQuality)
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      // Map severity to score
      const severityToScore = {
        'High': 30,
        'Medium': 60,
        'Low': 85
      };
      
      const score = severityToScore[result.severity_category as keyof typeof severityToScore] || 50;
      
      setPredictionResult({
        severity: result.severity_category,
        insights: result.insights,
        score
      });

      // Update the symptoms state with the new score
      setSymptoms(prev => ({ ...prev, mood: score / 10 }));

      toast({
        title: "Assessment Complete",
        description: `PCOD Severity: ${result.severity_category}`,
      });

      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Fallback: Create a mock prediction based on form data for demo purposes
      const mockSeverity = getMockSeverity();
      const mockScore = mockSeverity === 'High' ? 30 : mockSeverity === 'Medium' ? 60 : 85;
      
      setPredictionResult({
        severity: mockSeverity,
        insights: `Demo Mode: Based on your inputs, your PCOD severity appears to be ${mockSeverity}. ${mockSeverity === 'High' ? 'Consider consulting your doctor.' : mockSeverity === 'Medium' ? 'Maintain healthy habits.' : 'Keep up the good work!'}`,
        score: mockScore
      });

      setSymptoms(prev => ({ ...prev, mood: mockScore / 10 }));

      toast({
        title: "Assessment Complete (Demo Mode)",
        description: `API unavailable. Using demo prediction: ${mockSeverity} severity`,
        variant: "default"
      });

      setShowForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockSeverity = () => {
    // Simple mock logic based on form inputs using your dataset patterns
    const age = Number(formData.Age) || 0;
    const bmi = Number(formData.BMI) || 0;
    const cycleLength = Number(formData.CycleLength) || 0;
    const acneDays = Number(formData.AcneDays) || 0;
    const weightGain = Number(formData.WeightGain) || 0;
    const hormoneLevel = Number(formData.HormoneLevel) || 0;
    const exercise = Number(formData.ExerciseToday) || 0;
    const sleepQuality = Number(formData.SleepQuality) || 0;

    // Calculate a mock severity score based on your dataset patterns
    let score = 50; // base score
    
    // Age factor (younger or older can increase risk)
    if (age < 20 || age > 40) score += 5;
    
    // BMI factor
    if (bmi > 30) score += 10;
    else if (bmi > 25) score += 5;
    
    // Cycle length (irregular cycles)
    if (cycleLength > 35 || cycleLength < 21) score += 10;
    
    // Acne days (more acne = higher severity)
    score += acneDays * 2;
    
    // Weight gain
    if (weightGain > 0) score += 5;
    
    // Hormone level (higher = more severity)
    score += hormoneLevel;
    
    // Exercise (less exercise = higher severity)
    if (exercise === 0) score += 10;
    
    // Sleep quality (poor sleep = higher severity)
    if (sleepQuality === 0) score += 10;

    // Cap the score between 40 and 100
    score = Math.min(100, Math.max(40, score));
    
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Set up colors
    const primaryColor = [116, 90, 242]; // Purple
    const secondaryColor = [255, 107, 107]; // Coral
    const successColor = [34, 197, 94]; // Green
    const warningColor = [251, 191, 36]; // Orange
    const textColor = [51, 51, 51]; // Dark gray
    
    // Header with background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PCOD Profile Tracking Report', 20, 25);
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient: Jiya`, 20, 55);
    doc.text(`Report Date: ${currentDate}`, 20, 65);
    doc.text(`Generated by: PCOD Care App`, 20, 75);
    
    // Overall Health Score Section
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 85, 180, 35, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, 85, 180, 35, 'S');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Health Assessment', 20, 100);
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`PCOD Severity Score: ${severityScore}% (${scoreBadge.label})`, 20, 110);
    
    // Current Health Metrics Table
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Current Health Metrics', 20, 135);
    
    // Table header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, 145, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Metric', 25, 152);
    doc.text('Current Value', 80, 152);
    doc.text('Status', 140, 152);
    
    // Table rows
    const metrics = [
      { metric: 'Acne Days This Week', value: `${symptoms.acneDays}/7 days`, status: symptoms.acneDays <= 2 ? 'Good' : 'Needs Attention' },
      { metric: 'Sleep Quality', value: `${symptoms.sleepQuality}/10`, status: symptoms.sleepQuality >= 7 ? 'Excellent' : 'Fair' },
      { metric: 'Exercise Minutes Daily', value: `${symptoms.exerciseMinutes} minutes`, status: symptoms.exerciseMinutes >= 30 ? 'Great' : 'Increase' },
      { metric: 'Current Weight', value: `${symptoms.weight} kg`, status: 'Stable' },
      { metric: 'Mood Rating', value: `${symptoms.mood}/10`, status: symptoms.mood >= 7 ? 'Positive' : 'Monitor' }
    ];
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont('helvetica', 'normal');
    
    metrics.forEach((row, index) => {
      const yPos = 162 + (index * 10);
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(20, yPos - 5, 170, 10, 'F');
      }
      
      doc.text(row.metric, 25, yPos);
      doc.text(row.value, 80, yPos);
      
      // Color code status
      if (row.status === 'Excellent' || row.status === 'Great' || row.status === 'Good' || row.status === 'Positive') {
        doc.setTextColor(successColor[0], successColor[1], successColor[2]);
      } else if (row.status === 'Fair' || row.status === 'Monitor' || row.status === 'Stable') {
        doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
      } else {
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      }
      
      doc.text(row.status, 140, yPos);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    });
    
    // Weekly Trends
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Trends & Progress', 20, 230);
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Positive trends in green
    doc.setTextColor(successColor[0], successColor[1], successColor[2]);
    doc.text('↗ Sleep Quality: Improved by 15%', 25, 245);
    doc.text('↗ Exercise: Increased by 20 minutes/day', 25, 255);
    
    // Areas to monitor in orange
    doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
    doc.text('→ Acne Days: 2 days this week (monitor)', 25, 265);
    
    // Recommendations
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Personalized Recommendations', 20, 285);
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (severityScore < 60) {
      doc.text('• Focus on consistent sleep schedule (7-9 hours)', 25, 300);
      doc.text('• Increase physical activity to 30+ minutes daily', 25, 310);
      doc.text('• Consider stress management techniques', 25, 320);
    } else if (severityScore < 80) {
      doc.text('• Maintain current healthy habits', 25, 300);
      doc.text('• Continue regular exercise routine', 25, 310);
      doc.text('• Monitor hormonal symptoms', 25, 320);
    } else {
      doc.text('• Excellent progress! Keep up the great work', 25, 300);
      doc.text('• Continue current lifestyle habits', 25, 310);
      doc.text('• Regular check-ups recommended', 25, 320);
    }
    
    // Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 275, 190, 275);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This report is generated from self-tracked data and should be discussed with your healthcare provider.', 20, 285);
    doc.text('Generated by PCOD Care App - Your personalized health companion', 20, 292);
    
    doc.save(`PCOD-Profile-Tracking-${currentDate.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="rounded-gentle bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Welcome back, Jiya! 👋
              </h2>
              <p className="text-muted-foreground mb-4">
                Let's check how you're feeling today
              </p>
              <Button 
                onClick={generatePDFReport}
                variant="outline" 
                className="rounded-soft bg-card/50 hover:bg-card border-primary/20 hover:border-primary/40"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF of Profile Tracking
              </Button>
            </div>
            <div className="text-center ml-6">
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
            {predictionResult && (
              <div className="mt-4 p-3 bg-primary/10 rounded-soft">
                <h4 className="font-semibold text-primary mb-2">Latest Assessment: {predictionResult.severity}</h4>
                <p className="text-sm text-muted-foreground">{predictionResult.insights}</p>
              </div>
            )}
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
            <Button 
              variant="outline" 
              className="rounded-soft h-auto p-4 flex flex-col gap-2"
              disabled
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">Form Always Open</span>
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

      {/* Symptom Logging Form - Always Visible */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            PCOD Assessment Form (Based on Your Dataset)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.Age}
                  onChange={(e) => handleInputChange('Age', e.target.value)}
                  placeholder="25"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={formData.BMI}
                  onChange={(e) => handleInputChange('BMI', e.target.value)}
                  placeholder="25.0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cyclelength">Cycle Length (days)</Label>
                <Input
                  id="cyclelength"
                  type="number"
                  value={formData.CycleLength}
                  onChange={(e) => handleInputChange('CycleLength', e.target.value)}
                  placeholder="28"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="acnedays">Acne Days (per month)</Label>
                <Input
                  id="acnedays"
                  type="number"
                  value={formData.AcneDays}
                  onChange={(e) => handleInputChange('AcneDays', e.target.value)}
                  placeholder="5"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weightgain">Weight Gain (0=No, 1=Yes)</Label>
                <Input
                  id="weightgain"
                  type="number"
                  value={formData.WeightGain}
                  onChange={(e) => handleInputChange('WeightGain', e.target.value)}
                  placeholder="0"
                  min="0"
                  max="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hormonelevel">Hormone Level</Label>
                <Input
                  id="hormonelevel"
                  type="number"
                  step="0.1"
                  value={formData.HormoneLevel}
                  onChange={(e) => handleInputChange('HormoneLevel', e.target.value)}
                  placeholder="8.5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exercisetoday">Exercise Today (0=No, 1=Yes)</Label>
                <Input
                  id="exercisetoday"
                  type="number"
                  value={formData.ExerciseToday}
                  onChange={(e) => handleInputChange('ExerciseToday', e.target.value)}
                  placeholder="1"
                  min="0"
                  max="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sleepquality">Sleep Quality (0=Poor, 1=Good)</Label>
                <Input
                  id="sleepquality"
                  type="number"
                  value={formData.SleepQuality}
                  onChange={(e) => handleInputChange('SleepQuality', e.target.value)}
                  placeholder="1"
                  min="0"
                  max="1"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Get PCOD Severity Prediction
              </Button>
            </div>
          </form>
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