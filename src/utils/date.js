export function fmtDate(ms) {
  try { return new Date(ms).toLocaleDateString(); } catch { return '' }
}
