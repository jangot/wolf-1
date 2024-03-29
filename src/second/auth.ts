import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './constants';

const TOKEN_KEY = 'authToken';
interface CodeResponse {
    id: string;
}

interface ConfirmResponse {
    token: string;
}

export interface AuthInterface {
    getToken: () => string,
    hasToken: () => Promise<void>,
    setToken: (token: string) => void,
    sendPhone: (phone: string, name: string) => Promise<string>,
    sendName: (login: string) => Promise<string>,
    confirm: (id: string, code: string) => Promise<string>
}

export class AuthService implements AuthInterface {
    protected client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
        });
    }

    getToken(): string {
        return localStorage.getItem(TOKEN_KEY);
    }

    async hasToken(): Promise<void> {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            throw new Error('There is not token');
        }
    }

    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    async sendPhone(phone: string, name: string): Promise<string> {
        const { data } = await this.client.post<CodeResponse>('/code', { phone, name });

        return data.id;
    }

    async sendName(login: string): Promise<string> {
        const { data } = await this.client.post<CodeResponse>('/dobar_dan', { login });

        localStorage.setItem(TOKEN_KEY, data.id);

        return data.id;
    }

    async confirm(id: string, code: string): Promise<string> {
        const { data } = await this.client.post<ConfirmResponse>('/login', { id, code });

        localStorage.setItem(TOKEN_KEY, data.token);
        return data.token;
    }
}
