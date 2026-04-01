import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

const SECRET = process.env.REDIS_ENCRYPTION_SECRET;
if (!SECRET) {
  throw new Error(
    "CRITICAL SECURITY ERROR: 'REDIS_ENCRYPTION_SECRET' is not defined. Secure token storage is required.",
  );
}

/**
 * Derived 32-byte key from the secret.
 * Cached at module load to avoid expensive scryptSync calls on every invocation.
 */
const ENCRYPTION_KEY = scryptSync(SECRET, "dm-broo-salt", 32);

/**
 * Returns the cached module-level derived key (ENCRYPTION_KEY).
 * Derived once at module initialization from the environment secret and salt.
 * IMPORTANT: This must match whatever the worker app uses.
 */
function getEncryptionKey(): Buffer {
  return ENCRYPTION_KEY;
}

/**
 * Encrypts a plain text string.
 * Output format: [iv_hex][tag_hex][encrypted_text_hex]
 */
export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

/**
 * Decrypts an encrypted string produced by 'encrypt'.
 */
export function decrypt(encryptedData: string): string {
  const [ivHex, tagHex, encryptedText] = encryptedData.split(":");
  if (!ivHex || !tagHex || !encryptedText) {
    throw new Error("Invalid encrypted data format");
  }

  const HEX_REGEX = /^[0-9a-f]+$/i;

  if (!HEX_REGEX.test(ivHex) || ivHex.length !== IV_LENGTH * 2) {
    throw new Error(`Invalid IV length: expected ${IV_LENGTH * 2} hex chars`);
  }
  if (!HEX_REGEX.test(tagHex) || tagHex.length !== TAG_LENGTH * 2) {
    throw new Error(
      `Invalid auth tag length: expected ${TAG_LENGTH * 2} hex chars`,
    );
  }
  if (!HEX_REGEX.test(encryptedText) || encryptedText.length % 2 !== 0) {
    throw new Error(
      "Invalid encrypted text: must be a valid hex string of even length",
    );
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
