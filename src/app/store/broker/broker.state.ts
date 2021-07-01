export interface IBrokerStateNoToken {
  activeBrokerName: string;
  activeBrokerUrl: string;
  activeBrokerDirect: boolean;
  activeBrokerFilesUrl: string;
  activeBrokerImageUrl: string;
  activeBrokerReportUrl: string;
  activeBrokerRequestUrl: string;
}

export interface IBrokerState extends IBrokerStateNoToken {
  activeBrokerToken: string;
}

export const initialBrokerState: IBrokerState = {
  activeBrokerName: String.empty(),
  activeBrokerToken: String.empty(),
  activeBrokerUrl: String.empty(),
  activeBrokerDirect: false,
  activeBrokerFilesUrl: String.empty(),
  activeBrokerImageUrl: String.empty(),
  activeBrokerReportUrl: String.empty(),
  activeBrokerRequestUrl: String.empty()
};
