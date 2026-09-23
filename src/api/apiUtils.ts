import { API_CONFIG } from '../config/api';

const TOKEN_KEY = 'awo_admin_token';

/**
 * Returns common HTTP headers, automatically attaching Bearer token and ngrok bypass headers.
 */
export const getHeaders = (skipAuth = false): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Parses and verifies HTTP response, throwing clean formatted Error on non-2xx status or HTML error pages.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  let data: any;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    data = await response.text().catch(() => '');
  }

  // Handle HTML error pages (e.g. ngrok offline ERR_NGROK_3200, 502/504 gateways)
  if (typeof data === 'string' && (data.includes('<!DOCTYPE') || data.includes('<html') || data.includes('ngrok'))) {
    if (data.includes('ERR_NGROK_3200') || data.includes('is offline')) {
      throw new Error('Backend server is currently offline (ERR_NGROK_3200). Please start your backend server.');
    }
    throw new Error('Backend server returned an HTML error page instead of JSON. Please check backend server.');
  }

  if (!response.ok) {
    let extractedMessage: string | null = null;

    if (typeof data === 'object' && data !== null) {
      extractedMessage =
        data.message ||
        (typeof data.error === 'object' ? data.error?.message : null) ||
        (typeof data.error === 'string' ? data.error : null) ||
        (Array.isArray(data.errors) ? (data.errors[0]?.message || data.errors[0]) : null) ||
        data.msg;
    } else if (typeof data === 'string' && data && !data.includes('<')) {
      extractedMessage = data;
    }

    const finalMessage = extractedMessage || `Server error (${response.status})`;
    throw new Error(finalMessage);
  }

  return data as T;
}

export interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Reusable HTTP fetch helper for TanStack Query queryFn and mutationFn.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...restOptions } = options;
  const baseUrl = API_CONFIG.BASE_URL || '';
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    ...getHeaders(skipAuth),
    ...(customHeaders as Record<string, string>),
  };

  if (restOptions.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(url, { ...restOptions, headers });
    return await handleResponse<T>(response);
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to backend server.');
    }
    throw err;
  }
}
