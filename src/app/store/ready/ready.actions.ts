import { createAction, props } from '@ngrx/store';

export const setReady = createAction('[Ready] setReady', props<{ ready: boolean }>());
