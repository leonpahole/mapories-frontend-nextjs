import { useState } from "react";

export const useDebounce = ({
  defaultTimeout = 250,
  defaultIdentifier = "default",
} = {}) => {
  const [identifiers, setIdentifiers] = useState<Record<string, number | null>>(
    {
      [defaultIdentifier]: null,
    }
  );

  return (fn: () => void, identifier: string, timeout: number) => {
    if (
      identifiers.hasOwnProperty(identifier) &&
      identifiers[identifier] != null
    ) {
      clearTimeout(identifiers[identifier]!);
    }

    setIdentifiers({ ...identifiers, [identifier]: setTimeout(fn, timeout) });
  };
};

export default useDebounce;
