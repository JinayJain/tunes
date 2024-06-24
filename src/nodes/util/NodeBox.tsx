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
        "border bg-white shadow-md px-4 py-2 rounded-md",
        selected && "border-blue-500"
      )}
    >
      {children}
    </div>
  );
}

export default NodeBox;
