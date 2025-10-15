import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, MessageSquare, Shield } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Hero Section */}
      <header className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
            <GraduationCap className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Faculty Feedback System</h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            AI-Powered feedback collection and analysis for continuous improvement in education
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Feedback Collection</h3>
            <p className="text-muted-foreground">
              Structured forms with ratings and comments to capture comprehensive student feedback
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-7 w-7 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Sentiment Analysis</h3>
            <p className="text-muted-foreground">
              Powered by GPT-5 to automatically analyze feedback sentiment and provide insights
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-success rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-success-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">
              Role-based access control ensures students and admins have appropriate permissions
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-primary rounded-2xl p-12 text-center text-primary-foreground shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Teaching Quality?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join our platform and start collecting valuable feedback today
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
            className="shadow-lg"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm">
            © 2025 Faculty Feedback System. Powered by Lovable Cloud & AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;