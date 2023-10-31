import { useEffect, useState } from 'react';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
  selectLikedSolutionsForCases,
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
import { useLikeStore } from '../../modules/store/likeStore';
import { decompress } from '../../modules/utils/compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Case } from '../../components/like/Case';

export function MyLikes() {
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTypeKey>(
    PuzzleType['3x3'],
  );
  const [useAllSets, setUseAllSets] = useState(false);
  const pageSize = 20;
  const [max, setMax] = useState(pageSize);

  const [cases, casesMap, loadCasesIfNotLoaded, casesLoadingState] =
    useCaseStore((state) => [
      useAllSets
        ? selectCasesByPuzzle(selectedPuzzle)(state)
        : selectCasesBySet(selectedSet)(state),
      state.casesMap,
      state.loadIfNotLoaded,
      state.loadingState,
    ]);

  const [likesMap, loadLikesIfNotLoaded, likesLoadingState] = useLikeStore(
    (state) => [state.likesMap, state.loadIfNotLoaded, state.loadingState],
  );

  const [
    solutions,
    loadSolutionsIfNotLoaded,
    solutionsLoadingState,
    sortSolutionsBySet,
  ] = useSolutionStore(
    (state) => [
      selectLikedSolutionsForCases(likesMap, cases)(state).slice(0, max),
      state.loadIfNotLoaded,
      state.loadingState,
      state.sortSolutionsBySet,
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
            <TableColumn>Date submitted</TableColumn>
            <TableColumn hideHeader>Likes and learning status</TableColumn>
          </TableHeader>
          <TableBody emptyContent="You haven't submitted a solution for this case!">
            {solutions.map(({ publicKey, account }, index) => (
              <TableRow key={index}>
                <TableCell>{decompress(account.moves)}</TableCell>
                <TableCell>
                  {casesMap[account.case.toString()].account.set}
                </TableCell>
                <TableCell>
                  {casesMap[account.case.toString()].account.id}
                </TableCell>
                <TableCell>{account.likes}</TableCell>
                <TableCell>
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
            ))}
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
