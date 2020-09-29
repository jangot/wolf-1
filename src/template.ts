import $ from 'jquery';


function getColl(i: number) {
    const coll = $(`<div class="coll" id="coll_${i+1}"></div>`);

    for (let j = 0; j < 7; j++) {
        const item = $('<div class="item"></div>');
        switch (j) {
            case 6:
                item.addClass('last');
        }
        coll.append(item);
    }
    const woolf = $(`<div class="woolf"></div>`);

    if (i === 0) {
        woolf.addClass('active');
    }

    const failSide = i < 2 ? 'left' : 'right';
     woolf.data('fail-class', `fail_${failSide}`);

    coll.append(woolf);
    return coll;
}

function fail(n: number) {
    const side = n === 0 ? 'left' : 'right';
    const failLine =  $(`<div class="fail-line fail_${side}"></div>`);

    for (let i = 0; i < 6; i++) {
        failLine.append(`<div class="fail-item"></div>`);
    }

    return failLine;
}

export function template() {
    const game = $('#game');
    for (let i = 0; i < 4; i++) {
        game.append(getColl(i));
    }

    game.append(fail(0));
    game.append(fail(1));
}
