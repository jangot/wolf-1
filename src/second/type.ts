
export enum GamePosition {
    TL = 'tl',
    TR = 'tr',
    BL = 'bl',
    BR = 'br'
}

export enum CrashedPosition {
    LEFT = 'left',
    RIGHT = 'right',
}

export enum GAME_EVENT {
    START = 'start',
    STOP = 'stop',
    TICK = 'tick',
    FAIL = 'fail',
    ERROR = 'error',
    PAUSE = 'pause',
    RESUME = 'resume',
}

export type Event = {
    name: GAME_EVENT;
    cb: () => void;
}

export enum MessageType {
    SIMPLE = 'simple'
}

export type CrashedQueue = {
    [CrashedPosition.LEFT]: Message[];
    [CrashedPosition.RIGHT]: Message[];
}

export type MessagesQueue = {
    [GamePosition.TL]: Message[];
    [GamePosition.TR]: Message[];
    [GamePosition.BL]: Message[];
    [GamePosition.BR]: Message[];
}

export type Message = {
    type: MessageType;
    status: boolean;
}
