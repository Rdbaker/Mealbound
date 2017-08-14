interface CreateMealPageState {
  isUserUpdateLoading: boolean;
  showAddLocationPrompt: boolean;
  isCreateLoading: boolean;
}

export function defaultCreateMealPageState() : CreateMealPageState {
  return {
    isUserUpdateLoading: false,
    showAddLocationPrompt: true,
    isCreateLoading: false,
  };
}

export default CreateMealPageState;
