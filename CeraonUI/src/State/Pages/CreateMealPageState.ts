import Tag from '../Meal/Tag';


interface CreateMealPageState {
  isUserUpdateLoading: boolean;
  showAddLocationPrompt: boolean;
  isCreateLoading: boolean;
  mealTagOptions: Tag[];
}

export function defaultCreateMealPageState() : CreateMealPageState {
  return {
    isUserUpdateLoading: false,
    showAddLocationPrompt: true,
    isCreateLoading: false,
    mealTagOptions: [],
  };
}

export default CreateMealPageState;
