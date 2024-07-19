import clsx from "clsx";
import React, { createContext, useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";

type NodeColor = "red" | "yellow" | "blue" | "green";

type NodeContextType = {
  color: NodeColor;
};

const NodeContext = createContext<NodeContextType>({ color: "red" });

type NodeComponentProps = NodeProps & {
  children?: React.ReactNode;
  color: NodeColor;
  compact?: boolean;
};

function Node({ color, ...props }: NodeComponentProps) {
  const { children, selected } = props;

  const selectedColor: Record<NodeColor, string> = {
    red: "border-red-500",
    yellow: "border-yellow-500",
    blue: "border-blue-500",
    green: "border-green-500",
  };

  return (
    <NodeContext.Provider value={{ color }}>
      <div
        className={clsx(
          "bg-white shadow-md border rounded-xl",
          !props.compact && "min-w-32",
          selected && selectedColor[color]
        )}
      >
        {children}
      </div>
    </NodeContext.Provider>
  );
}

function NodeTitle({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  const { color } = useContext(NodeContext);

  const titleBackgroundColor: Record<NodeColor, string> = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };

  return (
    <h1
      className={clsx(
        "font-mono text-lg px-3 py-1 text-white rounded-t-xl",
        titleBackgroundColor[color],
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

function NodeBody({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { color } = useContext(NodeContext);

  const bodyAccentColor: Record<NodeColor, string> = {
    red: "accent-red-500",
    yellow: "accent-yellow-500",
    blue: "accent-blue-500",
    green: "accent-green-500",
  };

  return (
    <div className={clsx("p-4", bodyAccentColor[color], className)} {...props}>
      {children}
    </div>
  );
}

type NodeHandleProps = React.ComponentProps<typeof Handle>;

function NodeHandle({ className, ...props }: NodeHandleProps) {
  const { color } = useContext(NodeContext);
  const { position } = props;

  const handleBackgroundColor: Record<NodeColor, string> = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };

  return (
    <Handle
      style={{
        left: position === Position.Left ? "-1rem" : "auto",
        right: position === Position.Right ? "-1rem" : "auto",
        top: "50%",
        bottom: "auto",
      }}
      className={clsx(
        className,
        "w-3 h-3 transform -translate-y-1/2",
        position === Position.Left ? "-translate-x-1/2" : "translate-x-1/2",
        handleBackgroundColor[color]
      )}
      {...props}
    />
  );
}
Node.Title = NodeTitle;
Node.Body = NodeBody;
Node.Handle = NodeHandle;

export { Node };
