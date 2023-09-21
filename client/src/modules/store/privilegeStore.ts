import { Privilege } from '../types/privilege.interface';
import { createWithEqualityFn } from 'zustand/traditional';
import { web3Layer } from '../web3/web3Layer';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../web3/utils';

type AddPrivilegeType = (
  granteePublicKey: string,
  granterPublicKey: PublicKey | undefined,
  asDeployer?: boolean,
) => Promise<void>;

interface PrivilegeStoreState {
  privilege: Privilege[] | undefined;
  loadPrivilege: () => Promise<void>;
  removePrivilege: (publicKey: string) => Promise<void>;
  addPrivilege: AddPrivilegeType;
}

export const selectAllUserPrivilege = (state: PrivilegeStoreState) => {
  const { privilege, loadPrivilege } = state;

  if (!privilege) {
    loadPrivilege();
    return [];
  }

  return privilege;
};

export const selectPrivilegeForUser = (publicKey: string | PublicKey) => {
  const pk = getStringFromPKOrObject(publicKey);

  return (state: PrivilegeStoreState) => {
    const { privilege, loadPrivilege } = state;

    if (!privilege) {
      loadPrivilege();
      return undefined;
    }

    return state.privilege?.find((p) => p.account.grantee.toString() === pk);
  };
};

export const usePrivilegeStore = createWithEqualityFn<PrivilegeStoreState>(
  (set, get) => ({
    privilege: undefined,
    loadPrivilege: async () => {
      const privilege = await web3Layer.fetchAllUserPrivilege();
      set({ privilege });
    },
    removePrivilege: async (publicKey: string) => {
      const privilege = get().privilege;

      if (!privilege) {
        return;
      }

      await web3Layer.revokePrivilege(publicKey);

      set({
        privilege: privilege.filter(
          (p) => p.account.grantee.toString() !== publicKey,
        ),
      });
    },
    addPrivilege: async (
      granteePublicKey: string,
      granterPublicKey: PublicKey | undefined,
      asDeployer = false,
    ) => {
      await web3Layer.addPrivilegedUser(
        granteePublicKey,
        asDeployer
          ? null
          : get().privilege?.find(
              (p) =>
                p.account.grantee.toString() === granterPublicKey?.toString(),
            ),
      );

      /*
        Estaria mejor agregar el Privilege nuevo solamente pero cargar todo de nuevo
        tambien sirve y es mas facil
      */
      get().loadPrivilege();
    },
  }),
  Object.is,
);
