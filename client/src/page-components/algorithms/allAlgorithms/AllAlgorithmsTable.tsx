import moment from 'moment';
import { Like } from '../../../components/like/Like';
import { CaseAccount } from '../../../modules/types/case.interface';
import { SolutionAccount } from '../../../modules/types/solution.interface';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';

interface Props {
  selectedCase: CaseAccount;
  solutions: SolutionAccount[];
}

export function AllAlgorithmsTable({ solutions, selectedCase }: Props) {
  return (
    <Table
      isStriped
      classNames={{
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
                casePk={selectedCase.publicKey}
                solution={account.moves}
                solutionPk={publicKey}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
