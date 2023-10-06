import { Button } from '@nextui-org/react';
import {
  selectCasesBySet,
  selectCasesBySetMax,
  useCaseStore,
} from '../../../modules/store/caseStore';
import { AlgorithmCase } from './components/algorithmCase/AlgorithmCase';
import { useState } from 'react';

interface Props {
  selectedSubtype: string;
}

export function RightPanel({ selectedSubtype }: Props) {
  const factor = 5;
  const [elements, setElements] = useState(factor);
  const cases = useCaseStore(selectCasesBySetMax(selectedSubtype, elements));

  return (
    <div className="flex flex-col w-3/4 ml-6">
      {cases.map((c, index) => {
        return <AlgorithmCase caseAccount={c} key={index} />;
      })}
      {elements <= cases.length && (
        <Button onClick={() => setElements(elements + factor)}>
          Load more
        </Button>
      )}
    </div>
  );
}
