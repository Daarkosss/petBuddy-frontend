import { toast } from 'react-toastify';
import store from '../store/RootStore';

const backendHost = import.meta.env.VITE_BACKEND_HOST || window.location.hostname;
const backendPort = import.meta.env.VITE_BACKEND_PORT || '8081';
export const PATH_PREFIX = `http://${backendHost}:${backendPort}/`;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface User {
  _id: string;
  name: string;
  email: string;
}

class API {

  async fetch<T>(
    method: Method,
    path: string,
    body?: unknown,
    headers: HeadersInit = {},
  ): Promise<T> {
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': store.user.xsrfToken,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include'
    } as RequestInit

    const response = await fetch(`${PATH_PREFIX}${path}`, options)
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || 'Wrong server response!');
      throw new Error(data.message || 'Wrong server response!');
    } else {
      return data;
    }
  }

  async authorizedFetch<T>(
    method: Method,
    path: string,
    body?: unknown
  ): Promise<T> {
    if (store.user.jwtToken) {
      return this.fetch<T>(
        method,
        path,
        body,
        { 'Authorization': `Bearer ${store.user.jwtToken}` },
      );
    } else {
      return Promise.reject(new Error('No user token available'));
    }
  }

  async getTestMessage(): Promise<string> {
    try {
      console.log('getting test message')
      const response = await this.authorizedFetch<string>(
        'GET',
        'api/test'
      )
      toast.success(JSON.stringify(response));
      return response
    } catch(error: unknown) {
      return "brak"
    }
  }

  async getXsrfToken(): Promise<void> {
    try {
      const response = await this.fetch<void>(
        'GET',
        'api/csrf'
      )
      return response
    } catch(error: unknown) {
      return;
    }
  }

  // async login(): Promise<User | null> {
  //   try {
  //     console.log('login');
  //     const response = await this.authorizedFetch<User>(
  //       'POST',
  //       'user/login',
  //       // { email: store.auth.user?.email }
  //     );
  //     return response;
  //   } catch (error: unknown) {
  //     console.log(error);
  //     return null;
  //   }
  // }
}

export const api = new API();
