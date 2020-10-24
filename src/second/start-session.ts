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

function collectInfo() {
    const isMobile = detectMob()
    return {
        isMobile,
        bodyClass: isMobile ? 'mobile-device' : 'desktop-device',
        mainWidth: element('.game').el.clientWidth
    }
}

export async function startSession() {
    const deviceInfo = collectInfo();

    element('body').addClass(deviceInfo.bodyClass);
    element('.device').html(JSON.stringify(deviceInfo, null, 4));
}
