import { LoginBroker } from '../common/login-broker';
import * as fromBroker from './broker.actions';

export interface State {
  activeBroker: LoginBroker,
  activeBrokerFilesUrl: string;
  activeBrokerImageUrl: string;
  activeBrokerRequestUrl: string;
}

const initialState: State = {
  activeBroker: null,
  activeBrokerFilesUrl: null,
  activeBrokerImageUrl: null,
  activeBrokerRequestUrl: null
}

export function brokerStateReducer(state = initialState, action: fromBroker.BrokerActions): State {
  switch (action.type) {
    case fromBroker.SET_BROKER:
      return {
        ...state,
        activeBroker: action.payload
      }
    case fromBroker.SET_BROKER_FILE_URL:
      return {
        ...state,
        activeBrokerFilesUrl: action.payload
      }
    case fromBroker.SET_BROKER_IMAGE_URL:
      return {
        ...state,
        activeBrokerImageUrl: action.payload
      }
    case fromBroker.SET_BROKER_REQUEST_URL:
      return {
        ...state,
        activeBrokerRequestUrl: action.payload
      }
    default:
      return state;
  }
}
