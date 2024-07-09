import clsx from "clsx";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  unit?: string;
};

function TextInput(props: TextInputProps) {
  const { unit, className, ...rest } = props;
  return (
    <div className={clsx("relative nodrag text-gray-700", className)}>
      <input
        className={clsx(
          "w-full px-2 py-1 bg-gray-200 rounded-md",
          unit && "pr-10"
        )}
        {...rest}
      />
      {unit && (
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {unit}
        </span>
      )}
    </div>
  );
}

type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement>;

function Dropdown(props: DropdownProps) {
  const { className, ...rest } = props;
  return (
    <select
      className={clsx(
        "rounded-md nodrag border-transparent border-4 bg-gray-200 text-gray-700",
        className
      )}
      {...rest}
    />
  );
}

export { TextInput, Dropdown };
