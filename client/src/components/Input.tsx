import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  type?: string;
  name: string;
  labelClassName?: string;
  inputClassName?: string;
  register: UseFormRegisterReturn;
}

export function Input({
  label,
  type,
  name,
  labelClassName,
  inputClassName,
  register,
}: Props) {
  const getLabelClass = () => {
    return "flex flex-col" + (labelClassName ? " " + labelClassName : "");
  };

  const getInputClass = () => {
    return "border rounded p-1" + (inputClassName ? " " + inputClassName : "");
  };

  return (
    <label className={getLabelClass()}>
      <p className="font-semibold text-accent-dark">{label}</p>
      <input
        {...register}
        className={getInputClass()}
        type={type || "text"}
        name={name}
      />
    </label>
  );
}
