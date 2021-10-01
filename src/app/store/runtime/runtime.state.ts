export interface IRuntimeState {
  title: string;
  sidebarVisible: boolean;
  disableFormNavigation: boolean;
}

export const initialRuntimeState: IRuntimeState = {
  title: 'HTML Client',
  sidebarVisible: false,
  disableFormNavigation: false
};
