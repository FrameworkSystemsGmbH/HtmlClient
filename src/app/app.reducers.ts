import * as fromBrokerReducers from 'app/store/broker.reducers';

export interface IAppState {
  broker: fromBrokerReducers.IBrokerState;
}

export const APP_REDUCERS = {
  broker: fromBrokerReducers.brokerStateReducer
};
