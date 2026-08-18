/**
 * Zero-Knowledge Client-Side Encryption Utility (ProtectedText Architecture)
 * Uses native Web Crypto API (window.crypto.subtle) - AES-GCM 256-bit + PBKDF2
 */

// Helper to convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to convert Base64 to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive a 256-bit AES-GCM key from user passphrase and salt using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt plaintext using a passphrase.
 * Returns a serialized format: `ZK:v1:<salt-base64>:<iv-base64>:<ciphertext-base64>`
 */
export async function encryptZeroKnowledge(
  plaintext: string,
  passphrase?: string
): Promise<string> {
  if (!passphrase || !passphrase.trim()) {
    // If no passphrase is set, return as standard plaintext payload
    return plaintext;
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    enc.encode(plaintext)
  );

  const saltB64 = bufferToBase64(salt.buffer);
  const ivB64 = bufferToBase64(iv.buffer);
  const cipherB64 = bufferToBase64(ciphertextBuffer);

  return `ZK:v1:${saltB64}:${ivB64}:${cipherB64}`;
}

/**
 * Check if a string is encrypted with zero-knowledge format
 */
export function isZeroKnowledgeCiphertext(content: string): boolean {
  return typeof content === "string" && content.startsWith("ZK:v1:");
}

/**
 * Decrypt zero-knowledge ciphertext using the user's passphrase.
 */
export async function decryptZeroKnowledge(
  content: string,
  passphrase?: string
): Promise<{ success: boolean; text: string; error?: string }> {
  if (!isZeroKnowledgeCiphertext(content)) {
    return { success: true, text: content };
  }

  if (!passphrase) {
    return {
      success: false,
      text: content,
      error: "Passphrase required to unlock this encrypted note.",
    };
  }

  try {
    const parts = content.split(":");
    if (parts.length !== 5) {
      return { success: false, text: content, error: "Invalid ciphertext format." };
    }

    const salt = base64ToBuffer(parts[2]);
    const iv = base64ToBuffer(parts[3]);
    const ciphertext = base64ToBuffer(parts[4]);

    const key = await deriveKey(passphrase, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return { success: true, text: dec.decode(decryptedBuffer) };
  } catch (err) {
    return {
      success: false,
      text: content,
      error: "Incorrect passphrase. Unable to decrypt note.",
    };
  }
}
