import random from 'lodash/random';
import last from 'lodash/last';
import {
    CrashedPosition,
    CrashedQueue,
    Event,
    GAME_EVENT,
    GamePosition,
    Message,
    MessagesQueue,
    MessageType
} from './type';
import { Server } from './server';

const lines = [
    GamePosition.TL,
    GamePosition.TR,
    GamePosition.BL,
    GamePosition.BR,
];

const LESSING_TIME = 3;
const START_TICK_TIME = 1000;

export class Game {

    isRun: boolean;
    wolfPosition: GamePosition;
    messages: MessagesQueue;
    crashed: CrashedQueue;
    fail?: GamePosition;
    score: number;
    errors: number;
    debugMode: boolean;
    firstTick: boolean;
    started: boolean;
    server: Server;
    tickTime: number;
    token: string;

    private timeout: number;
    private events: Event[];

    constructor(token: string, debug: boolean = false) {
        this.events = [];
        this.token = token;
        this.resetState();
        this.debugMode = debug;
    }

    on(name: GAME_EVENT, cb: () => void): () => void {
        this.events.push({
            name,
            cb
        });

        return () => {
            this.events = this.events.filter(it => it.cb !== cb);
        }
    }

    async initConnection() {
        this.server = new Server(this, this.token);
        await this.server.start();
    }

    start() {
        this.isRun = true;
        this.started = true;
        this.resetState();
        this.emit(GAME_EVENT.START);
        this.tick();
    }

    stop() {
        this.isRun = false;
        this.started = false;
        clearTimeout(this.timeout);
        this.emit(GAME_EVENT.STOP);
    }

    pause() {
        if (!this.isRun || !this.started) {
            return;
        }
        console.log('pause')
        this.isRun = false;
        clearTimeout(this.timeout);
        this.emit(GAME_EVENT.PAUSE);
    }

    resume() {
        if (this.isRun || !this.started) {
            return;
        }
        this.isRun = true;
        this.emit(GAME_EVENT.RESUME);
        this.tick();
    }

    tick() {
        this.update();
        this.emit(GAME_EVENT.TICK);

        if (this.isRun && !this.debugMode) {
            this.next();
            this.firstTick = false;
        }
    }

    next() {
        this.timeout = setTimeout(() => {
            this.tick();
        }, this.tickTime);
    }

    setWolfPosition(position: GamePosition) {
        this.wolfPosition = position;
    }

    private resetState() {
        this.tickTime = START_TICK_TIME;
        this.wolfPosition = GamePosition.TL;
        this.messages = {
            [GamePosition.TL]: this.getLineMessages(6),
            [GamePosition.TR]: this.getLineMessages(6),
            [GamePosition.BL]: this.getLineMessages(6),
            [GamePosition.BR]: this.getLineMessages(6),
        };
        this.firstTick = true;
        this.score = 0;
        this.errors = 0;

        this.crashed = {
            [CrashedPosition.LEFT]: this.getLineMessages(5),
            [CrashedPosition.RIGHT]: this.getLineMessages(5),
        };

        this.wolfPosition = GamePosition.TR;
    }

    private emit(eventName: string) {
        this.events.forEach(({name, cb}) => {
            if (eventName === name) {
                cb();
            }
        });
    }

    private getLineMessages(count: number): Message[] {
        const result: Message[] = [];
        for (let i = 0; i < count; i++) {
            result.push({
                type: MessageType.EMAIL,
                status: false,
            });
        }

        return result;
    }

    private update() {
        this.updateMessages();
        this.setNewItem();
        this.updateScore();
        this.updateCrashed();
        this.setNewCrashed();
        this.checkStatus();
    }

    private updateMessages() {
        this.updateLine(this.messages[GamePosition.TL]);
        this.updateLine(this.messages[GamePosition.TR]);
        this.updateLine(this.messages[GamePosition.BL]);
        this.updateLine(this.messages[GamePosition.BR]);
        this.debug('messages', this.messages);
    }

    private updateCrashed() {
        this.updateLine(this.crashed[CrashedPosition.LEFT]);
        this.updateLine(this.crashed[CrashedPosition.RIGHT]);
    }

    private updateLine(messages: Message[]) {
        messages.reduce((prev, current) => {
            const status = current.status;
            const type = current.type;

            current.status = prev.status;
            current.type = prev.type;

            return {
                status,
                type,
            };
        }, {
            status: false,
            type: MessageType.EMAIL
        });
    }

    private setNewItem() {
        const v = random(1, 100);
        if (v < 40 && !this.firstTick) {
            return;
        }

        const randomIndex = random(0, 3);
        const position = lines[randomIndex];

        this.messages[position][0].status = true;
    }

    private setNewCrashed() {
        if (!this.fail) {
            return;
        }


        let site = CrashedPosition.LEFT;
        if (this.fail === GamePosition.BR || this.fail === GamePosition.TR) {
            site = CrashedPosition.RIGHT;
        }

        let type = MessageType.LETTER;
        if (this.fail === GamePosition.BL || this.fail === GamePosition.BR) {
            type = MessageType.EMAIL;
        }

        this.crashed[site][0].status = true;
        this.crashed[site][0].type = type;
    }

    private updateScore() {
        let fail = null;
        lines.forEach((line) => {
            const lastEl = last(this.messages[line]);
            this.debug('last element', line, lastEl.status);
            if (lastEl.status) {
                fail = line;
            }
        });



        if (!fail) {
            this.fail = null;
            return;
        }
        if (fail === this.wolfPosition) {
            this.fail = null;
            this.score++;
            this.lessTime();
        } else {
            this.fail = fail;
            this.errors++;
            this.emit(GAME_EVENT.ERROR)
        }
    }

    private checkStatus() {
        if (this.errors < 3) {
            return;
        }

        this.emit(GAME_EVENT.FAIL);
        this.stop();
    }

    private lessTime() {
        if (this.tickTime > 700) {
            this.tickTime -= 3;
        } else if (this.tickTime > 500) {
            this.tickTime -= 2
        } else if (this.tickTime > 300) {
            this.tickTime -= 1
        }
    }

    private debug(...args: any[]) {
        if (this.debugMode) {
            console.log(...args)
        }
    }
}
