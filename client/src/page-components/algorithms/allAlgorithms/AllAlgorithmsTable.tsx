import moment from 'moment';
import { Like } from '../../../components/like/Like';
import { SolutionAccount } from '../../../modules/types/solution.interface';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Profile } from '../../../components/like/Profile';
import { decompress } from '../../../modules/utils/compression';

interface Props {
  solutions: SolutionAccount[];
}

export function AllAlgorithmsTable({ solutions }: Props) {
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
            <TableCell>{decompress(account.moves)}</TableCell>
            <TableCell className="w-1/6">{account.likes}</TableCell>
            <TableCell className="w-1/6">
              {moment(account.timestamp).format('DD/MM/YYYY')}
            </TableCell>
            <TableCell className="flex justify-end">
              <Profile author={account.author} />
              <Like
                casePk={account.case}
                solutionAcc={{ publicKey, account }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
