import { useLayoutEffect, useState, useEffect } from "react";
import debounce from "lodash/debounce";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", debounce(updateSize, 250));
    // updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return isMobile;
};

export function useEffectOnce(effect) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(effect, []);
}
