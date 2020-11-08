import { GAME_EVENT, GamePosition } from './type';
import { Game } from './game';
import { El, element, onDeviceOrientation } from './util/index';
import { collectInfo } from './util/device-info';

type ControllerSymbolItem = {
    position: GamePosition;
    code: string;
};

type ControllerArrow = {
    [key: string]: (game: Game) => GamePosition | null;
}

const symbolKeysController: ControllerSymbolItem[] = [
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


const arrowListController: ControllerArrow = {
    ArrowUp: (g: Game) => {
        if (g.wolfPosition === GamePosition.BL) {
            return GamePosition.TL
        } else if (g.wolfPosition === GamePosition.BR) {
            return GamePosition.TR
        }
        return null;
    },
    ArrowDown: (g: Game) => {
        if (g.wolfPosition === GamePosition.TL) {
            return GamePosition.BL;
        } else if (g.wolfPosition === GamePosition.TR) {
            return GamePosition.BR;
        }
        return null;
    },
    ArrowLeft: (g: Game) => {
        if (g.wolfPosition === GamePosition.TR) {
            return GamePosition.TL;
        } else if (g.wolfPosition === GamePosition.BR) {
            return GamePosition.BL;
        }
        return null;
    },
    ArrowRight: (g: Game) => {
        if (g.wolfPosition === GamePosition.TL) {
            return GamePosition.TR;
        } else if (g.wolfPosition === GamePosition.BL) {
            return GamePosition.BR;
        }
        return null;
    },
    KeyQ: () => GamePosition.TL,
    KeyP: () => GamePosition.TR,
    KeyA: () => GamePosition.BL,
    KeyL: () => GamePosition.BR,
}

const deviceInfo = collectInfo();
function toggleFullScreen() {
    if (!deviceInfo.isMobile) {
        return;
    }
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

export function applyController(game: Game) {
    const woolfEl = {
        [GamePosition.TL]: element(`.woolf .${GamePosition.TL}`),
        [GamePosition.TR]: element(`.woolf .${GamePosition.TR}`),
        [GamePosition.BL]: element(`.woolf .${GamePosition.BL}`),
        [GamePosition.BR]: element(`.woolf .${GamePosition.BR}`),
    };

    function setPosition(position: GamePosition) {
        if (!game.isRun) {
            return;
        }
        game.setWolfPosition(position);
        element('.woolf .active').removeClass('active');
        woolfEl[position].addClass('active');
    }

    element(`.keyboard .${GamePosition.TL}`).on('touchstart', () => setPosition(GamePosition.TL));
    element(`.keyboard .${GamePosition.TR}`).on('touchstart', () => setPosition(GamePosition.TR));
    element(`.keyboard .${GamePosition.BL}`).on('touchstart', () => setPosition(GamePosition.BL));
    element(`.keyboard .${GamePosition.BR}`).on('touchstart', () => setPosition(GamePosition.BR));

    window.addEventListener('keydown', (e) => {
        if (!game.isRun) {
            return;
        }

        if (arrowListController[e.code]) {
            const position = arrowListController[e.code](game);
            if (position && game.wolfPosition !== position) {
                setPosition(position);
            }
        }
    });

    element('.controls .start').on('click', () => {
        const buttonStart = <HTMLInputElement> document.querySelector('.controls .start')
        buttonStart.disabled = true;
        element('.loading').removeClass('visible-hide');
        game
            .initConnection()
            .then(() => {
                buttonStart.disabled = false;
                toggleFullScreen();
                game.start();
                element('.loading').addClass('visible-hide');
            })
            .catch((e) => {
                element('.loading').addClass('visible-hide');
                console.log('ERROR');
                console.log(e)
            });

    });

    game.on(GAME_EVENT.START, () => {
        setPosition(GamePosition.TL);
    });
    game.on(GAME_EVENT.STOP, () => {
        toggleFullScreen();
    });

    onDeviceOrientation(() => {
        const deviceInfo = collectInfo();
        if (deviceInfo.isVertical) {
            game.pause();
        } else {
            game.resume();
        }
    });
    game.on(GAME_EVENT.FAIL, () => {
        toggleFullScreen();
    });

}
