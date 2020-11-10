import { LoginBroker } from '@app/common/login-broker';

export interface StartBrokerInfo {
  broker: LoginBroker;
  login: boolean;
  save: boolean;
}
