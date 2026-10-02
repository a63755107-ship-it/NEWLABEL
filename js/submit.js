// Submit-a-brand backend hook. Set SUBMIT_ENDPOINT (e.g. a Supabase Edge Function / API route) to enable real submissions.
// The form is sent as FormData so logo/images can be uploaded. Until then NOTHING is stored.
export const SUBMIT_ENDPOINT = null;
export async function submitBrand(formData) {
  if (!SUBMIT_ENDPOINT) return { ok: false, reason: 'no-backend' };
  try { const r = await fetch(SUBMIT_ENDPOINT, { method: 'POST', body: formData }); return { ok: r.ok }; }
  catch (e) { return { ok: false, reason: 'network' }; }
}
