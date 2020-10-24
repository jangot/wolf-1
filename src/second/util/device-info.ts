import { element } from './index';

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

type DeviceInfo = {
    isMobile: boolean;
    bodyClass: string;
    mainWidth: number;
    mainHeight: number;
    isVertical: boolean;
};

export function collectInfo(): DeviceInfo {
    const isMobile = detectMob();
    const mainWidth = element('.game').el.clientWidth;
    const mainHeight = element('.game').el.clientHeight;
    return {
        isMobile,
        bodyClass: isMobile ? 'mobile-device' : 'desktop-device',
        mainWidth,
        mainHeight,
        isVertical: mainHeight > mainWidth,
    }
}
