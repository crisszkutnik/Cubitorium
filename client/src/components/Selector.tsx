interface Props {
  selectors: string[];
  subselectors?: { [key: string]: string[] };
  selectedSelector: string;
  selectedSubselector: string;
  onSelectorChange: (newValue: string) => void;
  onSubselectorChange?: (newValue: string) => void;
}

export function Selector({
  selectors,
  subselectors,
  selectedSelector,
  selectedSubselector,
  onSelectorChange,
  onSubselectorChange,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex">
        {selectors.map((s, index) => (
          <button
            onClick={() => onSelectorChange(s)}
            key={index}
            className={
              'px-3 py-1 rounded-t hover:cursor-pointer font-semibold' +
              (s === selectedSelector
                ? ' bg-accent-primary text-white'
                : ' hover:bg-accent-primary/[0.7] hover:text-white text-accent-primary')
            }
          >
            {s}
          </button>
        ))}
      </div>
      <hr className="bg-accent-primary h-0.5 border-0" />
      {subselectors && (
        <div className="flex my-4">
          {subselectors[selectedSelector]?.map((s, index) => (
            <button
              onClick={() => onSubselectorChange && onSubselectorChange(s)}
              key={index}
              className={
                'px-3 py-1 rounded mr-3 font-semibold text-base border border-accent-primary cursor-pointer' +
                (s == selectedSubselector
                  ? ' bg-accent-primary text-white'
                  : '  text-accent-primary hover:bg-accent-primary/[0.7] hover:text-white')
              }
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
