import { AuthInterface } from './auth';

export class FakeAuth implements AuthInterface {
    getToken () {
        return  'fake-token';
    }
    hasToken() {
        return Promise.resolve();
    }
    setToken() {
        return '';
    }
    sendPhone (phone: string, name: string) {
        return Promise.resolve('');
    }
    sendName() {
        return Promise.resolve('');
    }
    confirm(id: string, code: string) {
        return Promise.resolve('');
    }
}
