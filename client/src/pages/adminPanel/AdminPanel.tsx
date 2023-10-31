import { Input, Textarea } from '@nextui-org/react';
import { DefaultLayout } from '../../components/layout/DefaultLayout';
import { useAlgorithmsStore } from '../../modules/store/algorithmsStore';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { shallow } from 'zustand/shallow';
import { PrivilegedUsers } from './privilegedUsers/PrivilegedUsers';
import { useAlertContext } from '../../components/context/AlertContext';
import { AddCase } from './addCase/AddCase';
import { useEffect } from 'react';
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';
import { MaxFundLimit } from './maxFundLimit/MaxFundLimit';

interface Input {
  names: string;
  cases: string;
}

export function AdminPanel() {
  const [updateSets, sets, loadingState, loadIfNotLoaded] = useAlgorithmsStore(
    (state) => [
      state.updateSets,
      state.sets,
      state.loadingState,
      state.loadIfNotLoaded,
    ],
    shallow,
  );
  const { success, error } = useAlertContext();

  const { control, handleSubmit } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await updateSets(data.names, data.cases.split(','));
      success('Sets updated successfully');
    } catch (e) {
      console.error(e);
      error('Failed to update sets. Check that input is a JSON string!', e);
    }
  };

  useEffect(() => {
    loadIfNotLoaded();
  }, []);

  const hasAllRequiredData = () => {
    return loadingState === LoadingState.LOADED;
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  return (
    <DefaultLayout column={true}>
      <h1 className="text-accent-primary font-semibold mt-3 mb-5 text-4xl">
        Administrator config
      </h1>
      <div className="bg-white drop-shadow w-full p-4 rounded mb-4">
        <h2 className="text-accent-dark font-semibold text-xl mb-2">Sets</h2>
        <Textarea disabled value={JSON.stringify(sets, null, 4)} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <Controller
            control={control}
            defaultValue=""
            name="names"
            render={({ field }) => (
              <Input className="mt-2" label="Set name" {...field} />
            )}
          />
          <Controller
            control={control}
            defaultValue=""
            name="cases"
            render={({ field }) => (
              <Input
                className="mt-2"
                label="Cases (separated by comma)"
                {...field}
              />
            )}
          />
          <div className="w-24 mt-2">
            <Input type="submit" color="primary" />
          </div>
        </form>
      </div>
      <AddCase />
      <MaxFundLimit />
      <PrivilegedUsers />
    </DefaultLayout>
  );
}
