import { Input } from '@nextui-org/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '../../components/context/AlertContext';
import { web3Layer } from '../../modules/web3/web3Layer';

interface Input {
  userPublicKey: string;
}

export function PrivilegedUsers() {
  const { control, handleSubmit } = useForm<Input>();
  const { success, error } = useAlertContext();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await web3Layer.addPrivilegedUser(data.userPublicKey);
      success('Privileged user added');
    } catch (e) {
      console.error(e);
      error('Failed to add privileged user');
    }
  };

  return (
    <div className="bg-white drop-shadow w-full p-4 rounded">
      <h2 className="text-accent-dark font-semibold text-xl mb-2">
        Add privileged user
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        <Controller
          control={control}
          name="userPublicKey"
          render={({ field }) => <Input label="Public key" {...field} />}
        />
        <div className="w-24 mt-2">
          <Input type="submit" color="primary" value={'Add'} />
        </div>
      </form>
    </div>
  );
}
