import { IRuntimeState } from '@app/store/runtime/runtime.state';
import { createAction, props } from '@ngrx/store';

export const setRuntimeState = createAction('[Runtime] setRuntimeState', props<{ state: IRuntimeState }>());

export const setTitle = createAction('[Runtime] setTitle', props<{ title: string }>());

export const setTitleDefault = createAction('[Runtime] setTitleDefault');

export const setDisableFormNavigation = createAction('[Runtime] setDisableFormNavigation', props<{ disableFormNavigation: boolean }>());

export const toggleSidebar = createAction('[Runtime] toggleSidebar');
