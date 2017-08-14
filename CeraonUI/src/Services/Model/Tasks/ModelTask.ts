import CeraonDispatcher from '../../../Store/CeraonDispatcher';
import CeraonAction from '../../../Actions/CeraonAction';
import * as Actions from '../../../Actions/Index';

export abstract class ModelTask<Result> {
  private _dispatchAction: boolean = true;
  private _hasFinished: boolean = false;

  constructor(private _startLoading: boolean) {

  }

  run(next?: (task: ModelTask<Result>, result: Result) => void) {
    setTimeout(()=> {
      if (!this._hasFinished) {
        CeraonDispatcher(Actions.createStartLoadingAction());
      }
    }, 500); // Don't start loading for 500 ms.
  }

  cancel() {
    this._dispatchAction = false;
  }

  protected dispatchAction(action: CeraonAction) {
    this._hasFinished = true;
    if (this._dispatchAction) {
      CeraonDispatcher(action);
    }
  }
}

export default ModelTask;
