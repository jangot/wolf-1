import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockRequests } from './util/mocks';
import { Game } from './game';
import { GAME_EVENT } from './type';

const mock = new MockAdapter(axios, { delayResponse: 2000 });
mockRequests(mock);

const SUM = 0;
const MINUS = 1;
const MULTI = 2;
const DEVIDE = 3;

const TICKS_COUNT_FOR_REQUEST = 10;
export class Server {
    protected game: Game;
    protected client: AxiosInstance;
    protected token: string;
    protected tickCount: number;
    protected items: number[];

    constructor(game: Game) {
        this.game = game;
        this.client = axios.create({
            baseURL: 'https://my-server.com',
        });
        this.tickCount = 0;
        this.subscribe();
    }
    async start() {
        const { data } = await this.client.get('/start');

        this.token = data.token;
        this.items = data.items;
    }

    protected async tick() {
        this.tickCount++
        if (this.tickCount === TICKS_COUNT_FOR_REQUEST) {
            this.tickCount = 0;
            console.log(this.getData())

            const { data } = await this.client.post('/stat', this.getData());
            this.items = data.items;
        }
    }

    protected async finish() {
        const { data } = await this.client.post('/finish', this.getData());
        console.log(this.getData())

        console.log(data)
    }

    protected subscribe() {
        const unsubscribeTick = this.game.on(GAME_EVENT.TICK, () => {
            this.tick();
        });
        const unsubscribeStop = this.game.on(GAME_EVENT.STOP, () => {
            this.finish()
            unsubscribeTick();
            unsubscribeStop()
        });
    }

    protected getData() {
        const { tickTime, score, errors } = this.game;
        const { token } = this;

        return {
            tickTime,
            score,
            errors,
            token,
            proof: this.getProof()
        }
    }

    protected getProof() {
        const items = [
            ...this.items
        ];

        const [firstIndex, secondIndex, action] = items.slice(-3);
        const first = this.items[firstIndex];
        const second = this.items[secondIndex];

        switch (action) {
            case SUM:
                return first + second;
            case MINUS:
                return first - second;
            case MULTI:
                return first * second;
            case DEVIDE:
                return first / second;
        }
    }
}
