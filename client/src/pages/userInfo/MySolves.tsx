import { useEffect, useState } from 'react';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
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

  const [solutions, loadSolutionsIfNotLoaded, solutionsLoadingState] =
    useSolutionStore(
      (state) => [
        selectSolutionsForAuthorAndCases(
          loggedUserPk || '',
          cases,
        )(state).slice(0, max),
        state.loadIfNotLoaded,
        state.loadingState,
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
            <TableColumn>Likes</TableColumn>
            <TableColumn>Date submitted</TableColumn>
            <TableColumn hideHeader>Likes and learning status</TableColumn>
          </TableHeader>
          <TableBody emptyContent="You haven't submitted a solution for this case!">
            {solutions.map(({ publicKey, account }, index) => (
              <TableRow key={index}>
                <TableCell>{decompress(account.moves)}</TableCell>
                <TableCell className="w-1/6">
                  {casesMap[account.case.toString()].account.set}
                </TableCell>
                <TableCell className="w-1/6">{account.likes}</TableCell>
                <TableCell className="w-1/6">
                  {moment(account.timestamp).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell className="w-1/6">
                  <Like
                    casePk={account.case}
                    solution={decompress(account.moves)}
                    solutionPk={publicKey}
                  />
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
