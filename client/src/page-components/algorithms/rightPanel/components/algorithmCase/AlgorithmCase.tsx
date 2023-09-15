import { CaseAccount } from '../../../../../modules/types/case.interface';
import { Info } from './Info';
import { AlgorithmTable } from './table/AlgorithmTable';

interface Props {
  caseAccount: CaseAccount;
}

export function AlgorithmCase({ caseAccount }: Props) {
  return (
    <div className="flex drop-shadow bg-white p-3 mb-6 rounded-md">
      <Info caseData={caseAccount.account} />
      <AlgorithmTable solutions={caseAccount.account.solutions} />
    </div>
  );
}
