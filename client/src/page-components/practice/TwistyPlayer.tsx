interface Props {
  puzzle?: string;
  algorithm?: string;
  size?: string;
}

export function TwistyPlayer({ puzzle, algorithm, size }: Props) {

  const getPuzzle = () => {
    if (!puzzle) {
      return null;
    }

    switch (puzzle) {
      case '2x2':
        return '2x2x2';

      case '3x3':
        return '3x3x3';

      case 'Pyraminx':
        return 'pyraminx';
    }
  };

  return (
    <div
      className={`flex`}
      dangerouslySetInnerHTML={{
        __html: `
          <twisty-player
            style="width: ${size}px;
            height: ${size}px;"
            puzzle="${getPuzzle()}"
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
