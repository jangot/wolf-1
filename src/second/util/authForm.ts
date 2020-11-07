import { AuthService } from '../auth';
import { element } from './index';

const inputName = document.querySelector<HTMLInputElement>('input[name="name"]');
const inputPhone = document.querySelector<HTMLInputElement>('input[name="phone"]');
const inputConsent = document.querySelector<HTMLInputElement>('input[name="consent"]');
const sendButton = document.querySelector<HTMLInputElement>('button[name="send"]');
const inputPin = document.querySelector<HTMLInputElement>('input[name="pin"]');
const inputId = document.querySelector<HTMLInputElement>('input[name="gameId"]');
const confirmButton = document.querySelector<HTMLInputElement>('button[name="confirm"]');


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

function showConfirm() {
    hideList(document.querySelectorAll<HTMLInputElement>('.name-form'));
    showList(document.querySelectorAll<HTMLInputElement>('.confirm-form'));
}

export function authForm(auth: AuthService): Promise<string> {
    return new Promise<string>((resolve) => {

        element(sendButton).on('click', () => {
            auth
                .sendPhone(inputPhone.value, inputName.value)
                .then((resultID: string) => {
                    inputId.value = resultID;
                    showConfirm();
                })
                .catch(() => {
                    showError('Something went wrong. Please try later.');
                });
        });
        element(confirmButton).on('click', () => {
            auth
                .confirm(inputId.value, inputPin.value)
                .then((token) => {
                    resolve(token);
                })
                .catch(() => {
                    showError('Something went wrong. Please try later.');
                });
        });
    });
}
