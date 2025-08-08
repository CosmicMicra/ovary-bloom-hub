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
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });

  const [showForm, setShowForm] = useState(false);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://a5c2a0f63c37.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          Pregnancies: Number(formData.Pregnancies),
          Glucose: Number(formData.Glucose),
          BloodPressure: Number(formData.BloodPressure),
          SkinThickness: Number(formData.SkinThickness),
          Insulin: Number(formData.Insulin),
          BMI: Number(formData.BMI),
          DiabetesPedigreeFunction: Number(formData.DiabetesPedigreeFunction),
          Age: Number(formData.Age)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      
      // Assuming the API returns { prediction: number, severity: string, insights: string }
      const severity = result.prediction === 1 ? 'High Risk' : 'Low Risk';
      const score = result.prediction === 1 ? 30 : 80; // Update severity score based on prediction
      
      setPredictionResult({
        severity,
        insights: result.insights || `Based on your symptoms, you are classified as ${severity}. Continue monitoring your health.`,
        score
      });

      // Update the symptoms state with the new score
      setSymptoms(prev => ({ ...prev, mood: score / 10 }));

      toast({
        title: "Prediction Complete",
        description: `Your PCOD risk assessment shows: ${severity}`,
      });

      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => setShowForm(!showForm)}
            >
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

      {/* Symptom Logging Form */}
      {showForm && (
        <Card className="rounded-gentle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Log Symptoms for PCOD Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pregnancies">Number of Pregnancies</Label>
                  <Input
                    id="pregnancies"
                    type="number"
                    value={formData.Pregnancies}
                    onChange={(e) => handleInputChange('Pregnancies', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    value={formData.Glucose}
                    onChange={(e) => handleInputChange('Glucose', e.target.value)}
                    placeholder="100"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodpressure">Blood Pressure (mmHg)</Label>
                  <Input
                    id="bloodpressure"
                    type="number"
                    value={formData.BloodPressure}
                    onChange={(e) => handleInputChange('BloodPressure', e.target.value)}
                    placeholder="80"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skinthickness">Skin Thickness (mm)</Label>
                  <Input
                    id="skinthickness"
                    type="number"
                    value={formData.SkinThickness}
                    onChange={(e) => handleInputChange('SkinThickness', e.target.value)}
                    placeholder="20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insulin">Insulin Level (μU/mL)</Label>
                  <Input
                    id="insulin"
                    type="number"
                    value={formData.Insulin}
                    onChange={(e) => handleInputChange('Insulin', e.target.value)}
                    placeholder="80"
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
                  <Label htmlFor="pedigree">Diabetes Pedigree Function</Label>
                  <Input
                    id="pedigree"
                    type="number"
                    step="0.001"
                    value={formData.DiabetesPedigreeFunction}
                    onChange={(e) => handleInputChange('DiabetesPedigreeFunction', e.target.value)}
                    placeholder="0.5"
                    required
                  />
                </div>
                
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
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Get PCOD Risk Assessment
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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