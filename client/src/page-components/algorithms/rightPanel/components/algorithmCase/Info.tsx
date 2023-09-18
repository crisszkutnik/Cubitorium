import { ScrambleDisplay } from '../../../../../components/ScrambleDisplay';
import { Case } from '../../../../../modules/types/case.interface';

interface Props {
  caseData: Case;
}

export function Info({ caseData }: Props) {
  return (
    <div className="w-1/5 flex flex-col items-center text-center">
      <ScrambleDisplay scramble={caseData.setup} height="h-36" />
      <div>
        <h1 className="font-semibold text-accent-dark text-3xl">
          {caseData.id}
        </h1>
      </div>
      <div className="mt-3">
        <h2 className="font-semibold text-accent-dark text-xl">Setup</h2>
        <p>{caseData.setup}</p>
      </div>
    </div>
  );
}
