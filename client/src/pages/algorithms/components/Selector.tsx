export function Selector() {
  const values = [
    "3x3",
    "Roux",
    "2x2",
    "4x4",
    "5x5",
    "6x6",
    "Megaminx",
    "Square-1",
  ];

  const subselectors = [
    "First two layers",
    "Orient last layer",
    "Permute last layer",
    "Advanced methods",
    "Last slot sets",
    "Other",
  ];

  return (
    <div className="flex flex-col">
      <div className="flex">
        {values.map((s, index) => (
          <p
            className={
              "px-3 py-1 rounded-t hover:cursor-pointer font-semibold" +
              (index === 0
                ? " bg-accent-primary text-white"
                : " hover:bg-accent-primary/[0.7] hover:text-white text-accent-primary")
            }
          >
            {s}
          </p>
        ))}
      </div>
      <hr className="bg-accent-primary h-0.5 border-0" />
      <div className="flex my-4">
        {subselectors.map((s, index) => (
          <p
            className={
              "px-3 py-1 rounded mr-3 font-semibold text-base border border-accent-primary cursor-pointer" +
              (index === 0
                ? " bg-accent-primary text-white"
                : "  text-accent-primary hover:bg-accent-primary/[0.7] hover:text-white")
            }
          >
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}
