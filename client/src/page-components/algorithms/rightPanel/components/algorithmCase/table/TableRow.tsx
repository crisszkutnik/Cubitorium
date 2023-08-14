interface Props {
  solution: string;
}

export function TableRow({ solution }: Props) {
  return (
    <div className="bg-accent-primary/10 p-2">
      <p className="text-lg">{solution}</p>
    </div>
  );
}
