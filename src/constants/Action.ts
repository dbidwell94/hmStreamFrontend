import Types from './Types';
import {Action} from 'redux';

interface iAction extends Action{
    type: Types,
    payload: any
}

export default iAction;