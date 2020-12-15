import {actionTypes} from './Types';
import {Action} from 'redux';

interface iAction extends Action{
    type: actionTypes,
    payload: any
}

export default iAction;