import './main.scss';
import {
    CrashedPosition,
    CrashedQueue,
    GAME_EVENT,
    GamePosition,
    MessagesQueue,
} from './type';
import {Game} from './game';
import {applyController} from './controller';
import {element} from './util/index';

function renderLine(name: GamePosition, messages: MessagesQueue) {
    messages[name].forEach((item, index) => {
        const el = element(`.messages .${name} div:nth-child(${index + 1})`);
        if (!el) {
            return;
        }
        if (item.status) {
            el.addClass('active');
        } else {
            el.removeClass('active');
        }
    });
}

function renderCrashedLine(name: CrashedPosition, messages: CrashedQueue) {
    messages[name].forEach((item, index) => {
        const el = element(`.crashed .${name} div:nth-child(${index + 1})`);

        if (item.status) {
            el.addClass('active')
        } else {
            el.removeClass('active');
        }
    });
}

const lines = [
    GamePosition.TL,
    GamePosition.TR,
    GamePosition.BL,
    GamePosition.BR,
];

const g = new Game();

g.on(GAME_EVENT.START, () => {
    console.log('Start');
});

g.on(GAME_EVENT.TICK, () => {
    renderLine(GamePosition.TL, g.messages);
    renderLine(GamePosition.TR, g.messages);
    renderLine(GamePosition.BL, g.messages);
    renderLine(GamePosition.BR, g.messages);
});

g.on(GAME_EVENT.TICK, () => {
    renderCrashedLine(CrashedPosition.LEFT, g.crashed);
    renderCrashedLine(CrashedPosition.RIGHT, g.crashed);
});

g.on(GAME_EVENT.TICK, () => {
    element('.fail').html(g.fail || 'non');
    element('.score').html('v4' + ' / ' + g.score + ' / ' + g.errors);
});

g.on(GAME_EVENT.STOP, () => {
    console.log('SCORE:', g.score)
});

applyController(g);
