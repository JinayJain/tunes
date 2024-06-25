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
        "border px-4 py-2 bg-gray-50",
        selected && "border-sky-300"
      )}
    >
      {children}
    </div>
  );
}

export default NodeBox;
