import { IBrokerState } from '@app/store/broker/broker.state';
import { createAction, props } from '@ngrx/store';

export const setBrokerState = createAction('[Broker] setBrokerState', props<{ state: IBrokerState }>());

export const resetBrokerState = createAction('[Broker] resetBrokerState');
