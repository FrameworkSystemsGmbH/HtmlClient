import { LoginBroker } from '@app/common/login-broker';

/**
 * Wird mit @type {DeepLinkService} verwendet. Welchen Broker,
 * will ich mich gleich anmelden
 * und soll ich ihn automatisch saven, wenn er noch nicht in der Broker Liste ist. */
export interface StartBrokerInfo {
  broker: LoginBroker;
  login: boolean;
  save: boolean;
}

