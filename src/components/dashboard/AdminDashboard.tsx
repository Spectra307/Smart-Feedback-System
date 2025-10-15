import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, FileText, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const { data: allFeedback } = useQuery({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: reports } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: async (facultyName: string) => {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { facultyName }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Report Generated!",
        description: "The faculty report has been successfully generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setSelectedFaculty("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate report",
      });
    },
  });

  // Get unique faculty names
  const uniqueFaculties = [...new Set(allFeedback?.map(f => f.faculty_name) || [])];

  // Calculate overall statistics
  const totalFeedback = allFeedback?.length || 0;
  const avgTeachingQuality = allFeedback?.reduce((sum, f) => sum + f.teaching_quality, 0) / totalFeedback || 0;
  const avgCommunicationSkill = allFeedback?.reduce((sum, f) => sum + f.communication_skill, 0) / totalFeedback || 0;
  const positiveCount = allFeedback?.filter(f => f.sentiment === 'Positive').length || 0;
  const negativeCount = allFeedback?.filter(f => f.sentiment === 'Negative').length || 0;
  const neutralCount = allFeedback?.filter(f => f.sentiment === 'Neutral').length || 0;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalFeedback}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Teaching Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgTeachingQuality.toFixed(2)}/5</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCommunicationSkill.toFixed(2)}/5</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sentiment Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{positiveCount}</div>
              <div className="text-sm text-muted-foreground">Positive</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalFeedback > 0 ? ((positiveCount / totalFeedback) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="text-center p-4 bg-destructive/10 rounded-lg">
              <div className="text-2xl font-bold text-destructive">{negativeCount}</div>
              <div className="text-sm text-muted-foreground">Negative</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalFeedback > 0 ? ((negativeCount / totalFeedback) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <div className="text-2xl font-bold text-warning">{neutralCount}</div>
              <div className="text-sm text-muted-foreground">Neutral</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalFeedback > 0 ? ((neutralCount / totalFeedback) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Generate Faculty Report
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Select a faculty member to generate a comprehensive analytics report
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Faculty</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueFaculties.map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => generateReportMutation.mutate(selectedFaculty)}
              disabled={!selectedFaculty || generateReportMutation.isPending}
              className="w-full"
              size="lg"
            >
              {generateReportMutation.isPending ? "Generating Report..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reports && reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{report.faculty_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Generated on {new Date(report.generated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Teaching Quality</div>
                      <div className="text-2xl font-bold">{report.avg_teaching_quality.toFixed(2)}/5</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Communication</div>
                      <div className="text-2xl font-bold">{report.avg_communication_skill.toFixed(2)}/5</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">Sentiment Analysis</div>
                    <div className="flex gap-4 mb-3">
                      <span className="text-sm">
                        <span className="text-success font-semibold">{report.positive_count}</span> Positive
                      </span>
                      <span className="text-sm">
                        <span className="text-destructive font-semibold">{report.negative_count}</span> Negative
                      </span>
                      <span className="text-sm">
                        <span className="text-warning font-semibold">{report.neutral_count}</span> Neutral
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.sentiment_summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;