import * as fromBroker from './store/broker.reducers';

export interface State {
  broker: fromBroker.State
}

export const APP_REDUCERS = {
  broker: fromBroker.brokerStateReducer
}
