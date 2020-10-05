import { createAction, props } from '@ngrx/store';
import { IBrokerState } from '@app/store/broker/broker.state';

export const setBrokerState = createAction('[Broker] setBrokerState', props<{ state: IBrokerState }>());

export const resetBrokerState = createAction('[Broker] resetBrokerState');
