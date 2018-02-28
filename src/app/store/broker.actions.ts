import { Action } from '@ngrx/store';

export const SET_BROKER_NAME = 'SET_BROKER_NAME';
export const SET_BROKER_TOKEN = 'SET_BROKER_TOKEN';
export const SET_BROKER_URL = 'SET_BROKER_URL';
export const SET_BROKER_DEV = 'SET_BROKER_DEV';
export const SET_BROKER_FILE_URL = 'SET_BROKER_FILE_URL';
export const SET_BROKER_IMAGE_URL = 'SET_BROKER_IMAGE_URL';
export const SET_BROKER_REQUEST_URL = 'SET_BROKER_REQUEST_URL';

export const RESET_BROKER = 'RESET_BROKER';

export class SetBrokerNameAction implements Action {
  public readonly type = SET_BROKER_NAME;
  constructor(public payload: string) { }
}

export class SetBrokerTokenAction implements Action {
  public readonly type = SET_BROKER_TOKEN;
  constructor(public payload: string) { }
}

export class SetBrokerUrlAction implements Action {
  public readonly type = SET_BROKER_URL;
  constructor(public payload: string) { }
}

export class SetBrokerDevAction implements Action {
  public readonly type = SET_BROKER_DEV;
  constructor(public payload: boolean) { }
}

export class SetBrokerFilesUrlAction implements Action {
  public readonly type = SET_BROKER_FILE_URL;
  constructor(public payload: string) { }
}

export class SetBrokerImageUrlAction implements Action {
  public readonly type = SET_BROKER_IMAGE_URL;
  constructor(public payload: string) { }
}

export class SetBrokerRequestUrlAction implements Action {
  public readonly type = SET_BROKER_REQUEST_URL;
  constructor(public payload: string) { }
}

export class ResetBrokerAction implements Action {
  public readonly type = RESET_BROKER;
}

export type BrokerActions = SetBrokerNameAction | SetBrokerTokenAction | SetBrokerUrlAction | SetBrokerDevAction | SetBrokerRequestUrlAction | SetBrokerFilesUrlAction | SetBrokerImageUrlAction | ResetBrokerAction;
