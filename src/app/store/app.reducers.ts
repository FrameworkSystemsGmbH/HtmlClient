import { brokerStateReducer } from '@app/store/broker/broker.reducers';
import { readyStateReducer } from '@app/store/ready/ready.reducers';

export const appReducer = {
  broker: brokerStateReducer,
  ready: readyStateReducer
};
