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

const lines = [
    GamePosition.TL,
    GamePosition.TR,
    GamePosition.BL,
    GamePosition.BR,
];

const LESSING_TIME = 3;

export class Game {

    isRun: boolean;
    wolfPosition: GamePosition;
    messages: MessagesQueue;
    crashed: CrashedQueue;
    fail?: GamePosition;
    score: number;
    errors: number;

    private tickTime: number;
    private timeout: number;
    private events: Event[];

    constructor() {
        this.events = [];
        this.resetState();
    }

    on(name: GAME_EVENT, cb: () => void) {
        this.events.push({
            name,
            cb
        });
    }

    start() {
        this.isRun = true;
        this.resetState();
        this.emit(GAME_EVENT.START);
        this.tick();
    }

    stop() {
        this.isRun = false;
        clearTimeout(this.timeout);
        this.emit(GAME_EVENT.STOP);
    }

    tick() {
        this.update();
        this.emit(GAME_EVENT.TICK);
        if (this.isRun) {
            this.timeout = setTimeout(() => {
                this.tick();
            }, this.tickTime);
        }
    }

    setWolfPosition(position: GamePosition) {
        this.wolfPosition = position;
    }

    private resetState() {
        this.tickTime = 1000;
        this.wolfPosition = GamePosition.TL;
        this.messages = {
            [GamePosition.TL]: this.getLineMessages(6),
            [GamePosition.TR]: this.getLineMessages(6),
            [GamePosition.BL]: this.getLineMessages(6),
            [GamePosition.BR]: this.getLineMessages(6),
        };
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
                type: MessageType.SIMPLE,
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
            type: MessageType.SIMPLE
        });
    }

    private setNewItem() {
        const v = random(1, 100);
        if (v < 40) {
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

        this.crashed[site][0].status = true;
    }

    private updateScore() {
        let fail = null;
        lines.forEach((line) => {
            const lastEl = last(this.messages[line]);
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
            this.errors++
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
        if (this.tickTime > 200) {
            this.tickTime -= LESSING_TIME;
        }
    }
}
