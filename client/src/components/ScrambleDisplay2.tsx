import { getPuzzleType } from '../modules/store/algorithmsStore';

interface Props {
  set: string;
  scramble?: string;
  className?: string;
  height: string;
  width?: string;
}

export function ScrambleDisplay2({ set, scramble, height, width }: Props) {
  const getStr = (propertyName: string, value: string | undefined) => {
    if (propertyName !== undefined) {
      return `${propertyName}="${value}"`;
    }

    return '';
  };

  const getRepresentationForCase = () => {
    const puzzleType = getPuzzleType(set);

    if (puzzleType === '2x2') {
      return {
        puzzle: '2x2x2',
        visualization: '2D',
      };
    } else if (puzzleType === 'Pyraminx') {
      return {
        puzzle: 'pyraminx',
        visualization: '2D',
      };
    }

    if (set.includes('ZBLL') || set === 'PLL') {
      return {
        visualization: 'experimental-2D-LL',
        puzzle: '3x3x3',
      };
    }

    switch (set) {
      case 'F2L':
        return {
          'experimental-stickering': 'F2L',
          visualization: '3D',
          puzzle: '3x3x3',
        };

      case 'OLL':
        return {
          'experimental-stickering': 'OLL',
          visualization: 'experimental-2D-LL',
          puzzle: '3x3x3',
        };

      case 'CMLL':
        return {
          'experimental-stickering': 'CMLL',
          visualization: 'experimental-2D-LL',
          puzzle: '3x3x3',
        };
    }
  };

  const repr = getRepresentationForCase();

  return (
    <div
      className={`flex ${width ?? 'w-full'}`}
      dangerouslySetInnerHTML={{
        __html: `
          <twisty-player
            style="resize: both"
            class="${height}"
            ${getStr('alg', scramble)}
            puzzle="${repr?.puzzle}"
            background="none"
            control-panel="none"
            ${
              repr?.['experimental-stickering']
                ? 'experimental-stickering=' + repr['experimental-stickering']
                : ''
            }
            visualization="${repr?.visualization}"
          >
          </twisty-player>
        `,
      }}
    ></div>
  );
}
