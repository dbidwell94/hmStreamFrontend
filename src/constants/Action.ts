import {types} from './Types';

export default interface Action {
    type: types,
    payload: any
}