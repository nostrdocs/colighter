export const sha256Hash = async (message: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashArray = Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', encoder.encode(message))
    )
  );
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
