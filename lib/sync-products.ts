export async function triggerProductSync(): Promise<void> {
  try {
    await fetch('/api/sync-products', { method: 'POST' });
  } catch {
    // best-effort sync
  }
}
