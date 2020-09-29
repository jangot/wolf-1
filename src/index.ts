import '../main.scss';
import { template } from './template';
import $ from 'jquery';
import { app } from './app';

$(() => {
    template();
    const game = app();

    $('.start').on('click', () => {
        game.stop();
        game.start();
    });
});

