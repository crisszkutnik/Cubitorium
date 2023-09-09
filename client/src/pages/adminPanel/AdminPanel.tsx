import { Input, Textarea } from '@nextui-org/react';
import { DefaultLayout } from '../../components/layout/DefaultLayout';
import {
  selectAllSets,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { PrivilegedUsers } from './PrivilegedUsers';
import { useAlertContext } from '../../components/context/AlertContext';

interface Input {
  sets: string;
}

export function AdminPanel() {
  const [sets, updateSets] = useAlgorithmsStore(
    (state) => [selectAllSets(state), state.updateSets],
    shallow,
  );
  const { success, error } = useAlertContext();

  const { control, reset, handleSubmit } = useForm<Input>();

  useEffect(() => {
    console.log(sets);
    reset({
      sets: JSON.stringify(sets),
    });
  }, []);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await updateSets(data.sets);
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <Controller
            control={control}
            name="sets"
            render={({ field }) => <Textarea {...field} />}
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
