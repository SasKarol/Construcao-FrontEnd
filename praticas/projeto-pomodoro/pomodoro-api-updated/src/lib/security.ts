import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const keyLength = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, keyLength).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, 'hex');
  const passwordHash = scryptSync(password, salt, keyLength);

  return (
    hashBuffer.length === passwordHash.length &&
    timingSafeEqual(hashBuffer, passwordHash)
  );
}

export function createToken() {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
