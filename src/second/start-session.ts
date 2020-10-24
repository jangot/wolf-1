import { element, onDeviceOrientation } from './util';
import { collectInfo } from './util/device-info';

function renderInfo() {
    const deviceInfo = collectInfo();

    element('body').addClass(deviceInfo.bodyClass);
    element('.device').html(JSON.stringify(deviceInfo, null, 4));
    if (deviceInfo.isVertical) {
        element('body')
            .addClass('vertically')
            .removeClass('horizontally');
    } else {
        element('body')
            .addClass('horizontally')
            .removeClass('vertically');
    }
}

export async function startSession() {
    renderInfo()

    onDeviceOrientation(() => {
        renderInfo();
    });
}
