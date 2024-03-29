import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Tooltip } from '@nextui-org/react';
import { CaseAccount } from '../../modules/types/case.interface';

interface Props {
  caseAcc: CaseAccount;
}

export function Case({ caseAcc }: Props) {
  return (
    <div className="mr-4">
      <Tooltip content="Go to the case page">
        <Link
          className="flex flex-col items-center justify-center whitespace-nowrap"
          to={`/algorithms/all?case=${caseAcc.account.id}&set=${caseAcc.account.set}`}
        >
          <FontAwesomeIcon icon={faCube} />
          <p>Go to case</p>
        </Link>
      </Tooltip>
    </div>
  );
}
