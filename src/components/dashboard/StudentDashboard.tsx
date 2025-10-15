import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageSquare } from "lucide-react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const feedbackSchema = z.object({
  facultyName: z.string().trim().min(2, "Faculty name must be at least 2 characters"),
  courseName: z.string().trim().min(2, "Course name must be at least 2 characters"),
  teachingQuality: z.number().min(1).max(5),
  communicationSkill: z.number().min(1).max(5),
  comment: z.string().trim().max(1000, "Comment must be less than 1000 characters"),
});

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [facultyName, setFacultyName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [teachingQuality, setTeachingQuality] = useState(0);
  const [communicationSkill, setCommunicationSkill] = useState(0);
  const [comment, setComment] = useState("");

  const { data: myFeedback } = useQuery({
    queryKey: ['myFeedback', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: z.infer<typeof feedbackSchema>) => {
      // First, analyze sentiment
      const { data: sentimentData, error: sentimentError } = await supabase.functions.invoke('analyze-sentiment', {
        body: { comment: feedbackData.comment }
      });

      if (sentimentError) throw sentimentError;

      // Then insert feedback with sentiment
      const { error: insertError } = await supabase
        .from('feedback')
        .insert({
          faculty_name: feedbackData.facultyName,
          course_name: feedbackData.courseName,
          teaching_quality: feedbackData.teachingQuality,
          communication_skill: feedbackData.communicationSkill,
          comment: feedbackData.comment,
          sentiment: sentimentData.sentiment,
          user_id: user!.id,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your feedback has been submitted and analyzed.",
      });
      // Reset form
      setFacultyName("");
      setCourseName("");
      setTeachingQuality(0);
      setCommunicationSkill(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ['myFeedback'] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit feedback",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = feedbackSchema.parse({
        facultyName,
        courseName,
        teachingQuality,
        communicationSkill,
        comment,
      });

      submitFeedbackMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      }
    }
  };

  const RatingStars = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 ${
              rating <= value
                ? "fill-accent text-accent"
                : "fill-muted text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-2xl">Submit Faculty Feedback</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Your feedback helps improve teaching quality
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facultyName">Faculty Name</Label>
                <Input
                  id="facultyName"
                  placeholder="Dr. John Smith"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="Computer Science 101"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Teaching Quality</Label>
                <RatingStars value={teachingQuality} onChange={setTeachingQuality} />
              </div>

              <div className="space-y-2">
                <Label>Communication Skills</Label>
                <RatingStars value={communicationSkill} onChange={setCommunicationSkill} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea
                id="comment"
                placeholder="Share your feedback about the faculty's teaching methods, course delivery, and overall experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">{comment.length}/1000 characters</p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={submitFeedbackMutation.isPending || teachingQuality === 0 || communicationSkill === 0}
            >
              {submitFeedbackMutation.isPending ? "Analyzing & Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {myFeedback && myFeedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              My Previous Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myFeedback.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{feedback.faculty_name}</h4>
                      <p className="text-sm text-muted-foreground">{feedback.course_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      feedback.sentiment === 'Positive' ? 'bg-success/10 text-success' :
                      feedback.sentiment === 'Negative' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {feedback.sentiment}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>Teaching: {feedback.teaching_quality}/5</span>
                    <span>Communication: {feedback.communication_skill}/5</span>
                  </div>
                  {feedback.comment && (
                    <p className="text-sm text-muted-foreground mt-2">{feedback.comment}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;