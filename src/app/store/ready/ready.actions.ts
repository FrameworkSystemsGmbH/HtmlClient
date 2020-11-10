import { createAction, props } from '@ngrx/store';

export const setReady = createAction('[Ready] setRead', props<{ ready: boolean }>());
