import { Input } from '@nextui-org/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAlertContext } from '../../../components/context/AlertContext';
import { useCaseStore } from '../../../modules/store/caseStore';

interface Inputs {
  set: string;
  id: string;
  setup: string;
}

export function AddCase() {
  const { control, handleSubmit } = useForm<Inputs>();
  const { success, error } = useAlertContext();
  const addCase = useCaseStore((state) => state.addCase);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await addCase(data.set, data.id, data.setup);
      success('Case added correctly');
    } catch (e) {
      console.error(e);
      error('Failed to add case. Check that the specified set already exists');
    }
  };

  return (
    <div className="bg-white drop-shadow w-full p-4 rounded gap-4 mb-4">
      <h2 className="text-accent-dark font-semibold text-xl mb-2">Add case</h2>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <Controller
            control={control}
            name="set"
            render={({ field }) => <Input label="Set" {...field} />}
          />
          <Controller
            control={control}
            name="id"
            render={({ field }) => <Input label="Name" {...field} />}
          />
          <Controller
            control={control}
            name="setup"
            render={({ field }) => <Input label="Setup" {...field} />}
          />
        </div>
        <div className="w-24 mt-4">
          <Input color="primary" type="submit" />
        </div>
      </form>
    </div>
  );
}
