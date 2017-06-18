interface NavigationBarState {
  navigationTitle: string;
  showSearchBox: boolean;
  showLoginUI: boolean;
  showCreateAccountButton: boolean;
  showSettingsDropdown: boolean;
  settingsOptions: any;
  showLoggedInText: boolean;
  loggedInText: string;
}

export const DEFAULT_NAVIGATION_BAR_STATE: NavigationBarState = {
  navigationTitle: 'Ceraon',
  showSearchBox: true,
  showLoginUI: true,
  showCreateAccountButton: true,
  showSettingsDropdown: false,
  settingsOptions: [],
  showLoggedInText: false,
  loggedInText:'',
};

export default NavigationBarState;
