-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'admin');

-- Create user_roles table for role management (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  teaching_quality INT NOT NULL CHECK (teaching_quality >= 1 AND teaching_quality <= 5),
  communication_skill INT NOT NULL CHECK (communication_skill >= 1 AND communication_skill <= 5),
  comment TEXT,
  sentiment TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_name TEXT NOT NULL,
  avg_teaching_quality FLOAT NOT NULL,
  avg_communication_skill FLOAT NOT NULL,
  sentiment_summary TEXT,
  total_feedback_count INT NOT NULL DEFAULT 0,
  positive_count INT NOT NULL DEFAULT 0,
  negative_count INT NOT NULL DEFAULT 0,
  neutral_count INT NOT NULL DEFAULT 0,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_faculty_name ON public.feedback(faculty_name);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at);
CREATE INDEX idx_reports_faculty_name ON public.reports(faculty_name);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for feedback
CREATE POLICY "Users can insert their own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reports
CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert reports"
  ON public.reports FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();