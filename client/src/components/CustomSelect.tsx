import { Select, SelectItem } from '@nextui-org/react';
import { ChangeEventHandler } from 'react';

interface Props {
  values: string[];
  title?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  defaultValue?: string;
}

export function CustomSelect({ values, title, onChange, defaultValue }: Props) {
  return (
    <Select
      defaultSelectedKeys={[defaultValue || '']}
      label={title}
      color="primary"
      onChange={onChange}
    >
      {values.map((value) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      ))}
    </Select>
  );
}
