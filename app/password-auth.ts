const COOKIE_NAME = "ksa_access";

const toBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const accessCookieName = COOKIE_NAME;

export async function accessToken(password = process.env.SITE_PASSWORD) {
  if (!password) return null;
  const input = new TextEncoder().encode(`ksa-zustaendigkeitsfinder:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return toBase64Url(new Uint8Array(digest));
}

export function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
