export function addClass(element: Element, name: string): Element {
    const arr = element.className.split(' ');
    if (arr.indexOf(name) == -1) {
        arr.push(name);
        element.className = arr.filter(it => !!it).join(' ');
    }

    return element;
}

export function removeClass(element: Element, name: string): Element {
    const arr = element.className.split(' ');

    element.className = arr.filter(it => it !== name).join(' ');

    return element;
}

export function onDeviceOrientation(cb: (e: any) => void) {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", cb, true);
    }
}



export class El {
    public el: Element;
    constructor(selector: string) {
        this.el = document.querySelector(selector);
    }
    addClass(name: string) {
        if(!this.el) {
            return this;
        }
        addClass(this.el, name);

        return this;
    }
    removeClass(name: string) {
        if(!this.el) {
            return this;
        }

        removeClass(this.el, name);

        return this;
    }

    html(content: string) {
        if(!this.el) {
            return this;
        }

        this.el.innerHTML = content;

        return this;
    }

    on(event: string, cb: (e: any) => void) {
        if (!this.el) {
            return this;
        }

        this.el.addEventListener(event, cb);

        return this;
    }
}

export function element(selector: string): El {
    return new El(selector);
}
