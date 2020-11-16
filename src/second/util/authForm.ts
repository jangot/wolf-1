import { AuthService } from '../auth';
import { element } from './index';

const inputName = document.querySelector<HTMLInputElement>('input[name="name"]');
const inputPhone = document.querySelector<HTMLInputElement>('input[name="phone"]');
const inputConsent = document.querySelector<HTMLInputElement>('input[name="consent"]');
const sendButton = document.querySelector<HTMLInputElement>('button[name="send"]');
const inputPin = document.querySelector<HTMLInputElement>('input[name="pin"]');
const confirmButton = document.querySelector<HTMLInputElement>('button[name="confirm"]');
const changeNumberButton = document.querySelector<HTMLInputElement>('button[name="changeNumber"]');


function showList(list: NodeListOf<Element>) {
    list.forEach((it) => {
        element(it).removeClass('hide');
    });
}

function hideList(list: NodeListOf<Element>) {
    list.forEach((it) => {
        element(it).addClass('hide');
    });
}

function showError(message: string) {
    element('.error-form')
        .removeClass('hide')
        .html(message);
}

function hideError() {
    element('.error-form')
        .addClass('hide');
}

function showConfirm() {
    hideList(document.querySelectorAll<HTMLInputElement>('.name-form'));
    showList(document.querySelectorAll<HTMLInputElement>('.confirm-form'));
}

function hideConfirm() {
    showList(document.querySelectorAll<HTMLInputElement>('.name-form'));
    hideList(document.querySelectorAll<HTMLInputElement>('.confirm-form'));
}

export function authForm(auth: AuthService): Promise<string> {
    return new Promise<string>((resolve) => {
        element(changeNumberButton).on('click', () => {
            hideConfirm()
        });

        let sessionID = '';
        element(sendButton).on('click', () => {
            const userPhone = '+' + inputPhone.value;
            const userName = inputName.value;

            sendButton.disabled = true;

            auth
                .sendPhone(userPhone, userName)
                .then((id: string) => {
                    sessionID = id;
                    sendButton.disabled = false;
                    hideError();
                    showConfirm();
                })
                .catch(() => {
                    sendButton.disabled = false;
                    showError('Something went wrong. Please try later.');
                });
        });
        element(confirmButton).on('click', () => {
            confirmButton.disabled = true;
            auth
                .confirm(sessionID, inputPin.value)
                .then((token) => {
                    confirmButton.disabled = false;
                    hideError();
                    resolve(token);
                })
                .catch((e) => {
                    console.log(e);
                    confirmButton.disabled = false;
                    showError('Something went wrong. Please try later.');
                });
        });
    });
}
