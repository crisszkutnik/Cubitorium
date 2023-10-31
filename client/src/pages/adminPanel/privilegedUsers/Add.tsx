import { Checkbox, Input } from '@nextui-org/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '../../../components/context/AlertContext';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { usePrivilegeStore } from '../../../modules/store/privilegeStore';

interface Input {
  userPublicKey: string;
  asDeployer: string;
}

export function Add() {
  const { control, handleSubmit } = useForm<Input>({
    defaultValues: {
      userPublicKey: '',
    },
  });
  const { success, error } = useAlertContext();
  const wallet = useAnchorWallet();
  const addPrivilege = usePrivilegeStore((state) => state.addPrivilege);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    const asDeployer = Boolean(data.asDeployer);
    try {
      await addPrivilege(data.userPublicKey, wallet?.publicKey, asDeployer);
      success('Privileged user added');
    } catch (e) {
      console.error(e);
      error('Failed to add privileged user', e);
    }
  };
  return (
    <div className="flex flex-col w-1/2">
      <h2 className="text-accent-dark text-lg mb-2">Add</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        <Controller
          control={control}
          name="userPublicKey"
          render={({ field }) => <Input label="Public key" {...field} />}
        />
        <Controller
          control={control}
          name="asDeployer"
          render={({ field }) => <Checkbox {...field}>As deployer?</Checkbox>}
        />
        <div className="w-24">
          <Input type="submit" color="primary" value={'Add'} />
        </div>
      </form>
    </div>
  );
}
