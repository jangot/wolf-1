import './main.scss';
import $ from 'jquery';
import {CrashedPosition, CrashedQueue, GAME_EVENT, GamePosition, MessagesQueue,} from './type';
import {Game} from './game';

function renderLine(name: GamePosition, messages: MessagesQueue) {
    messages[name].forEach((item, index) => {
        const el = $(`.messages .${name} div:nth-child(${index + 1})`);

        if (item.status) {
            el.addClass('active')
        } else {
            el.removeClass('active');
        }
    });
}

function renderCrashedLine(name: CrashedPosition, messages: CrashedQueue) {
    messages[name].forEach((item, index) => {
        const el = $(`.crashed .${name} div:nth-child(${index + 1})`);

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

$(() => {
    const g = new Game();

    lines.forEach((position) => {
        const el = $(`.woolf .${position}`);
        el.on('click', () => {
            g.setWolfPosition(position);
            $('.woolf .active').removeClass('active');
            el.addClass('active');
        });
    });

    g.on(GAME_EVENT.START, () => {
        $(`.woolf .${g.wolfPosition}`).addClass('active');
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
        $('.fail').html(g.fail || 'non');
        $('.score').html(g.score + ' / ' + g.errors);
    });

    g.on(GAME_EVENT.STOP, () => {
        console.log('stop');
    });

    g.start();
});



