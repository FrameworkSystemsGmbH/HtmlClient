import { IBrokerState } from '@app/store/broker/broker.state';
import { IReadyState } from '@app/store/ready/ready.state';
import { IRuntimeState } from '@app/store/runtime/runtime.state';

export interface IAppState {
  broker: IBrokerState;
  ready: IReadyState;
  runtime: IRuntimeState;
}
