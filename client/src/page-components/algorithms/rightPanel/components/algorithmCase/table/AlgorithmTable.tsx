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

interface Props {
  solutions: string[];
}

export function AlgorithmTable({ solutions }: Props) {
  const getRows = () => {
    if (solutions.length === 0) {
      return [];
    }

    const rows = solutions.slice(0, 4).map((s, index) => (
      <TableRow key={index}>
        <TableCell className="p2 text-lg">{s}</TableCell>
      </TableRow>
    ));

    while (rows.length < 4) {
      rows.push(
        <TableRow key={rows.length}>
          <TableCell className="p2 text-lg">U R U’ R’</TableCell>
        </TableRow>,
      );
    }

    return rows;
  };

  return (
    <div className="w-4/5 flex flex-col">
      <Table className="bg-accent-primary/10" hideHeader removeWrapper>
        <TableHeader>
          <TableColumn>asd</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No one has uploaded a solution for this case yet. Be the first!">
          {getRows()}
        </TableBody>
      </Table>
      {solutions.length > 0 && (
        <div className="flex justify-center items-center h-full mt-3">
          <Link to="/algorithms/all">
            <ButtonWrapper variant="ghost" text="+ More algorithms" />
          </Link>
        </div>
      )}
    </div>
  );
}
