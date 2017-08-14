interface LoadingPageState {
  loadingStatusMessage: string;
}

export function defaultLoadingPageState() : LoadingPageState {
  return {
    loadingStatusMessage: '',
  };
}

export default LoadingPageState;
