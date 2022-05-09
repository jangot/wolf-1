import { element, onDeviceOrientation } from './util';
import { collectInfo } from './util/device-info';
import { AuthInterface, AuthService } from './auth';
import { behaviorForm } from './util/behaviorForm';
import { authForm } from './util/authForm';
import { FakeAuth } from './FakeAuth';

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

export function startSession(shouldSaveData: boolean): Promise<string> {
    renderInfo()

    onDeviceOrientation(() => {
        renderInfo();
    });

    const auth = shouldSaveData ? new AuthService() : new FakeAuth();

    return auth.hasToken()
        .then(() => {
            element('.auth').addClass('hide');

            return auth.getToken();
        })
        .catch(() => {
            behaviorForm();
            element('.auth').removeClass('hide');

            return authForm(auth)
                .then((token) => {
                    element('.auth').addClass('hide');

                    return token;
                });
        });
}
