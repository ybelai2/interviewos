import { verifySupabaseAccessToken, getSupabaseServerClient } from '../../_utils/supabaseServer';

export default async function (req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await verifySupabaseAccessToken(req.headers.authorization);
    const resumeId = req.query.id || req.query["id"];
    if (!resumeId) return res.status(400).json({ error: 'Missing resume id' });

    const supabase = getSupabaseServerClient();
    // Use direct SQL to fetch analysis ensuring ownership (service role key)
    const { data, error } = await supabase.rpc('get_resume_analysis_by_user', { p_resume_id: resumeId, p_user_id: user.id });
    if (error) {
      // Fallback: query resume_analyses join resumes
      const q = await supabase.from('resume_analyses').select('analysis').eq('resume_id', resumeId).order('created_at', { ascending: false }).limit(1);
      if (q.error) {
        console.error('DB fetch error', q.error);
        return res.status(500).json({ error: 'Failed to fetch analysis' });
      }
      const analysis = q.data?.[0]?.analysis ?? null;
      // Verify resume ownership
      const r = await supabase.from('resumes').select('user_id').eq('id', resumeId).single();
      if (r.error || !r.data) return res.status(404).json({ error: 'Not found' });
      if (r.data.user_id !== user.id) return res.status(403).json({ error: 'Unauthorized' });
      return res.json({ analysis });
    }
    // If RPC returned data, ensure ownership
    res.json({ analysis: data?.analysis ?? null });
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ error: err.message || 'Unauthorized' });
  }
}
