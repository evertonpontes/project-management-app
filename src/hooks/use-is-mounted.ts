import { useRef, useEffect, useCallback } from "react";

interface UseIsMountedProps {
  initialValue: boolean;
}

const useIsMounted = ({ initialValue = false }: UseIsMountedProps) => {
  const isMounted = useRef(initialValue);
  const getIsMounted = useCallback(() => isMounted.current, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return getIsMounted;
};

export { useIsMounted };
