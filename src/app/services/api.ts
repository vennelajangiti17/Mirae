const API_BASE = 'http://localhost:5000/api';

type RequestOptions = {
  headers?: Record<string, string>;
};

type ApiResponse<T> = {
  data: T;
};

type ApiError = Error & {
  response?: {
    status: number;
    data: any;
  };
};

const getAuthHeaders = (headers: Record<string, string> = {}) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(
      data?.error || data?.message || `Request failed with status ${response.status}`
    ) as ApiError;

    error.response = {
      status: response.status,
      data
    };

    throw error;
  }

  return { data: data as T };
};

const request = async <T>(
  method: string,
  path: string,
  body?: BodyInit | Record<string, unknown>,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const optionHeaders = { ...(options.headers || {}) };

  if (isFormData) {
    delete optionHeaders['Content-Type'];
  }

  const headers = getAuthHeaders({
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...optionHeaders
  });

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
        ? body
        : JSON.stringify(body)
  });

  return parseResponse<T>(response);
};

const api = {
  get<T>(path: string, options?: RequestOptions) {
    return request<T>('GET', path, undefined, options);
  },
  post<T>(path: string, body?: BodyInit | Record<string, unknown>, options?: RequestOptions) {
    return request<T>('POST', path, body, options);
  },
  put<T>(path: string, body?: BodyInit | Record<string, unknown>, options?: RequestOptions) {
    return request<T>('PUT', path, body, options);
  },
  delete<T>(path: string, options?: RequestOptions) {
    return request<T>('DELETE', path, undefined, options);
  }
};

export default api;
