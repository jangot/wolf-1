import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './constants';

const TOKEN_KEY = 'authToken';
interface CodeResponse {
    id: string;
}

interface ConfirmResponse {
    token: string;
}

export class AuthService {
    protected client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BASE_URL,
        });
    }

    getToken(): string {
        return localStorage.getItem(TOKEN_KEY);
    }

    hasToken(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    async sendPhone(phone: string, name: string): Promise<string> {
        const { data } = await this.client.post<CodeResponse>('/code', { phone, name });

        return data.id;
    }

    async confirm(id: string, code: string) {
        const { data } = await this.client.post<ConfirmResponse>('/login', { id, code });

        localStorage.setItem(TOKEN_KEY, data.token);

        return data.token;
    }
}
