import MockAdapter from 'axios-mock-adapter';

export function mockRequests(mock: MockAdapter) {
    mock.onGet('https://my-server.com/start').reply(200, {
        token: '123123-123123',
        items: [
            1,
            2,
            3,
            0,
            5,
            76,
            65,
            54,
            23,
            3,
            6,
            0
        ],
    });
    mock.onPost('https://my-server.com/stat').reply(200, {
        items: [
            1,
            2,
            3,
            4,
            5,
            76,
            65,
            54,
            23,
            1,
            3,
            1
        ],
    });

    mock.onPost('https://my-server.com/finish').reply(200, {
        status: 'ok',
    });
}
