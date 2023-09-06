interface Props {
  puzzle?: string;
  algorithm?: string;
  size?: string;
}

export function TwistyPlayer({ puzzle, algorithm, size }: Props) {
  return (
    <div
      className={`flex`}
      dangerouslySetInnerHTML={{
        __html: `
          <twisty-player
            style="width: ${size}px;
            height: ${size}px;"
            puzzle="${puzzle}"
            alg="${algorithm}"
            experimental-setup-anchor="end"
            visualization="experimental-2D-LL"
            background="none"
            control-panel="none"
            >
        </twisty-player>
        `,
      }}
    ></div>
  );
}
