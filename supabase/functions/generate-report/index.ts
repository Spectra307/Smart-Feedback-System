import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { facultyName } = await req.json();
    console.log('Generating report for faculty:', facultyName);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all feedback for this faculty
    const { data: feedbackData, error: feedbackError } = await supabaseClient
      .from('feedback')
      .select('*')
      .eq('faculty_name', facultyName);

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
      throw feedbackError;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No feedback found for this faculty' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate averages
    const avgTeachingQuality = feedbackData.reduce((sum, f) => sum + f.teaching_quality, 0) / feedbackData.length;
    const avgCommunicationSkill = feedbackData.reduce((sum, f) => sum + f.communication_skill, 0) / feedbackData.length;

    // Count sentiments
    const positiveCount = feedbackData.filter(f => f.sentiment === 'Positive').length;
    const negativeCount = feedbackData.filter(f => f.sentiment === 'Negative').length;
    const neutralCount = feedbackData.filter(f => f.sentiment === 'Neutral').length;

    // Generate sentiment summary
    const totalFeedback = feedbackData.length;
    const positivePercent = ((positiveCount / totalFeedback) * 100).toFixed(1);
    const negativePercent = ((negativeCount / totalFeedback) * 100).toFixed(1);
    const neutralPercent = ((neutralCount / totalFeedback) * 100).toFixed(1);

    const sentimentSummary = `Based on ${totalFeedback} feedback submissions: ${positivePercent}% Positive, ${negativePercent}% Negative, ${neutralPercent}% Neutral. Overall teaching quality: ${avgTeachingQuality.toFixed(2)}/5, Communication skill: ${avgCommunicationSkill.toFixed(2)}/5.`;

    // Insert report
    const { data: reportData, error: reportError } = await supabaseClient
      .from('reports')
      .insert({
        faculty_name: facultyName,
        avg_teaching_quality: avgTeachingQuality,
        avg_communication_skill: avgCommunicationSkill,
        sentiment_summary: sentimentSummary,
        total_feedback_count: totalFeedback,
        positive_count: positiveCount,
        negative_count: negativeCount,
        neutral_count: neutralCount,
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating report:', reportError);
      throw reportError;
    }

    console.log('Report generated successfully:', reportData);

    return new Response(
      JSON.stringify({ report: reportData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-report function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});