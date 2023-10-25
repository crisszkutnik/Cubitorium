import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { CaseAccount } from '../modules/types/case.interface';
import { useUserStore } from '../modules/store/userStore';

interface Props {
  className?: string;
  caseAccount: CaseAccount;
}

export function AddSolutionButton({ className = '', caseAccount }: Props) {
  const navigate = useNavigate();
  const isLogged = useUserStore((store) => store.isLogged);

  const onClick = () => {
    navigate(
      `/algorithms/upload?set=${caseAccount.account.set}&case=${caseAccount.account.id}`,
    );
  };

  if (!isLogged) {
    return <></>;
  }

  return (
    <Tooltip content="Add a solution to this case">
      <button
        className={
          'flex flex-col items-center hover:text-green-500 ' + className
        }
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faPlus} />
        <p className="text-black">Add</p>
      </button>
    </Tooltip>
  );
}
