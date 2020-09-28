import {CLASS, SIM} from './constants';
import $ from 'jquery';

export type ControllerItem = {
    name: string;
    key: number;
    cb: () => void;
}
export const controller: ControllerItem[] = [
    {
        name: 'top-let',
        key: SIM.Q,
        cb: () => {
            $(`.${CLASS.ACTIVE}`).removeClass(CLASS.ACTIVE);
            $('#coll_1 .woolf').addClass(CLASS.ACTIVE);
        }
    },
    {
        name: 'bottom-left',
        key: SIM.A,
        cb: () => {
            $(`.${CLASS.ACTIVE}`).removeClass(CLASS.ACTIVE);
            $('#coll_2 .woolf').addClass(CLASS.ACTIVE);
        }
    },
    {
        name: 'top-right',
        key: SIM.P,
        cb: () => {
            $(`.${CLASS.ACTIVE}`).removeClass(CLASS.ACTIVE);
            $('#coll_3 .woolf').addClass(CLASS.ACTIVE);
        }
    },
    {
        name: 'bottom-right',
        key: SIM.L,
        cb: () => {
            $(`.${CLASS.ACTIVE}`).removeClass(CLASS.ACTIVE);
            $('#coll_4 .woolf').addClass(CLASS.ACTIVE);
        }
    },
];
