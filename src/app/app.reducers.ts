import * as fromBrokerReducers from './store/broker.reducers';

export interface IAppState {
  broker: fromBrokerReducers.IBrokerState;
}

export const APP_REDUCERS = {
  broker: fromBrokerReducers.brokerStateReducer
};
