interface HomePageState {
  headerMessage: string;
  showMealSearchDropdown: boolean;
}

export const DEFAULT_HOME_PAGE_STATE: HomePageState = {
  headerMessage: 'Find a place to eat nearby',
  showMealSearchDropdown: true
};

export default HomePageState;
