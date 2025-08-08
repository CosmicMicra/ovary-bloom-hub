import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Clock,
  User,
  Stethoscope,
  Plus,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

interface ForumPost {
  id: string;
  author: string;
  authorType: "user" | "doctor";
  title: string;
  content: string;
  timeAgo: string;
  replies: number;
  likes: number;
  category: string;
  isLiked: boolean;
  hasReplied: boolean;
}

export const DoctorForum = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "1",
      author: "Dr. Sarah Johnson",
      authorType: "doctor",
      title: "Understanding PCOD Symptoms: A Comprehensive Guide",
      content: "PCOD affects women differently. Common symptoms include irregular periods, weight gain, acne, and mood changes. The key is personalized management combining diet, exercise, and medical support...",
      timeAgo: "2 hours ago",
      replies: 12,
      likes: 24,
      category: "education",
      isLiked: false,
      hasReplied: false
    },
    {
      id: "2",
      author: "Emma K.",
      authorType: "user",
      title: "How has exercise helped your PCOD symptoms?",
      content: "I've been doing yoga and light cardio for 3 months now. My periods have become more regular and I'm feeling more energetic. What exercises have worked best for you?",
      timeAgo: "5 hours ago",
      replies: 8,
      likes: 15,
      category: "lifestyle",
      isLiked: true,
      hasReplied: false
    },
    {
      id: "3",
      author: "Dr. Michael Chen",
      authorType: "doctor",
      title: "Nutrition Myths About PCOD - Debunked",
      content: "There's a lot of misinformation about PCOD nutrition. Let me clarify some common myths: 1) You don't need to eliminate all carbs 2) Dairy isn't automatically bad for everyone...",
      timeAgo: "1 day ago",
      replies: 18,
      likes: 32,
      category: "nutrition",
      isLiked: false,
      hasReplied: true
    },
    {
      id: "4",
      author: "Maya P.",
      authorType: "user",
      title: "Dealing with PCOD-related anxiety and mood swings",
      content: "The emotional aspect of PCOD is often overlooked. I've been experiencing mood swings and anxiety. How do you cope with the mental health challenges?",
      timeAgo: "2 days ago",
      replies: 14,
      likes: 21,
      category: "mental-health",
      isLiked: false,
      hasReplied: false
    }
  ]);

  const categories = [
    { id: "all", label: "All Posts", count: posts.length },
    { id: "education", label: "Education", count: posts.filter(p => p.category === "education").length },
    { id: "lifestyle", label: "Lifestyle", count: posts.filter(p => p.category === "lifestyle").length },
    { id: "nutrition", label: "Nutrition", count: posts.filter(p => p.category === "nutrition").length },
    { id: "mental-health", label: "Mental Health", count: posts.filter(p => p.category === "mental-health").length }
  ];

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education": return "bg-primary/20 text-primary";
      case "lifestyle": return "bg-success/20 text-success";
      case "nutrition": return "bg-warning/20 text-warning";
      case "mental-health": return "bg-secondary/20 text-secondary";
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
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                PCOD Support Community
              </h2>
              <p className="text-muted-foreground">
                Connect with others, ask questions, and get expert guidance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-gentle">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">1,247</div>
            <div className="text-sm text-muted-foreground">Community Members</div>
          </CardContent>
        </Card>
        <Card className="rounded-gentle">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">156</div>
            <div className="text-sm text-muted-foreground">Expert Doctors</div>
          </CardContent>
        </Card>
        <Card className="rounded-gentle">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">2,891</div>
            <div className="text-sm text-muted-foreground">Questions Answered</div>
          </CardContent>
        </Card>
      </div>

      {/* New Post Section */}
      <Card className="rounded-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Ask a Question or Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your PCOD journey, ask questions, or offer support to others..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              className="rounded-soft resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline" className="rounded-soft cursor-pointer hover:bg-primary/10">
                  🏥 Medical Question
                </Badge>
                <Badge variant="outline" className="rounded-soft cursor-pointer hover:bg-success/10">
                  💪 Lifestyle Tip
                </Badge>
                <Badge variant="outline" className="rounded-soft cursor-pointer hover:bg-warning/10">
                  🍎 Nutrition
                </Badge>
              </div>
              <Button className="rounded-soft">
                <MessageSquare className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className="rounded-soft whitespace-nowrap"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
            <Badge variant="secondary" className="ml-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="rounded-gentle hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Post Header */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={post.authorType === "doctor" ? "bg-primary/20 text-primary" : "bg-muted"}>
                      {post.authorType === "doctor" ? (
                        <Stethoscope className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{post.author}</span>
                      {post.authorType === "doctor" && (
                        <Badge variant="default" className="text-xs rounded-soft bg-primary/20 text-primary">
                          Verified Doctor
                        </Badge>
                      )}
                      <Badge className={`text-xs rounded-soft ${getCategoryColor(post.category)}`}>
                        {post.category.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.timeAgo}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{post.content}</p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-soft"
                      onClick={() => toggleLike(post.id)}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current text-primary" : ""}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-soft">
                      <Reply className="h-4 w-4 mr-1" />
                      {post.replies}
                    </Button>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-soft">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Guidelines */}
      <Card className="rounded-gentle bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">✅ Do:</h4>
              <ul className="space-y-1">
                <li>• Be respectful and supportive</li>
                <li>• Share your personal experiences</li>
                <li>• Ask genuine questions</li>
                <li>• Follow medical advice from professionals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">❌ Don't:</h4>
              <ul className="space-y-1">
                <li>• Give medical diagnoses</li>
                <li>• Share personal medical details</li>
                <li>• Promote unverified treatments</li>
                <li>• Be judgmental or dismissive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};