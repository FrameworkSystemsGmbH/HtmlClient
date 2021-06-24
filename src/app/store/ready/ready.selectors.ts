import { IAppState } from '@app/store/app.state';
import { IReadyState } from '@app/store/ready/ready.state';
import { createSelector } from '@ngrx/store';

const readyState = (state: IAppState): IReadyState => state.ready;

export const selectReady = createSelector(readyState, state => state.ready);
