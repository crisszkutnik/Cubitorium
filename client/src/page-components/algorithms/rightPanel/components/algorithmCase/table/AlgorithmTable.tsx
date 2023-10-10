import { Link } from 'react-router-dom';
import { ButtonWrapper } from '../../../../../../components/ButtonWrapper';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import {
  selectSolutionsByCase,
  useSolutionStore,
} from '../../../../../../modules/store/solutionStore';
import { Like } from '../../../../../../components/like/Like';
import { AddSolutionButton } from '../../../../../../components/AddSolutionButton';
import { CaseAccount } from '../../../../../../modules/types/case.interface';

interface Props {
  caseAccount: CaseAccount;
}

export function AlgorithmTable({ caseAccount }: Props) {
  const solutions = useSolutionStore(
    selectSolutionsByCase(caseAccount.publicKey),
  );

  const getRows = () => {
    if (solutions.length === 0) {
      return [];
    }

    const rows = solutions.slice(0, 4).map((s, index) => (
      <TableRow key={index}>
        <TableCell className="p2 text-lg w-6/12">{s.account.moves}</TableCell>
        <TableCell className="p2 text-lg w-2/12">
          {s.account.likes + ' ' + (s.account.likes === 1 ? 'like' : 'likes')}
        </TableCell>
        <TableCell className="flex">
          <Like
            casePk={caseAccount.publicKey}
            solutionPk={s.publicKey}
            solution={s.account.moves}
          />
        </TableCell>
      </TableRow>
    ));

    while (rows.length < 4) {
      rows.push(
        <TableRow key={rows.length}>
          <TableCell className="p2 text-lg">
            <p className="invisible">''</p>
          </TableCell>
          <TableCell className="p2 text-lg">
            <p className="invisible">''</p>
          </TableCell>
          <TableCell className="p2 text-lg">
            <p className="invisible">''</p>
          </TableCell>
        </TableRow>,
      );
    }

    return rows;
  };

  return (
    <div className="w-9/12 flex flex-col">
      <Table
        className="bg-accent-primary/10 rounded"
        removeWrapper
        classNames={{ th: 'bg-accent-primary text-white text-lg' }}
      >
        <TableHeader>
          <TableColumn>Solution</TableColumn>
          <TableColumn>Likes</TableColumn>
          <TableColumn hideHeader>Like button</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No one has uploaded a solution for this case yet. Be the first!">
          {getRows()}
        </TableBody>
      </Table>
      {solutions.length > 0 && (
        <div className="flex justify-center items-center h-full mt-3">
          <AddSolutionButton caseAccount={caseAccount} className="mr-6" />
          <Link to="/algorithms/all">
            <ButtonWrapper variant="ghost" text="+ More algorithms" />
          </Link>
        </div>
      )}
    </div>
  );
}
