import CeraonStore from './CeraonStore';
import CeraonAction from '../Actions/CeraonAction';

// Separate dispatch file to hide the rest of the actions that can be taken on CeraonStore
export default function dispatch(action: CeraonAction) {
  CeraonStore.dispatch(action);
}
