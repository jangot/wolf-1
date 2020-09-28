import $ from 'jquery';
import random from 'lodash/random';
import {Game} from './game';
import {CLASS} from './constants';
import {controller} from './controller';

export function app() {
    const g = new Game($('#game'));

    g.on((): void => {
        $(`.${CLASS.SELECTED}`).each(function () {
            $(this)
                .removeClass(CLASS.SELECTED)
                .next('.item')
                .addClass(CLASS.SELECTED)

        })
    });

    g.on(() => {
        const r = random(1, 100);

        if (r > 40) {
            const n = random(1, 4);

            const item = $(`#coll_${n}`).children().first();

            item.addClass(CLASS.SELECTED);
        }
    });

    g.on(() => {
        const selected = $('.last').filter(`.${CLASS.SELECTED}`);
        if (selected.length === 0) {
            return;
        }

        const woolf = selected.next();

        if (!woolf.hasClass(CLASS.ACTIVE)) {
            g.fail();
        } else {
            g.addScore();
        }

        $('.score').html(g.score + ' / ' + g.failed);
    })

    g.run();

    $(window).keypress((e) => {
        controller.forEach(({ key, cb }) => {
            if (key === e.keyCode) {
                cb();
            }
        });
    });
}
