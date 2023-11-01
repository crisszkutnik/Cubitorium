import { useEffect, useState } from 'react';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
  selectSetsWithSolutionForAuthor,
  selectSolutionsForAuthorAndCases,
  useSolutionStore,
} from '../../modules/store/solutionStore';
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';
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
import { Like } from '../../components/like/Like';
import { ThreeLevelSelect } from '../../components/ThreeLevelSelect';
import {
  selectCasesByPuzzle,
  selectCasesBySet,
  useCaseStore,
} from '../../modules/store/caseStore';
import {
  PuzzleType,
  PuzzleTypeKey,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { shallow } from 'zustand/shallow';
import { useUserStore } from '../../modules/store/userStore';
import { useLikeStore } from '../../modules/store/likeStore';
import { decompress } from '../../modules/utils/compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Case } from '../../components/like/Case';
import { ScrambleDisplay2 } from '../../components/ScrambleDisplay2';

export function MySolves() {
  const [selectedSet, setSelectedSet] = useState('');
  const [useAllSets, setUseAllSets] = useState(false);
  const loggedUserPk = useUserStore((state) => state.loggedUserPk);
  const pageSize = 20;
  const [max, setMax] = useState(pageSize);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTypeKey>(
    PuzzleType['3x3'],
  );

  const [cases, casesMap, loadCasesIfNotLoaded, casesLoadingState] =
    useCaseStore(
      (state) => [
        useAllSets
          ? selectCasesByPuzzle(selectedPuzzle)(state)
          : selectCasesBySet(selectedSet)(state),
        state.casesMap,
        state.loadIfNotLoaded,
        state.loadingState,
      ],
      shallow,
    );

  const [loadLikesIfNotLoaded, likesLoadingState] = useLikeStore((state) => [
    state.loadIfNotLoaded,
    state.loadingState,
  ]);

  const [
    solutions,
    loadSolutionsIfNotLoaded,
    solutionsLoadingState,
    sortSolutionsBySet,
    setsWithSolution,
  ] = useSolutionStore(
    (state) => [
      selectSolutionsForAuthorAndCases(
        loggedUserPk || '',
        cases,
      )(state).slice(0, max),
      state.loadIfNotLoaded,
      state.loadingState,
      state.sortSolutionsBySet,
      selectSetsWithSolutionForAuthor(loggedUserPk || '')(state),
    ],
    shallow,
  );

  const [loadSetsIfNotLoaded, setsLoadingState] = useAlgorithmsStore(
    (state) => [state.loadIfNotLoaded, state.loadingState],
  );

  useEffect(() => {
    loadSolutionsIfNotLoaded();
    loadCasesIfNotLoaded();
    loadSetsIfNotLoaded();
    loadLikesIfNotLoaded();
  }, []);

  useEffect(() => {
    sortSolutionsBySet();
  }, [casesLoadingState]);

  const hasAllRequiredData = () => {
    return (
      solutionsLoadingState === LoadingState.LOADED &&
      casesLoadingState === LoadingState.LOADED &&
      setsLoadingState === LoadingState.LOADED &&
      likesLoadingState === LoadingState.LOADED
    );
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  return (
    <UserInfoLayout>
      <div className="flex flex-col bg-white drop-shadow p-5 rounded w-full h-fit">
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
          <TableBody emptyContent="You haven't submitted a solution for this case!">
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

                  <TableCell>
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
    </UserInfoLayout>
  );
}
