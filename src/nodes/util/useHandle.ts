import { useMemo } from "react";

export default function useHandle(nodeId: string, handleName: string) {
  const handleId = useMemo(
    () => `${nodeId}/${handleName}`,
    [nodeId, handleName]
  );

  return handleId;
}

export const useHandles = (nodeId: string, handleNames: string[]) => {
  const handleIds = useMemo(
    () => handleNames.map((handleName) => `${nodeId}/${handleName}`),
    [nodeId, handleNames]
  );

  return handleIds;
};
