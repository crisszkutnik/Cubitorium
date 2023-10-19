import {
  selectCasesByTermAndSetMax,
  useCaseStore,
} from '../../../modules/store/caseStore';
import { AlgorithmCase } from './components/algorithmCase/AlgorithmCase';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
  selectedSubtype: string;
  filterTerm?: string;
}

export function RightPanel({ selectedSubtype, filterTerm }: Props) {
  const factor = 5;
  const [elements, setElements] = useState(factor);
  const cases = useCaseStore(
    selectCasesByTermAndSetMax(selectedSubtype, elements, filterTerm),
  );

  return (
    <div className="flex flex-col w-full mb-4 items-center">
      <div className="flex w-full flex-wrap justify-between gap-4">
        {cases.map((c, index) => {
          return <AlgorithmCase caseAccount={c} key={index} />;
        })}
      </div>

      {elements <= cases.length && (
        <Button
          onClick={() => setElements(elements + factor)}
          variant="ghost"
          color="primary"
          className="w-40 my-10 font-bold"
          radius="sm"
        >
          <FontAwesomeIcon icon={faPlus} />
          Load more
        </Button>
      )}
    </div>
  );
}
