
type DataType = {
    [key: string]: any
}

const data: DataType = {
    '/start': {
        token: '123',
    }
}

export const  httpClient = {
    async post<R>(url: string): Promise<R> {
        return data[url] as R;
    }
}
