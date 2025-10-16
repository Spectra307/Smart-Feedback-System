import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Star, MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FacultyDashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: feedback } = useQuery({
    queryKey: ['facultyFeedback', profile?.faculty_name],
    queryFn: async () => {
      if (!profile?.faculty_name) return [];
      const { data } = await supabase
        .from('feedback')
        .select('*')
        .eq('faculty_name', profile.faculty_name)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!profile?.faculty_name,
  });

  const { data: latestReport } = useQuery({
    queryKey: ['facultyReport', profile?.faculty_name],
    queryFn: async () => {
      if (!profile?.faculty_name) return null;
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('faculty_name', profile.faculty_name)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!profile?.faculty_name,
  });

  if (!profile?.faculty_name) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your account is not linked to a faculty profile yet. Please contact the administrator.</p>
      </div>
    );
  }

  const avgTeaching = feedback && feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.teaching_quality, 0) / feedback.length).toFixed(2)
    : "0.00";
  
  const avgCommunication = feedback && feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.communication_skill, 0) / feedback.length).toFixed(2)
    : "0.00";

  const sentimentCounts = feedback?.reduce((acc, f) => {
    acc[f.sentiment || 'Neutral'] = (acc[f.sentiment || 'Neutral'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <TrendingUp className="h-4 w-4 text-chart-1" />;
      case 'Negative': return <TrendingDown className="h-4 w-4 text-chart-3" />;
      default: return <Minus className="h-4 w-4 text-chart-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'text-chart-1';
      case 'Negative': return 'text-chart-3';
      default: return 'text-chart-4';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Faculty Portal</h2>
        <p className="text-muted-foreground mt-2">Welcome, {profile.name} - View your feedback and performance analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-chart-1/20 bg-gradient-to-br from-background to-chart-1/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{feedback?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Student responses</p>
          </CardContent>
        </Card>

        <Card className="border-chart-2/20 bg-gradient-to-br from-background to-chart-2/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Teaching Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTeaching}/5</div>
            <Progress value={parseFloat(avgTeaching) * 20} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-chart-5/20 bg-gradient-to-br from-background to-chart-5/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCommunication}/5</div>
            <Progress value={parseFloat(avgCommunication) * 20} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {latestReport && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Performance Summary</CardTitle>
            <CardDescription>
              Generated on {new Date(latestReport.generated_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{latestReport.sentiment_summary}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>How students feel about your teaching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Positive', 'Neutral', 'Negative'].map((sentiment) => (
              <div key={sentiment} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(sentiment)}
                  <span className="font-medium">{sentiment}</span>
                </div>
                <span className={`text-2xl font-bold ${getSentimentColor(sentiment)}`}>
                  {sentimentCounts[sentiment] || 0}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest student comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback && feedback.length > 0 ? (
              feedback.slice(0, 10).map((fb) => (
                <div key={fb.id} className="border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{fb.course_name}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className={`text-xs font-medium ${getSentimentColor(fb.sentiment || 'Neutral')}`}>
                      {fb.sentiment || 'Neutral'}
                    </div>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-chart-2 text-chart-2" />
                      <span>Teaching: {fb.teaching_quality}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MessageSquare className="h-3 w-3 text-chart-5" />
                      <span>Communication: {fb.communication_skill}/5</span>
                    </div>
                  </div>
                  {fb.comment && (
                    <p className="text-sm text-muted-foreground italic">"{fb.comment}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No feedback received yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;