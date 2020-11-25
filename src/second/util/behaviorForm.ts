import { element } from './index';

const inputName = document.querySelector<HTMLInputElement>('input[name="name"]');
const inputPhone = document.querySelector<HTMLInputElement>('input[name="phone"]');
const inputConsent = document.querySelector<HTMLInputElement>('input[name="consent"]');
const sendButton = document.querySelector<HTMLInputElement>('button[name="send"]');
const inputPin = document.querySelector<HTMLInputElement>('input[name="pin"]');
const confirmButton = document.querySelector<HTMLInputElement>('button[name="confirm"]');

const MIN_PHONE_LENGTH = 11;
const NUMBER_PHONE_LENGTH = 13;

function typePhone() {
    const val = parseInt(inputPhone.value);

    if (isNaN(val)) {
        inputPhone.value = '';
    } else {
        let srt = val.toString();
        if (srt.length > NUMBER_PHONE_LENGTH) {
            srt = srt.substring(0, NUMBER_PHONE_LENGTH);
        }
        inputPhone.value = srt;
    }

    disableSendButton();
}

function disableSendButton() {
    const disabled = inputName.value === '' || !inputConsent.checked || inputPhone.value.length < MIN_PHONE_LENGTH;

    sendButton.disabled = disabled;
}

function disableConfirmButton() {
    const val = parseInt(inputPin.value);
    if (isNaN(val)) {
        inputPin.value = '';
    } else {
        let srt = val.toString();
        if (srt.length > 4) {
            srt = srt.substring(0, 4);
        }
        inputPin.value = srt;
    }

    confirmButton.disabled = inputPin.value.length < 4;
}

export function behaviorForm() {
    element(inputConsent).on('change', disableSendButton);
    element(inputName).on('keyup', disableSendButton);

    element(inputPhone).on('change', typePhone);
    element(inputPhone).on('keyup', typePhone);

    element(inputPin).on('change', disableConfirmButton);
    element(inputPin).on('keyup', disableConfirmButton);
}
