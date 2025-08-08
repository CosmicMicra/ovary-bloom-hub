import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { MealPlans } from "@/components/MealPlans";
import { DoctorForum } from "@/components/DoctorForum";
import { Activity, Apple, MessageCircle, User } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            PCOD Care
          </h1>
          <p className="text-muted-foreground">
            Your personalized journey to better health
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-gentle bg-muted p-1">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 rounded-soft data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="exercise" 
              className="flex items-center gap-2 rounded-soft data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Exercise</span>
            </TabsTrigger>
            <TabsTrigger 
              value="meals" 
              className="flex items-center gap-2 rounded-soft data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Apple className="h-4 w-4" />
              <span className="hidden sm:inline">Meals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="forum" 
              className="flex items-center gap-2 rounded-soft data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Forum</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="dashboard" className="m-0">
              <Dashboard />
            </TabsContent>
            <TabsContent value="exercise" className="m-0">
              <ExerciseTracker />
            </TabsContent>
            <TabsContent value="meals" className="m-0">
              <MealPlans />
            </TabsContent>
            <TabsContent value="forum" className="m-0">
              <DoctorForum />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;