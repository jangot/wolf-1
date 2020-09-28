export class Game {
    time: number;
    events: (() => void)[];
    stoped: boolean;
    debug: boolean;
    score: number;
    element: JQuery
    failed: number;

    constructor(element: JQuery) {
        this.time = 1000;
        this.events = [];
        this.stoped = false;
        this.debug = false;
        this.score = 0;
        this.element = element;
        this.failed = 0;
    }
    on(cb: () => void) {
        this.events.push(cb);
    }
    run() {
        if (this.stoped) {
            return ;
        }

        this.events.forEach(item => item());

        if (this.debug) {
            return ;
        }
        setTimeout(() => {
            this.run();
        }, this.time);
    }

    fail() {
        this.failed++;
        if (this.failed === 3) {
            this.stop();
        }
    }

    stop() {
        this.element.addClass('stop');
        this.stoped = true;
    }

    addScore() {
        this.score++;
        if (this.time  > 100) {
            this.time -= 3;
        }
    }
}
