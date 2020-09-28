import $ from 'jquery';


function getColl(i: number) {
    const coll = $(`<div class="coll" id="coll_${i+1}"></div>`);

    for (let i = 0; i < 7; i++) {
        const item = $('<div class="item"></div>');
        switch (i) {
            case 6:
                item.addClass('last');
        }
        coll.append(item);
    }

    if (i === 0) {
        coll.append(`<div class="woolf active"></div>`);
    } else {
        coll.append(`<div class="woolf"></div>`);
    }

    return coll;
}

export function template() {
    const game = $('#game');
    for (let i = 0; i < 4; i++) {
        game.append(getColl(i));
    }
}
