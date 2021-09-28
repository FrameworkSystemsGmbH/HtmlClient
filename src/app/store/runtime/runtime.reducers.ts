import * as RuntimeActions from '@app/store/runtime/runtime.actions';
import { initialRuntimeState, IRuntimeState } from '@app/store/runtime/runtime.state';
import { ActionReducer, createReducer, on } from '@ngrx/store';

function checkTitle(title: string | null): string {
  return title != null && title.trim().length > 0 ? title : initialRuntimeState.title;
}

export const runtimeReducer: ActionReducer<IRuntimeState> = createReducer(
  initialRuntimeState,
  on(RuntimeActions.setTitle, (state: IRuntimeState, payload: { title: string | null }) => ({ ...state, title: checkTitle(payload.title) })),
  on(RuntimeActions.setTitleDefault, (state: IRuntimeState) => ({ ...state, title: initialRuntimeState.title })),
  on(RuntimeActions.setDisableFormNavigation, (state: IRuntimeState, payload: { disableFormNavigation: boolean }) => ({ ...state, disableFormNavigation: payload.disableFormNavigation }))
);
