import { ChangeEventHandler } from "react";

interface Props {
  type: "primary" | "secondary" | "tertiary";
  values: string[];
  title?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
}

export function Select({ type, values, title, className, onChange }: Props) {
  const getClass = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-accent-primary text-white font-semibold";

      case "secondary":
        return "border-2 border-accent-primary text-accent-primary font-semibold";

      case "tertiary":
        return "border border-gray-300";
    }
  };

  return (
    <div className={"flex flex-col" + (className ? " " + className : "")}>
      {title && <p className="text-accent-dark font-semibold"> {title}</p>}
      <select
        onChange={onChange}
        className={"px-2 py-2 rounded " + getClass(type)}
      >
        {values.map((value, index) => (
          <option key={index}>{value}</option>
        ))}
      </select>
    </div>
  );
}
