import { useEffect, useState } from 'react';
import {
  selectSetsWithSolutionForAuthor,
  selectSolutionsForAuthorAndCases,
  useSolutionStore,
} from '../../../modules/store/solutionStore';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import moment from 'moment';
import { Like } from '../../../components/like/Like';
import { ThreeLevelSelect } from '../../../components/ThreeLevelSelect';
import {
  selectCasesByPuzzle,
  selectCasesBySet,
  useCaseStore,
} from '../../../modules/store/caseStore';
import {
  PuzzleType,
  PuzzleTypeKey,
} from '../../../modules/store/algorithmsStore';
import { shallow } from 'zustand/shallow';
import { decompress } from '../../../modules/utils/compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Case } from '../../../components/like/Case';
import { ScrambleDisplay2 } from '../../../components/ScrambleDisplay2';

interface Props {
  userPk: string;
}

export function UserSolutions({ userPk }: Props) {
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTypeKey>(
    PuzzleType['3x3'],
  );
  const [useAllSets, setUseAllSets] = useState(false);
  const pageSize = 20;
  const [max, setMax] = useState(pageSize);

  const [cases, casesMap, casesLoadingState] = useCaseStore((state) => [
    useAllSets
      ? selectCasesByPuzzle(selectedPuzzle)(state)
      : selectCasesBySet(selectedSet)(state),
    state.casesMap,
    state.loadingState,
  ]);

  const [solutions, sortSolutionsBySet, setsWithSolution] = useSolutionStore(
    (state) => [
      selectSolutionsForAuthorAndCases(userPk, cases)(state).slice(0, max),
      state.sortSolutionsBySet,
      selectSetsWithSolutionForAuthor(userPk)(state),
    ],
    shallow,
  );

  useEffect(() => {
    sortSolutionsBySet();
  }, [casesLoadingState]);

  return (
    <div className="p-4 w-full flex flex-col">
      <ThreeLevelSelect
        runOnStart
        onSetChange={(newSet: string) => {
          setMax(pageSize);
          setSelectedSet(newSet);
        }}
        onAllSetsChange={() => {
          setMax(pageSize);
          setUseAllSets(!useAllSets);
        }}
        useAllSets={useAllSets}
        selectedPuzzle={selectedPuzzle}
        setSelectedPuzzle={(newPuzzle: PuzzleTypeKey) => {
          setMax(pageSize);
          setSelectedPuzzle(newPuzzle);
        }}
        setsWithSolutions={setsWithSolution}
      />
      <Table
        isStriped
        removeWrapper
        classNames={{
          base: 'mt-6',
          th: 'bg-accent-primary text-white text-lg',
        }}
      >
        <TableHeader>
          <TableColumn>Solution</TableColumn>
          <TableColumn>Set</TableColumn>
          <TableColumn>Case</TableColumn>
          <TableColumn>Likes</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn hideHeader>Likes and learning status</TableColumn>
        </TableHeader>
        <TableBody emptyContent="The user hasn't uploaded a solution yet for the selected case!">
          {solutions.map(({ publicKey, account }, index) => {
            const caseAcc = casesMap[account.case.toString()];

            return (
              <TableRow key={index}>
                <TableCell>{decompress(account.moves)}</TableCell>
                <TableCell className="w-20">{caseAcc.account.set}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <p className="pr-2 w-20">{caseAcc.account.id}</p>
                    <ScrambleDisplay2
                      set={caseAcc.account.set}
                      scramble={decompress(caseAcc.account.setup)}
                      height="h-12"
                      width="w-12"
                    ></ScrambleDisplay2>
                  </div>
                </TableCell>
                <TableCell className="text-center">{account.likes}</TableCell>
                <TableCell className="text-center">
                  {moment(account.timestamp).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell className="w-1/6">
                  <div className="flex items-center justify-center">
                    <Case caseAcc={casesMap[account.case.toString()]} />
                    <Like
                      casePk={account.case}
                      solutionAcc={{ publicKey, account }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {solutions.length === max && (
        <div className="flex justify-center">
          <Button
            onClick={() => setMax(max + pageSize)}
            variant="ghost"
            color="primary"
            className="w-40 mt-4 font-bold"
            radius="sm"
          >
            <FontAwesomeIcon icon={faPlus} />
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
