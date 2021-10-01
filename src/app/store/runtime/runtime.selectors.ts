import { IAppState } from '@app/store/app.state';
import { IRuntimeState } from '@app/store/runtime/runtime.state';
import { createSelector } from '@ngrx/store';

const runtimeState = (state: IAppState): IRuntimeState => state.runtime;

export const selectRuntimeState = createSelector(runtimeState, state => state);

export const selectTitle = createSelector(runtimeState, state => state.title);

export const selectSidebarVisible = createSelector(runtimeState, state => state.sidebarVisible);

export const selectDisableFormNavigation = createSelector(runtimeState, state => state.disableFormNavigation);
