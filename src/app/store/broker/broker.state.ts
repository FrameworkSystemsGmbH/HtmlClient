export interface IBrokerState {
  activeBrokerName?: string;
  activeBrokerToken?: string;
  activeBrokerUrl?: string;
  activeBrokerDirect?: boolean;
  activeBrokerFilesUrl?: string;
  activeBrokerImageUrl?: string;
  activeBrokerRequestUrl?: string;
}

export const initialBrokerState: IBrokerState = {
  activeBrokerName: null,
  activeBrokerToken: String.empty(),
  activeBrokerUrl: null,
  activeBrokerDirect: null,
  activeBrokerFilesUrl: null,
  activeBrokerImageUrl: null,
  activeBrokerRequestUrl: null
};
