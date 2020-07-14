import * as fromBrokerActions from 'app/store/broker.actions';

export interface IBrokerState {
  activeBrokerName: string;
  activeBrokerToken: string;
  activeBrokerUrl: string;
  activeBrokerDirect: boolean;
  activeBrokerFilesUrl: string;
  activeBrokerImageUrl: string;
  activeBrokerRequestUrl: string;
}

const initialBrokerState: IBrokerState = {
  activeBrokerName: null,
  activeBrokerToken: String.empty(),
  activeBrokerUrl: null,
  activeBrokerDirect: null,
  activeBrokerFilesUrl: null,
  activeBrokerImageUrl: null,
  activeBrokerRequestUrl: null
};

export function brokerStateReducer(state: IBrokerState = initialBrokerState, action: fromBrokerActions.BrokerActions): IBrokerState {
  switch (action.type) {
    case fromBrokerActions.SET_BROKER_NAME:
      return {
        ...state,
        activeBrokerName: action.payload
      };
    case fromBrokerActions.SET_BROKER_TOKEN:
      return {
        ...state,
        activeBrokerToken: action.payload
      };
    case fromBrokerActions.SET_BROKER_URL:
      return {
        ...state,
        activeBrokerUrl: action.payload
      };
    case fromBrokerActions.SET_BROKER_DIRECT:
      return {
        ...state,
        activeBrokerDirect: action.payload
      };
    case fromBrokerActions.SET_BROKER_FILE_URL:
      return {
        ...state,
        activeBrokerFilesUrl: action.payload
      };
    case fromBrokerActions.SET_BROKER_IMAGE_URL:
      return {
        ...state,
        activeBrokerImageUrl: action.payload
      };
    case fromBrokerActions.SET_BROKER_REQUEST_URL:
      return {
        ...state,
        activeBrokerRequestUrl: action.payload
      };
    case fromBrokerActions.RESET_BROKER:
      return initialBrokerState;
    default:
      return state;
  }
}
