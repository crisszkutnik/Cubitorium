import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@nextui-org/react';

interface Props {
  className?: string;
}

export function AddSolutionButton({ className = '' }: Props) {
  const onClick = () => {
    alert('Not implemented yet');
  };

  return (
    <Tooltip content="Add a solution to this case">
      <button
        className={
          'flex flex-col items-center hover:text-green-500 ' + className
        }
      >
        <FontAwesomeIcon onClick={onClick} icon={faPlus} />
        <p className="text-black">Add</p>
      </button>
    </Tooltip>
  );
}
