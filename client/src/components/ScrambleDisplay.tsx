export type EventsTypes =
  | '2x2'
  | '3x3'
  | '4x4'
  | '5x5'
  | '6x6'
  | '7x7'
  | 'Pyraminx';

interface Props {
  event?: EventsTypes;
  scramble?: string;
  visualization?: '2D' | '3D';
  className?: string;
  height: string;
  width?: string;
}

/**
 * @deprecated
 */
export function ScrambleDisplay({
  event,
  scramble,
  visualization,
  height,
  width,
}: Props) {
  const getStr = (propertyName: string, value: string | undefined) => {
    if (propertyName !== undefined) {
      return `${propertyName}="${value}"`;
    }

    return '';
  };

  const getEvent = () => {
    if (!event) {
      return null;
    }

    switch (event) {
      case '2x2':
        return '222';

      case '3x3':
        return '333';

      case '4x4':
        return '444';

      case '5x5':
        return '555';

      case '6x6':
        return '666';

      case '7x7':
        return '777';

      case 'Pyraminx':
        return 'pyram';
    }
  };

  return (
    <div
      className={`flex ${width || 'w-full'}`}
      dangerouslySetInnerHTML={{
        __html: `
          <scramble-display
            style="resize: both"
            class="${height}"
            ${getStr('scramble', scramble)}
            visualization=${visualization || '3D'}
            event=${getEvent()}
          >
          </scramble-display>
        `,
      }}
    ></div>
  );
}
