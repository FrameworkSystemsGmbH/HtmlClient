import { IBrokerState } from '@app/store/broker/broker.state';
import { IReadyState } from '@app/store/ready/ready.state';

export interface IAppState {
  broker: IBrokerState;
  ready: IReadyState;
}
