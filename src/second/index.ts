import './styles/index.scss';

import padStart from 'lodash/padStart';
import { CrashedPosition, CrashedQueue, GAME_EVENT, GamePosition, MessagesQueue, } from './type';
import { Game } from './game';
import { applyController } from './controller';
import { element, onDeviceOrientation } from './util/index';
import { startSession } from './start-session';

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

startSession()
    .then(() => {

        onDeviceOrientation(() => {
            console.log('orientation');
        });

        const g = new Game();

        g.on(GAME_EVENT.START, () => {
            element('.error-0').removeClass('happened');
            element('.error-1').removeClass('happened');
            element('.error-2').removeClass('happened');
            element('.greeting').addClass('hide');
            element('.controls').addClass('hide');
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


            element('.score .count').html(padStart(g.score.toString(), 4, '0'));
        });

        g.on(GAME_EVENT.ERROR, () => {
            for(let i = 0; i < g.errors; i++) {
                element(`.error-${i}`).addClass('happened');
            }
        });

        g.on(GAME_EVENT.STOP, () => {
            element('.greeting').removeClass('hide');
            element('.controls').removeClass('hide');
        });

        applyController(g);
    })
    .catch((e) => {
        console.log('Error');
        console.log(e);
    });
