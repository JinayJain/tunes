import useStore, { RFState } from "../../store";
import { useEffect, useMemo } from "react";
import { Connectable } from "./connection";

function useHandle(
  nodeId: string,
  handleName: string,
  connectable: Connectable
) {
  const handleId = useMemo(
    () => `${nodeId}-${handleName}`,
    [nodeId, handleName]
  );

  const { register, unregister } = useStore((state: RFState) => ({
    register: state.register,
    unregister: state.unregister,
  }));

  useEffect(() => {
    register(handleId, connectable);

    return () => {
      unregister(handleId);
    };
  }, [connectable, handleId, register, unregister]);

  return handleId;
}

export function useHandles(nodeId: string, handles: Array<Connectable>) {
  const { register, unregister } = useStore((state: RFState) => ({
    register: state.register,
    unregister: state.unregister,
  }));

  useEffect(() => {
    handles.forEach((connectable, index) => {
      const handleId = `${nodeId}-${index}`;
      register(handleId, connectable);
    });

    return () => {
      handles.forEach((_, index) => {
        const handleId = `${nodeId}-${index}`;
        unregister(handleId);
      });
    };
  }, [handles, nodeId, register, unregister]);

  const handleIds = useMemo(
    () => handles.map((_, index) => `${nodeId}-${index}`),
    [handles, nodeId]
  );

  return handleIds;
}

export default useHandle;
