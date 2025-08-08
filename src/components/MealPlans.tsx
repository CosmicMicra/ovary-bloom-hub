import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Apple, 
  Clock, 
  Users, 
  Heart,
  Leaf,
  ChefHat,
  BookOpen,
  Star
} from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  category: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  rating: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  image: string;
}

export const MealPlans = () => {
  const [selectedCategory, setSelectedCategory] = useState("breakfast");

  const recipes: Recipe[] = [
    {
      id: "1",
      title: "Cinnamon Quinoa Bowl",
      category: "breakfast",
      cookTime: "15 min",
      servings: 2,
      difficulty: "Easy",
      rating: 4.8,
      description: "A protein-rich breakfast that helps stabilize blood sugar levels",
      benefits: ["High Fiber", "Low GI", "Anti-inflammatory"],
      ingredients: ["Quinoa", "Cinnamon", "Almond milk", "Berries", "Nuts"],
      image: "quinoa-bowl"
    },
    {
      id: "2",
      title: "Turmeric Lentil Curry",
      category: "lunch",
      cookTime: "30 min",
      servings: 4,
      difficulty: "Medium",
      rating: 4.9,
      description: "Anti-inflammatory curry packed with plant protein",
      benefits: ["Anti-inflammatory", "High Protein", "Hormone Balancing"],
      ingredients: ["Red lentils", "Turmeric", "Coconut milk", "Spinach", "Ginger"],
      image: "lentil-curry"
    },
    {
      id: "3",
      title: "Salmon & Avocado Salad",
      category: "dinner",
      cookTime: "20 min",
      servings: 2,
      difficulty: "Easy",
      rating: 4.7,
      description: "Omega-3 rich dinner that supports hormone health",
      benefits: ["Omega-3", "Healthy Fats", "Low Carb"],
      ingredients: ["Salmon fillet", "Avocado", "Mixed greens", "Olive oil", "Lemon"],
      image: "salmon-salad"
    },
    {
      id: "4",
      title: "Chia Seed Pudding",
      category: "snacks",
      cookTime: "5 min + overnight",
      servings: 1,
      difficulty: "Easy",
      rating: 4.6,
      description: "Nutrient-dense snack that helps curb cravings",
      benefits: ["High Fiber", "Omega-3", "Blood Sugar Friendly"],
      ingredients: ["Chia seeds", "Almond milk", "Vanilla", "Berries", "Honey"],
      image: "chia-pudding"
    }
  ];

  const categories = [
    { id: "breakfast", label: "Breakfast", icon: "☀️" },
    { id: "lunch", label: "Lunch", icon: "🌞" },
    { id: "dinner", label: "Dinner", icon: "🌙" },
    { id: "snacks", label: "Snacks", icon: "🍎" }
  ];

  const filteredRecipes = recipes.filter(recipe => recipe.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/20 text-success";
      case "Medium": return "bg-warning/20 text-warning";
      case "Hard": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-gentle bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-gentle">
              <Apple className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                PCOD-Friendly Meal Plans
              </h2>
              <p className="text-muted-foreground">
                Nutritious recipes designed to support your hormonal health
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Tips */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-success" />
            Today's Nutrition Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-soft">
              <Heart className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-success">Anti-inflammatory</p>
                <p className="text-xs text-muted-foreground">Reduce inflammation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-soft">
              <Leaf className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-primary">Low Glycemic</p>
                <p className="text-xs text-muted-foreground">Stable blood sugar</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-soft">
              <Apple className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium text-warning">High Fiber</p>
                <p className="text-xs text-muted-foreground">Support digestion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 rounded-gentle bg-muted p-1">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id}
              value={category.id} 
              className="flex items-center gap-2 rounded-soft data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="rounded-gentle hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Recipe Image */}
                    <div className="aspect-video bg-muted rounded-t-gentle flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-muted-foreground" />
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {/* Recipe Header */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">{recipe.title}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-warning fill-current" />
                          <span className="text-sm text-muted-foreground">{recipe.rating}</span>
                        </div>
                      </div>

                      {/* Recipe Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {recipe.cookTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {recipe.servings} servings
                        </div>
                        <Badge className={`text-xs rounded-soft ${getDifficultyColor(recipe.difficulty)}`}>
                          {recipe.difficulty}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {recipe.description}
                      </p>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {recipe.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs rounded-soft">
                            {benefit}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 rounded-soft">
                          <BookOpen className="h-3 w-3 mr-1" />
                          View Recipe
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-soft">
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Meal Planning Tips */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle>PCOD Nutrition Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Foods to Include</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Lean proteins (fish, legumes, quinoa)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Anti-inflammatory spices (turmeric, cinnamon)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  High-fiber vegetables and fruits
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Healthy fats (avocado, nuts, olive oil)
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Foods to Limit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Refined sugars and processed foods
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  High glycemic index carbohydrates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Trans fats and excessive dairy
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Excessive caffeine and alcohol
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};