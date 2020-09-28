import $ from 'jquery';
import random from 'lodash/random';
import {Game} from './game';
import {CLASS} from './constants';
import {controller} from './controller';

function moveClass(className: string) {
    const list = $(`.${className}`);
    list.each(function() {
        $(this).removeClass(className);
    });
    list.each(function () {
        $(this)
            .next()
            .addClass(className);
    });
}

export function app() {
    const g = new Game($('#game'));

    // Moving selected items
    g.on((): void => {
        moveClass(CLASS.SELECTED);
    });

    // Start moving
    g.on(() => {
        const r = random(1, 100);

        if (r > 40) {
            const n = random(1, 4);

            const item = $(`#coll_${n}`).children().first();

            item.addClass(CLASS.SELECTED);
        }
    });

    // Fail
    g.on(() => {
        const selected = $('.last').filter(`.${CLASS.SELECTED}`);
        if (selected.length === 0) {
            return;
        }

        const woolf = selected.next();

        if (!woolf.hasClass(CLASS.ACTIVE)) {
            const failClass = woolf.data('fail-class');
            $(`.${failClass}`).children().first().addClass(CLASS.GOING);
            g.fail();
        } else {
            g.addScore();
        }

        $('.score').html(g.score + ' / ' + g.failed);
    });

    // moving fail
    g.on(() => {
        moveClass(CLASS.GOING);
    });

    g.run();

    $(window).keypress((e) => {
        controller.forEach(({ key, cb }) => {
            if (key === e.keyCode) {
                cb();
            }
        });
    });

    controller.forEach(({ name, cb }) => {
        $(`.${name}`).on('click', cb);
    });
}
