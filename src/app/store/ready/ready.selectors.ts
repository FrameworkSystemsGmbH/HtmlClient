import { IAppState } from '@app/store/app.state';
import { createSelector } from '@ngrx/store';

const readyState = (state: IAppState) => state.ready;

export const selectReady = createSelector(readyState, state => state.ready);
