import * as ReadyActions from '@app/store/ready/ready.actions';
import { initialReadyState, IReadyState } from '@app/store/ready/ready.state';
import { ActionReducer, createReducer, on } from '@ngrx/store';

export const readyReducer: ActionReducer<IReadyState> = createReducer(
  initialReadyState,
  on(ReadyActions.setReady, (state: IReadyState, payload: { ready: boolean }) => ({ ...state, ready: payload.ready }))
);
