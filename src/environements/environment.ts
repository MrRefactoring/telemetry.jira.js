const getPlatform = () => {
  try {
    if (window) {
      return 'browser';
    }
  } catch {
    // ignore
  }

  try {
    if (global) {
      return 'node';
    }
  } catch {
    // ignore
  }

  return undefined;
};

export namespace Environment {
  export const platform = getPlatform();
}
