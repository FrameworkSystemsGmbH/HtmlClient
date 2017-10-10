import { Action } from '@ngrx/store';
import { LoginBroker } from '../common/login-broker';

export const SET_BROKER = 'SET_BROKER';
export const SET_BROKER_REQUEST_URL = 'SET_BROKER_REQUEST_URL';
export const SET_BROKER_FILE_URL = 'SET_BROKER_FILE_URL';
export const SET_BROKER_IMAGE_URL = 'SET_BROKER_IMAGE_URL';

export class SetBrokerAction implements Action {
  readonly type = SET_BROKER;
  constructor(public payload: LoginBroker) { }
}

export class SetBrokerRequestUrlAction implements Action {
  readonly type = SET_BROKER_REQUEST_URL;
  constructor(public payload: string) { }
}

export class SetBrokerFilesUrlAction implements Action {
  readonly type = SET_BROKER_FILE_URL;
  constructor(public payload: string) { }
}

export class SetBrokerImageUrlAction implements Action {
  readonly type = SET_BROKER_IMAGE_URL;
  constructor(public payload: string) { }
}

export type BrokerActions = SetBrokerAction | SetBrokerRequestUrlAction | SetBrokerFilesUrlAction | SetBrokerImageUrlAction;
