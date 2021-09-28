export interface IRuntimeState {
  title: string;
  disableFormNavigation: boolean;
}

export const initialRuntimeState: IRuntimeState = {
  title: 'HTML Client',
  disableFormNavigation: false
};
