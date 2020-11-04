import { element, onDeviceOrientation } from './util';
import { collectInfo } from './util/device-info';
import { AuthService } from './auth';
import { behaviorForm } from './util/behaviorForm';
import { authForm } from './util/authForm';

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

export function startSession(): Promise<string> {
    renderInfo()

    onDeviceOrientation(() => {
        renderInfo();
    });

    const auth = new AuthService();
    if (auth.hasToken()) {
        element('.auth').addClass('hide');
        return Promise.resolve(auth.getToken());
    }
    behaviorForm();
    element('.auth').removeClass('hide');

    return authForm(auth)
        .then((token) => {
            element('.auth').addClass('hide');

            return token;
        });
}
