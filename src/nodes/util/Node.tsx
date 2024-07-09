import clsx from "clsx";
import React, { createContext, useContext } from "react";
import { Handle, NodeProps } from "reactflow";

type NodeColor = "red" | "yellow" | "blue" | "green";

type NodeContextType = {
  color: NodeColor;
};

const NodeContext = createContext<NodeContextType>({ color: "red" });

function Node({
  color,
  ...props
}: NodeProps & { children?: React.ReactNode; color: NodeColor }) {
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
          "bg-white shadow-md border rounded-xl overflow-clip min-w-32",
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
        "font-mono text-lg px-3 py-1 text-white",
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
    <div className={clsx(`p-3`, bodyAccentColor[color], className)} {...props}>
      {children}
    </div>
  );
}

function NodeHandle({
  className,
  ...props
}: React.ComponentProps<typeof Handle>) {
  const { color } = useContext(NodeContext);

  const handleBackgroundColor: Record<NodeColor, string> = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };

  return (
    <Handle
      className={clsx(className, "w-3 h-3", handleBackgroundColor[color])}
      {...props}
    />
  );
}
Node.Title = NodeTitle;
Node.Body = NodeBody;
Node.Handle = NodeHandle;

export { Node };
