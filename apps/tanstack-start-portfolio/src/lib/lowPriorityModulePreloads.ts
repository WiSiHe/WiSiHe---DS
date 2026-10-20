/**
 * TanStack Start emits ~40 `<link rel="modulepreload">` tags (High priority by default). They compete for
 * bandwidth with the stylesheet and the LCP image, and Lighthouse's mobile simulation counts every one of them
 * as blocking first paint (simulated FCP 5.3 s -> 2.4 s with `fetchpriority="low"` on a throttled profile).
 * The chunks still load in parallel at low priority, the entry script itself is untouched.
 */
const encoder = new TextEncoder();
const NEEDLE = encoder.encode('<link rel="modulepreload" ');
const REPLACEMENT = encoder.encode('<link rel="modulepreload" fetchpriority="low" ');
const HEAD_END = encoder.encode('</head>');
function indexOfBytes(haystack: Uint8Array, needle: Uint8Array, from = 0): number {
  outer: for (let i = from; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function startsWithAt(haystack: Uint8Array, offset: number, needle: Uint8Array): boolean {
  if (offset + needle.length > haystack.length) return false;
  for (let j = 0; j < needle.length; j++) if (haystack[offset + j] !== needle[j]) return false;
  return true;
}

/**
 * Index where a *partial* NEEDLE / HEAD_END begins at the very end of `bytes` (so it can be completed by the next
 * chunk), or `bytes.length` when nothing is cut off.
 */
function partialMatchStart(bytes: Uint8Array): number {
  const longest = Math.max(NEEDLE.length, HEAD_END.length) - 1;
  for (let start = Math.max(0, bytes.length - longest); start < bytes.length; start++) {
    const rest = bytes.length - start;
    for (const target of [NEEDLE, HEAD_END]) {
      if (rest < target.length && startsWithAt(target, 0, bytes.subarray(start))) return start;
    }
  }
  return bytes.length;
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

/** Replaces every NEEDLE in `bytes` with REPLACEMENT. */
function rewriteModulePreloads(bytes: Uint8Array): Uint8Array {
  const parts: Uint8Array[] = [];
  let cursor = 0;
  for (
    let hit = indexOfBytes(bytes, NEEDLE);
    hit !== -1;
    hit = indexOfBytes(bytes, NEEDLE, cursor)
  ) {
    parts.push(bytes.subarray(cursor, hit), REPLACEMENT);
    cursor = hit + NEEDLE.length;
  }
  if (cursor === 0) return bytes;
  parts.push(bytes.subarray(cursor));
  return parts.reduce(concat);
}

export function lowPriorityModulePreloads(response: Response): Response {
  const contentType = response.headers.get('content-type') ?? '';
  if (
    !response.body ||
    !contentType.includes('text/html') ||
    response.headers.has('content-encoding')
  ) {
    return response;
  }

  let carry: Uint8Array = new Uint8Array(0);
  let headDone = false;

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      if (headDone) {
        controller.enqueue(chunk);
        return;
      }

      const buffer = concat(carry, chunk);
      const headEnd = indexOfBytes(buffer, HEAD_END);

      if (headEnd !== -1) {
        headDone = true;
        carry = new Uint8Array(0);
        controller.enqueue(rewriteModulePreloads(buffer.subarray(0, headEnd)));
        controller.enqueue(buffer.subarray(headEnd));
        return;
      }

      const safeLength = partialMatchStart(buffer);
      carry = buffer.slice(safeLength);
      if (safeLength > 0) controller.enqueue(rewriteModulePreloads(buffer.subarray(0, safeLength)));
    },
    flush(controller) {
      if (carry.length > 0) controller.enqueue(rewriteModulePreloads(carry));
    },
  });

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(response.body.pipeThrough(transform), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
