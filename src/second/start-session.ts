import { element } from './util';
function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

export async function startSession() {
    if (detectMob()) {
        element('body').addClass('mobile-device');
        element('.device').html('mobile-device');
    } else {
        element('body').addClass('desktop-device');
        element('.device').html('desktop-device');
    }
}
