import fs from 'fs';
import path from 'path';
import type { Product } from '@/types/database';

const SNAPSHOT_PATH = path.join(process.cwd(), 'data', 'static-products.json');

function ensureDir() {
  const dir = path.dirname(SNAPSHOT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readStaticProducts(): Product[] {
  try {
    if (!fs.existsSync(SNAPSHOT_PATH)) return [];
    const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function writeStaticProducts(products: Product[]): void {
  try {
    ensureDir();
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write static products snapshot:', e);
  }
}
