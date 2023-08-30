interface Props {
  label?: string;
  type?: "primary" | "secondary";
}

export function Submit({ label, type }: Props) {
  const getClass = () => {
    switch (type) {
      case "primary":
      case undefined:
        return "text-white bg-accent-primary";

      case "secondary":
        return "text-accent-primary border border-2 border-accent-primary hover:text-white hover:bg-accent-primary";
    }
  };

  return (
    <input
      className={"px-3 py-2 rounded cursor-pointer " + getClass()}
      type="submit"
      value={label || "Submit"}
    />
  );
}
