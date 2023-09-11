interface Props {
  text: string;
  type?: "primary" | "secondary" | "tertiary";
  onClick?: () => void;
}

export function Button({ text, onClick, type }: Props) {
  const getClass = () => {
    switch (type) {
      case "primary":
      case undefined:
        return "text-white bg-accent-primary px-2 py-2";

      case "secondary":
        return "text-accent-primary border-2 border-accent-primary hover:text-white hover:bg-accent-primary px-2 py-2";
      
      case "tertiary":
        return "text-accent-dark border-2 border-accent-dark px-1 py-1";
    }
  };

  return (
    <button
      onClick={onClick}
      className={"font-semibold rounded " + getClass()}
    >
      {text}
    </button>
  );
}
