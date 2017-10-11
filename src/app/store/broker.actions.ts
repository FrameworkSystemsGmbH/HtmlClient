import { Action } from '@ngrx/store';

export const SET_BROKER_NAME = 'SET_BROKER_NAME';
export const SET_BROKER_TOKEN = 'SET_BROKER_TOKEN';
export const SET_BROKER_URL = 'SET_BROKER_URL';
export const SET_BROKER_FILE_URL = 'SET_BROKER_FILE_URL';
export const SET_BROKER_IMAGE_URL = 'SET_BROKER_IMAGE_URL';
export const SET_BROKER_REQUEST_URL = 'SET_BROKER_REQUEST_URL';

export const RESET_BROKER = 'RESET_BROKER';

export class SetBrokerNameAction implements Action {
  readonly type = SET_BROKER_NAME;
  constructor(public payload: string) { }
}

export class SetBrokerTokenAction implements Action {
  readonly type = SET_BROKER_TOKEN;
  constructor(public payload: string) { }
}

export class SetBrokerUrlAction implements Action {
  readonly type = SET_BROKER_URL;
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

export class SetBrokerRequestUrlAction implements Action {
  readonly type = SET_BROKER_REQUEST_URL;
  constructor(public payload: string) { }
}

export class ResetBrokerAction implements Action {
  readonly type = RESET_BROKER;
}

export type BrokerActions = SetBrokerNameAction | SetBrokerTokenAction | SetBrokerUrlAction | SetBrokerRequestUrlAction | SetBrokerFilesUrlAction | SetBrokerImageUrlAction | ResetBrokerAction;
