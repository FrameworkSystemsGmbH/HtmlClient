import * as BrokerActions from '@app/store/broker/broker.actions';
import { IBrokerState, IBrokerStateNoToken, initialBrokerState } from '@app/store/broker/broker.state';
import { ActionReducer, createReducer, on } from '@ngrx/store';

export const brokerReducer: ActionReducer<IBrokerState> = createReducer(
  initialBrokerState,
  on(BrokerActions.setBrokerState, (state: IBrokerState, payload: { state: IBrokerState }) => ({ ...state, ...payload.state })),
  on(BrokerActions.setBrokerStateNoToken, (state: IBrokerState, payload: { state: IBrokerStateNoToken }) => ({ ...state, ...payload.state })),
  on(BrokerActions.setBrokerStateToken, (state: IBrokerState, payload: { token: string }) => ({ ...state, activeBrokerToken: payload.token })),
  on(BrokerActions.resetBrokerState, () => initialBrokerState)
);
