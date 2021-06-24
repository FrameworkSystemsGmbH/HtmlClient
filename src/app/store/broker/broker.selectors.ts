import { IAppState } from '@app/store/app.state';
import { IBrokerState } from '@app/store/broker/broker.state';
import { createSelector } from '@ngrx/store';

const brokerState = (state: IAppState): IBrokerState => state.broker;

export const selectBrokerState = createSelector(brokerState, state => state);

export const selectBrokerDirect = createSelector(selectBrokerState, state => state.activeBrokerDirect);

export const selectBrokerName = createSelector(selectBrokerState, state => state.activeBrokerName);

export const selectBrokerFilesUrl = createSelector(selectBrokerState, state => state.activeBrokerFilesUrl);

export const selectBrokerReportUrl = createSelector(selectBrokerState, state => state.activeBrokerReportUrl);
