import {GAME_EVENT, GamePosition} from './type';
import {Game} from './game';
import { element, El, onDeviceOrientation } from './util/index';
import { collectInfo } from './util/device-info';

type ControllerItem = {
    position: GamePosition;
    code: string;
};

const lines = [
    GamePosition.TL,
    GamePosition.TR,
    GamePosition.BL,
    GamePosition.BR,
];

const l: ControllerItem[] = [
    {
        position: GamePosition.TL,
        code: 'KeyQ'
    },
    {
        position: GamePosition.TR,
        code: 'KeyP'
    },
    {
        position: GamePosition.BL,
        code: 'KeyA'
    },
    {
        position: GamePosition.BR,
        code: 'KeyL'
    }
];

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

export function applyController(game: Game) {
    function setPosition(el: El, position: GamePosition) {
        if (!game.isRun) {
            return;
        }
        game.setWolfPosition(position);
        element('.woolf .active').removeClass('active');
        el.addClass('active');
    }

    l.forEach(({position, code}) => {
        const el = element(`.woolf .${position}`);

        element(`.keyboard .${position}`).on('touchstart', () => setPosition(el, position));
        window.addEventListener('keypress', (e) => {
            if (e.code === code) {
                setPosition(el, position);
            }
        });
    });

    element('.controls .start').on('click', () => {
        game.start();
        toggleFullScreen();
    });
    element('.controls .stop').on('click', () => game.stop());
    element('.controls .next').on('click', () => game.next());

    let started = true;
    game.on(GAME_EVENT.START, () => {
        setPosition(element(`.woolf .${GamePosition.TL}`), GamePosition.TL);
    });
    game.on(GAME_EVENT.STOP, () => {
        toggleFullScreen();
    });

    element('.pause').on('click', () => game.pause());
    element('.resume').on('click', () => game.resume());
    onDeviceOrientation(() => {
        const deviceInfo = collectInfo();
        if (deviceInfo.isVertical) {
            game.pause();
        } else {
            game.resume();
        }
    });
    // game.on(GAME_EVENT.FAIL, () => {
    //     toggleFullScreen();
    // });

}
