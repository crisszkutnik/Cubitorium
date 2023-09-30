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
import { PublicKey } from '@solana/web3.js';
import {
  selectSolutionsForCase,
  useSolutionStore,
} from '../../../../../../modules/store/solutionStore';
import { Like } from '../../../../../../components/like/Like';

interface Props {
  casePk: PublicKey;
}

export function AlgorithmTable({ casePk }: Props) {
  const solutions = useSolutionStore(selectSolutionsForCase(casePk));

  const getRows = () => {
    if (solutions.length === 0) {
      return [];
    }

    const rows = solutions.slice(0, 4).map((s, index) => (
      <TableRow key={index}>
        <TableCell className="p2 text-lg w-4/6">{s.account.moves}</TableCell>
        <TableCell className="flex">
          <Like
            casePk={casePk}
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
        </TableRow>,
      );
    }

    return rows;
  };

  return (
    <div className="w-4/5 flex flex-col">
      <Table className="bg-accent-primary/10 rounded" hideHeader removeWrapper>
        <TableHeader>
          <TableColumn>asd</TableColumn>
          <TableColumn>Likes</TableColumn>
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
