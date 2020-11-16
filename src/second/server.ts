import axios, { AxiosInstance } from 'axios';
import md5 from 'md5';
import { Game } from './game';
import { GAME_EVENT } from './type';
import { BASE_URL } from './constants';
import getId from './getId';



const TICKS_COUNT_FOR_REQUEST = 10;
export class Server {
    protected game: Game;
    protected client: AxiosInstance;
    protected token: string;
    protected tickCount: number;
    protected items: number[];
    protected tickPromise: Promise<any>;

    constructor(game: Game, token: string) {
        this.game = game;
        this.client = this.client = axios.create({
            baseURL: BASE_URL,
            headers: {
                ibauth: token
            }
        });
        this.tickCount = 0;
        this.subscribe();
    }
    async start() {
        const { data } = await this.client.post('/start');

        this.token = data.token;
        this.items = data.items;
    }

    protected async tick() {
        this.tickCount++
        if (this.tickCount === TICKS_COUNT_FOR_REQUEST) {
            this.tickCount = 0;

            this.tickPromise = this.client.post('/tick', this.getData());
            this.tickPromise.then(({ data }) => {
                this.items = data.items;
            });
        }
    }

    protected async finish() {
        this.tickPromise
            .then(() => {
                return this.client.post('/finish', this.getData());
            })
            .then(() => {
                console.log('Finished!');
            });
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
            timestamp: new Date().getTime(),
            updateId: this.getId(),
        }
    }

    getId() {
        const id = getId(this.items.map(this.itemToIdData));

        return md5(`Salt${id.toString()}Peanuts`);
    }

    itemToIdData(generatedItem: number): any {
        if (typeof generatedItem === 'string') {
            return generatedItem + 'custom_id';
        }
        if (typeof generatedItem === 'boolean') {
            return !generatedItem;
        }

        return generatedItem;
    }
}
