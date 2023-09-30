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
  solutions: SolutionAccount[];
}

export function AllAlgorithmsTable({ solutions }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Solution</TableColumn>
      </TableHeader>
      <TableBody>
        {solutions.map(({ account }, index) => (
          <TableRow key={index}>
            <TableCell>{account.moves}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
