let isBrowserEnvironment: boolean;

export const isBrowser = () => {
  if (isBrowserEnvironment !== undefined) {
    return isBrowserEnvironment;
  }

  try {
    isBrowserEnvironment = this === window;
  } catch {
    isBrowserEnvironment = false;
  }

  return isBrowserEnvironment;
};
