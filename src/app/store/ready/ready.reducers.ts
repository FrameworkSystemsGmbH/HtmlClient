import * as ReadyActions from '@app/store/ready/ready.actions';
import { IReadyState, initialReadyState } from '@app/store/ready/ready.state';
import { Action, createReducer, on } from '@ngrx/store';

const reducer = createReducer(
  initialReadyState,
  on(ReadyActions.setReady, (state: IReadyState, payload: { ready: boolean }) => ({ ...state, ready: payload.ready }))
);

export function readyStateReducer(state: IReadyState, action: Action): IReadyState {
  return reducer(state, action);
}
