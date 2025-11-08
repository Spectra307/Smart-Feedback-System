import { useQuery } from "@tanstack/react-query";
import { apiService, FeedbackResponse, Report } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Star, MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FacultyDashboard = () => {
  const { user } = useAuth();
  
  // Get faculty name from user metadata or email
  const facultyName = user?.user_metadata?.faculty_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';

  const { data: feedback } = useQuery({
    queryKey: ['facultyFeedback', facultyName],
    queryFn: async () => {
      if (!facultyName) return [];
      return await apiService.getFeedbackByFaculty(facultyName);
    },
    enabled: !!facultyName,
  });

  const { data: reports } = useQuery({
    queryKey: ['facultyReport', facultyName],
    queryFn: async () => {
      if (!facultyName) return [];
      return await apiService.getReportsByFaculty(facultyName);
    },
    enabled: !!facultyName,
  });

  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  if (!facultyName) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please set your faculty name in your profile to view feedback.</p>
      </div>
    );
  }

  const avgTeaching = feedback && feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.teachingQuality, 0) / feedback.length).toFixed(2)
    : "0.00";
  
  const avgCommunication = feedback && feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.communicationSkill, 0) / feedback.length).toFixed(2)
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
        <p className="text-muted-foreground mt-2">Welcome, {facultyName} - View your feedback and performance analytics</p>
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
              Generated on {new Date(latestReport.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{latestReport.sentimentSummary}</p>
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
              feedback.slice(0, 10).map((fb: FeedbackResponse) => (
                <div key={fb.id} className="border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Student: {fb.studentName}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className={`text-xs font-medium ${getSentimentColor(fb.sentiment || 'Neutral')}`}>
                      {fb.sentiment || 'Neutral'}
                    </div>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-chart-2 text-chart-2" />
                      <span>Teaching: {fb.teachingQuality}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MessageSquare className="h-3 w-3 text-chart-5" />
                      <span>Communication: {fb.communicationSkill}/5</span>
                    </div>
                  </div>
                  {fb.comment && (
                    <p className="text-sm text-muted-foreground italic">"{fb.comment}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(fb.createdAt).toLocaleDateString()}
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