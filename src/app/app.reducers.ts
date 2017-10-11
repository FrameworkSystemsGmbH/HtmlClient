import * as fromBrokerReducers from './store/broker.reducers';

export interface AppState {
  broker: fromBrokerReducers.BrokerState
}

export const APP_REDUCERS = {
  broker: fromBrokerReducers.brokerStateReducer
}
