import { lookup } from "node:dns/promises";
import net from "node:net";

const PRIVATE_HOST_OVERRIDE = "GHOSTSHIP_ALLOW_PRIVATE_HOSTS";
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "0.0.0.0",
  "127.0.0.1",
  "::1",
]);
const BLOCKED_SUFFIXES = [
  ".localhost",
  ".local",
  ".localdomain",
  ".internal",
  ".home.arpa",
];

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

export async function assertSafeScreenshotUrl(input: string): Promise<URL> {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new UnsafeUrlError("Invalid URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new UnsafeUrlError("Only HTTP and HTTPS URLs are allowed");
  }

  if (url.username || url.password) {
    throw new UnsafeUrlError("Embedded credentials are not allowed in URLs");
  }

  if (process.env[PRIVATE_HOST_OVERRIDE] === "true") {
    return url;
  }

  if (isBlockedHostname(url.hostname)) {
    throw new UnsafeUrlError("Local and private hosts are not allowed");
  }

  const addresses = await resolveHostname(url.hostname);
  if (addresses.length === 0) {
    throw new UnsafeUrlError("Could not resolve host");
  }

  for (const address of addresses) {
    if (isPrivateAddress(address)) {
      throw new UnsafeUrlError("Local and private hosts are not allowed");
    }
  }

  return url;
}

async function resolveHostname(hostname: string): Promise<string[]> {
  const normalized = hostname.trim().toLowerCase();
  const ipFamily = net.isIP(normalized);

  if (ipFamily > 0) {
    return [normalized];
  }

  try {
    const records = await lookup(normalized, { all: true, verbatim: true });
    return records.map((record) => record.address);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
      throw new UnsafeUrlError("Could not resolve host");
    }

    throw error;
  }
}

function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  return (
    BLOCKED_HOSTNAMES.has(normalized) ||
    BLOCKED_SUFFIXES.some((suffix) => normalized.endsWith(suffix))
  );
}

function isPrivateAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    return isPrivateIpv4(address);
  }

  if (net.isIPv6(address)) {
    return isPrivateIpv6(address);
  }

  return true;
}

function isPrivateIpv4(address: string): boolean {
  const [a = 0, b = 0] = address.split(".").map((part) => Number(part));

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string): boolean {
  const normalized = address.toLowerCase();

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb") ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.") ||
    normalized.startsWith("::ffff:172.16.") ||
    normalized.startsWith("::ffff:172.17.") ||
    normalized.startsWith("::ffff:172.18.") ||
    normalized.startsWith("::ffff:172.19.") ||
    normalized.startsWith("::ffff:172.2") ||
    normalized.startsWith("::ffff:172.30.") ||
    normalized.startsWith("::ffff:172.31.") ||
    normalized.startsWith("::ffff:169.254.")
  );
}
