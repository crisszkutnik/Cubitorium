import { Button } from '@nextui-org/react';

interface Props {
  text: string;
  variant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost'
    | undefined;
  onClick?: () => void;
}

export function ButtonWrapper({ text, onClick, variant }: Props) {
  return (
    <Button
      color="primary"
      variant={variant}
      className={
        variant === 'ghost' ? 'text-accent-primary font-semibold' : 'text-white'
      }
      onClick={onClick}
      radius="sm"
    >
      {text}
    </Button>
  );
}
