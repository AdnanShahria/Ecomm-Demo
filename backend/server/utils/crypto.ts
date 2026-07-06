export async function hashPassword(password: string, salt: string = globalThis.crypto.randomUUID()): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const newHash = await hashPassword(password, salt);
  return newHash === storedHash;
}

export function generateOTP(): string {
  // Generate a 6-digit random number
  return Math.floor(100000 + Math.random() * 900000).toString();
}
