interface NavigationBarState {
  navigationTitle: string;
  showSearchBox: boolean;
  showLoginAndCreateAccountButton: boolean;
  showSettingsDropdown: boolean;
  showLoggedInText: boolean;
  loggedInText: string;
}

export function defaultNavigationBarState(): NavigationBarState {
  return {
    navigationTitle: 'Mealbound',
    showSearchBox: true,
    showLoginAndCreateAccountButton: true,
    showSettingsDropdown: false,
    showLoggedInText: false,
    loggedInText:'',
  };
}

export default NavigationBarState;
