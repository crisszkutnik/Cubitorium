import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useAlertContext } from '../../../components/context/AlertContext';
import {
  selectAllUserPrivilege,
  usePrivilegeStore,
} from '../../../modules/store/privilegeStore';
import { shallow } from 'zustand/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export function Delete() {
  const [privilege, removePrivilege] = usePrivilegeStore(
    (state) => [selectAllUserPrivilege(state), state.removePrivilege],
    shallow,
  );
  const { success, error } = useAlertContext();

  const onClick = async (publicKey: string) => {
    try {
      await removePrivilege(publicKey);
      success('Privileged user remove');
    } catch (e) {
      console.error(e);
      error('Failed to remove privileged user', e);
    }
  };

  return (
    <div className="flex flex-col w-1/2">
      <h2 className="text-accent-dark text-lg mb-2">Remove</h2>
      <Table
        isStriped
        removeWrapper
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Key</TableColumn>
          <TableColumn>
            <p className="w-full text-center">Remove</p>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {privilege.map((p, index) => (
            <TableRow key={index}>
              <TableCell>{p.account.grantee.toString()}</TableCell>
              <TableCell>
                <div className="flex w-full justify-center">
                  <button
                    onClick={() => onClick(p.account.grantee.toString())}
                    className="text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
