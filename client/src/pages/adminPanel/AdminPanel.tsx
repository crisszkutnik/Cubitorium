import { Input, Textarea } from '@nextui-org/react';
import { DefaultLayout } from '../../components/layout/DefaultLayout';
import {
  selectSets2,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { shallow } from 'zustand/shallow';
import { PrivilegedUsers } from './privilegedUsers/PrivilegedUsers';
import { useAlertContext } from '../../components/context/AlertContext';

interface Input {
  names: string;
  cases: string;
}

export function AdminPanel() {
  const [updateSets2, sets2] = useAlgorithmsStore(
    (state) => [state.updateSets2, selectSets2(state)],
    shallow,
  );
  const { success, error } = useAlertContext();

  const { control, handleSubmit } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await updateSets2(data.names, data.cases.split(','));
      success('Sets updated successfully');
    } catch (e) {
      console.error(e);
      error('Failed to update sets. Check that input is a JSON string!');
    }
  };

  return (
    <DefaultLayout column={true}>
      <h1 className="text-accent-primary font-semibold mt-3 mb-5 text-4xl">
        Administrator config
      </h1>
      <div className="bg-white drop-shadow w-full p-4 rounded mb-4">
        <h2 className="text-accent-dark font-semibold text-xl mb-2">Sets</h2>
        <Textarea disabled value={JSON.stringify(sets2)} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <Controller
            control={control}
            name="names"
            render={({ field }) => <Input {...field} />}
          />
          <Controller
            control={control}
            name="cases"
            render={({ field }) => <Input {...field} />}
          />
          <div className="w-24 mt-2">
            <Input type="submit" color="primary" />
          </div>
        </form>
      </div>
      <PrivilegedUsers />
    </DefaultLayout>
  );
}
