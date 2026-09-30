// Browser-side call to our API routes. Throws RequestError with the server's message and field errors.
export class RequestError extends Error {
  constructor(message: string, public fields: Record<string, string[] | undefined> = {}) {
    super(message);
  }
}

export async function send<T = unknown>(url: string, method: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(url, {
    method,
    headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new RequestError(json.error ?? "Request failed", json.fields);
  return json as T;
}
