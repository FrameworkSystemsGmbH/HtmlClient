import { createReducer, on, Action } from '@ngrx/store';
import { initialBrokerState, IBrokerState } from '@app/store/broker/broker.state';
import * as BrokerActions from '@app/store/broker/broker.actions';

const reducer = createReducer(
  initialBrokerState,
  on(BrokerActions.setBrokerState, (state: IBrokerState, payload: { state: IBrokerState }) => {
    return { ...state, ...payload.state };
  }),
  on(BrokerActions.resetBrokerState, () => initialBrokerState)
);

export function brokerStateReducer(state: IBrokerState, action: Action): IBrokerState {
  return reducer(state, action);
}
