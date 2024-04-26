export interface IBrokerStateNoToken {
  /** Wird auch als Flag verwendet, ob ich an einem Broker angemeldet bin, oder nicht. */
  activeBrokerName: string | null;
  activeBrokerUrl: string | null;
  activeBrokerDirect: boolean;
  activeBrokerFilesUrl: string | null;
  activeBrokerImageUrl: string | null;
  activeBrokerReportUrl: string | null;
  activeBrokerRequestUrl: string | null;
}

export interface IBrokerState extends IBrokerStateNoToken {
  activeBrokerToken: string;
}

export const initialBrokerState: IBrokerState = {
  activeBrokerName: null,
  activeBrokerToken: String.empty(),
  activeBrokerUrl: null,
  activeBrokerDirect: false,
  activeBrokerFilesUrl: null,
  activeBrokerImageUrl: null,
  activeBrokerReportUrl: null,
  activeBrokerRequestUrl: null
};
