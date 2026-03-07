const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface ApiOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  /** Se `true`, injeta o Bearer token do localStorage automaticamente. */
  auth?: boolean;
  headers?: Record<string, string>;
}

interface ApiError {
  message: string;
  statusCode: number;
}

export class ApiRequestError extends Error {
  statusCode: number;

  constructor({ message, statusCode }: ApiError) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

/**
 * Wrapper genérico de fetch para toda a aplicação.
 *
 * @example
 * // Sem autenticação
 * const data = await api<{ access_token: string }>("/auth/login", {
 *   method: "POST",
 *   body: { email, password },
 * });
 *
 * @example
 * // Com autenticação (Bearer token)
 * const pokemons = await api<Pokemon[]>("/pokemon", { auth: true });
 */
export async function api<TResponse = unknown, TBody = unknown>(
  path: string,
  options: ApiOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, auth = false, headers = {} } = options;

  const resolvedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      resolvedHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: resolvedHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Erro ${response.status}: ${response.statusText}`;

    try {
      const errBody = await response.json();
      if (typeof errBody?.message === "string") message = errBody.message;
      else if (Array.isArray(errBody?.message))
        message = errBody.message.join(", ");
    } catch {
      // mantém a mensagem padrão
    }

    throw new ApiRequestError({ message, statusCode: response.status });
  }

  // 204 No Content — retorna undefined sem tentar parsear JSON
  if (response.status === 204) return undefined as TResponse;

  return response.json() as Promise<TResponse>;
}
