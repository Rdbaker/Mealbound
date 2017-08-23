import CeraonAction from '../CeraonAction';
import CeraonActionType from '../CeraonActionType';
import { ModelUpdateResult } from '../../Services/ICeraonModelAPI';

export interface UpdatePaymentInfoAction extends CeraonAction {
  stripeToken: string;
}

export function createUpdatePaymentInfoAction(stripeToken: string) : UpdatePaymentInfoAction {
  return {
    type: CeraonActionType.UpdatePaymentInfo,
    stripeToken: stripeToken,
  };
}
