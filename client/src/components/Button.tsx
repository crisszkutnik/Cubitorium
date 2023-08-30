interface Props {
  text: string;
  type?: "primary" | "secondary";
  onClick?: () => void;
}

export function Button({ text, onClick, type }: Props) {
  const getClass = () => {
    switch (type) {
      case "primary":
      case undefined:
        return "text-white bg-accent-primary";

      case "secondary":
        return "text-accent-primary border-2 border-accent-primary hover:text-white hover:bg-accent-primary";
    }
  };

  return (
    <button
      onClick={onClick}
      className={"font-semibold px-2 py-2 rounded " + getClass()}
    >
      {text}
    </button>
  );
}
