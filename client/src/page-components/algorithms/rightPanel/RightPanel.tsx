import {
  selectCasesBySetMax,
  useCaseStore,
} from '../../../modules/store/caseStore';
import { AlgorithmCase } from './components/algorithmCase/AlgorithmCase';
import { useState } from 'react';
import { ButtonWrapper } from '../../../components/ButtonWrapper';

interface Props {
  selectedSubtype: string;
}

export function RightPanel({ selectedSubtype }: Props) {
  const factor = 5;
  const [elements, setElements] = useState(factor);
  const cases = useCaseStore(selectCasesBySetMax(selectedSubtype, elements));

  return (
    <div className="flex flex-col w-3/4 ml-6 mb-4">
      {cases.map((c, index) => {
        return <AlgorithmCase caseAccount={c} key={index} />;
      })}
      {elements <= cases.length && (
        <ButtonWrapper
          onClick={() => setElements(elements + factor)}
          text="Load more"
          variant="ghost"
        />
      )}
    </div>
  );
}
