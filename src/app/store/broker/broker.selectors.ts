import { createSelector } from '@ngrx/store';
import { IAppState } from 'app/store/app.state';

const brokerState = (state: IAppState) => state.broker;

export const selectBrokerState = createSelector(brokerState, state => state);

export const selectBrokerDirect = createSelector(selectBrokerState, state => state.activeBrokerDirect);

export const selectBrokerName = createSelector(selectBrokerState, state => state.activeBrokerName);

export const selectBrokerFilesUrl = createSelector(selectBrokerState, state => state.activeBrokerFilesUrl);
