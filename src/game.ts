export class Game {
    time: number;
    events: (() => void)[];
    startEvents: (() => void)[];
    stoped: boolean;
    debug: boolean;
    score: number;
    element: JQuery
    failed: number;
    timeout: number;

    constructor(element: JQuery) {
        this.events = [];
        this.startEvents = [];
        this.element = element;
    }
    on(cb: () => void) {
        this.events.push(cb);
    }
    onStart(cb: () => void) {
        this.startEvents.push(cb);
    }
    defaultValues() {
        this.time = 1000;
        this.stoped = false;
        this.debug = false;
        this.score = 0;
        this.failed = 0;
    }
    run() {
        if (this.stoped) {
            return ;
        }

        this.events.forEach(item => item());

        if (this.debug) {
            return ;
        }
        this.timeout = setTimeout(() => {
            this.run();
        }, this.time) as unknown as number;;
    }

    fail() {
        this.failed++;
        if (this.failed === 3) {
            this.failGame();
        }
    }

    stop() {
        this.stoped = true;
        clearTimeout(this.timeout);
    }

    start() {
        this.defaultValues();
        this.startEvents.forEach(item => item());
        this.element.removeClass('stop');
        this.stoped = false;
        this.run();
    }

    failGame() {
        this.element.addClass('stop');
        this.stop();
    }

    addScore() {
        this.score++;
        if (this.time > 100) {
            this.time -= 3;
        }
    }
}
