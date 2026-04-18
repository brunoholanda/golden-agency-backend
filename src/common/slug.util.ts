import { randomBytes } from 'crypto';

export function slugifyTitle(title: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
  const suffix = randomBytes(3).toString('hex');
  return (base || 'post') + '-' + suffix;
}
