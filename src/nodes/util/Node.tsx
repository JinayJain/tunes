import clsx from "clsx";

function NodeBox({
  selected,
  children,
}: {
  selected: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "border shadow-md bg-white rounded-md overflow-clip border-gray-200",
        selected && "border-gray-800"
      )}
    >
      {children}
    </div>
  );
}

function NodeTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="px-2 py-1 bg-stone-800 text-white">{children}</h1>;
}

function NodeBody({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>;
}

export { NodeBox, NodeTitle, NodeBody };
