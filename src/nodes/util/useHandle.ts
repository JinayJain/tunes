import { useMemo } from "react";

export default function useHandle(nodeId: string, handleName: string) {
  const handleId = useMemo(
    () => `${nodeId}/${handleName}`,
    [nodeId, handleName]
  );

  return handleId;
}
