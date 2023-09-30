import { useEffect, useState } from 'react';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
  selectSolutionsForCase,
  useSolutionStore,
} from '../../modules/store/solutionStore';
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';
import {
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
  selectCaseBySetAndId,
  useCaseStore,
} from '../../modules/store/caseStore';
import { useAlgorithmsStore } from '../../modules/store/algorithmsStore';
import { shallow } from 'zustand/shallow';

export function MySolves() {
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedCase, setSelectedCase] = useState('');

  const [caseAccount, loadCasesIfNotLoaded, casesLoadingState] = useCaseStore(
    (state) => [
      selectCaseBySetAndId(selectedSet, selectedCase)(state),
      state.loadIfNotLoaded,
      state.loadingState,
    ],
  );

  const [solutions, loadSolutionsIfNotLoaded, solutionsLoadingState] =
    useSolutionStore(
      (state) => [
        selectSolutionsForCase(caseAccount?.publicKey || '')(state),
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
  }, []);

  const hasAllRequiredData = () => {
    return (
      solutionsLoadingState === LoadingState.LOADED &&
      casesLoadingState === LoadingState.LOADED &&
      setsLoadingState === LoadingState.LOADED
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
          onSetChange={setSelectedSet}
          onCaseChange={setSelectedCase}
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
            <TableColumn>Likes</TableColumn>
            <TableColumn>Date submitted</TableColumn>
            <TableColumn hideHeader>Likes and learning status</TableColumn>
          </TableHeader>
          <TableBody>
            {solutions.map(({ publicKey, account }, index) => (
              <TableRow key={index}>
                <TableCell>{account.moves}</TableCell>
                <TableCell className="w-1/6">{account.likes}</TableCell>
                <TableCell className="w-1/6">
                  {moment(account.timestamp).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell className="w-1/6">
                  <Like
                    casePk={account.case}
                    solution={account.moves}
                    solutionPk={publicKey}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </UserInfoLayout>
  );
}
