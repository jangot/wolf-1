import {GamePosition} from './type';
import $ from 'jquery';
import {Game} from './game';

type ControllerItem = {
    position: GamePosition;
    key: number;
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
        key: 113
    },
    {
        position: GamePosition.TR,
        key: 112
    },
    {
        position: GamePosition.BL,
        key: 97
    },
    {
        position: GamePosition.BR,
        key: 108
    }
];


export function applyController(game: Game) {
    l.forEach(({position, key}) => {
        const el = $(`.woolf .${position}`);

        function setPosiont() {
            game.setWolfPosition(position);
            $('.woolf .active').removeClass('active');
            el.addClass('active');
        }

        $(`.keyboard .${position}`).on('touchstart', setPosiont);
        $(window).on('keypress', (e) => {
            if (e.keyCode === key) {
                setPosiont();
            }
        });
    });
}
