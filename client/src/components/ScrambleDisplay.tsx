interface Props {
  event?: string;
  scramble?: string;
  visualization?: "2D" | "3D";
  className?: string;
  height: string;
  width?: string;
}

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

    return "";
  };

  return (
    <div
      className={`flex ${width || "w-full"}`}
      dangerouslySetInnerHTML={{
        __html: `
          <scramble-display
            style="resize: both"
            class="${height}"
            ${getStr("scramble", scramble)}
            visualization=${visualization || "3D"}
            event=${event}
          >
          </scramble-display>
        `,
      }}
    ></div>
  );
}
