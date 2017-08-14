interface SettingsPageState {
  isUpdating: boolean;
  updatedMessage: string;
}

export function defaultSettingsPageState() : SettingsPageState {
  return {
    isUpdating: false,
    updatedMessage: '',
  };
}

export default SettingsPageState;
