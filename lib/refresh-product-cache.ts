export async function refreshProductCache(): Promise<void> {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();

    if (res.ok && data.products?.length > 0) {
      localStorage.setItem('cached_products', JSON.stringify(data.products));
      localStorage.setItem('cached_products_timestamp', Date.now().toString());
    }
  } catch {
    // silent fail - cache will be refreshed on next successful load
  }
}
