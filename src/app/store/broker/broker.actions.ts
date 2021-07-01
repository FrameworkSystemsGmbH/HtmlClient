import { IBrokerState, IBrokerStateNoToken } from '@app/store/broker/broker.state';
import { createAction, props } from '@ngrx/store';

export const setBrokerState = createAction('[Broker] setBrokerState', props<{ state: IBrokerState }>());

export const setBrokerStateNoToken = createAction('[Broker] setBrokerState', props<{ state: IBrokerStateNoToken }>());

export const setBrokerStateToken = createAction('[Broker] setBrokerStateToken', props<{ token: string }>());

export const resetBrokerState = createAction('[Broker] resetBrokerState');
