import * as fromBrokerActions from './broker.actions';

export interface BrokerState {
  activeBrokerName: string,
  activeBrokerToken: string;
  activeBrokerUrl: string;
  activeBrokerFilesUrl: string;
  activeBrokerImageUrl: string;
  activeBrokerRequestUrl: string;
}

const initialBrokerState: BrokerState = {
  activeBrokerName: null,
  activeBrokerToken: String.empty(),
  activeBrokerUrl: null,
  activeBrokerFilesUrl: null,
  activeBrokerImageUrl: null,
  activeBrokerRequestUrl: null
}

export function brokerStateReducer(state = initialBrokerState, action: fromBrokerActions.BrokerActions): BrokerState {
  switch (action.type) {
    case fromBrokerActions.SET_BROKER_NAME:
      return {
        ...state,
        activeBrokerName: action.payload
      }
    case fromBrokerActions.SET_BROKER_TOKEN:
      return {
        ...state,
        activeBrokerToken: action.payload
      }
    case fromBrokerActions.SET_BROKER_URL:
      return {
        ...state,
        activeBrokerUrl: action.payload
      }
    case fromBrokerActions.SET_BROKER_FILE_URL:
      return {
        ...state,
        activeBrokerFilesUrl: action.payload
      }
    case fromBrokerActions.SET_BROKER_IMAGE_URL:
      return {
        ...state,
        activeBrokerImageUrl: action.payload
      }
    case fromBrokerActions.SET_BROKER_REQUEST_URL:
      return {
        ...state,
        activeBrokerRequestUrl: action.payload
      }
    case fromBrokerActions.RESET_BROKER:
      return initialBrokerState;
    default:
      return state;
  }
}
