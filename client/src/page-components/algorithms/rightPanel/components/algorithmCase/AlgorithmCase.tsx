import { CaseAccount } from '../../../../../modules/types/case.interface';
import { Info } from './Info';
import { AlgorithmTable } from './table/AlgorithmTable';

interface Props {
  caseAccount: CaseAccount;
}

export function AlgorithmCase({ caseAccount }: Props) {
  return (
    <div className="flex grow drop-shadow bg-white p-2 rounded-md">
      <Info caseData={caseAccount.account} />
      <AlgorithmTable caseAccount={caseAccount} />
    </div>
  );
}
