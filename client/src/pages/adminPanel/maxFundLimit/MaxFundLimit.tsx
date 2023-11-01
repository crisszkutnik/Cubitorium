import { useAlgorithmsStore } from '../../../modules/store/algorithmsStore';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@nextui-org/react';
import { useAlertContext } from '../../../components/context/AlertContext';

interface Inputs {
  maxFundLimit: string;
}

export function MaxFundLimit() {
  const [maxFundLimit, setMaxFundLimit] = useAlgorithmsStore((state) => [
    state.maxFundLimit,
    state.setMaxFundLimit,
  ]);

  const { control, handleSubmit } = useForm<Inputs>();

  const { success, error } = useAlertContext();

  if (maxFundLimit === undefined) {
    return <></>;
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await setMaxFundLimit(data.maxFundLimit);
      success('Fund limit updated successfully.');
    } catch (e) {
      console.error(e);
      error('Failed to update max fund limit', e);
    }
  };

  return (
    <div className="bg-white drop-shadow w-full p-4 rounded gap-4 mb-4">
      <h2 className="text-accent-dark font-semibold text-xl mb-2">
        Set max fund limit
      </h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            defaultValue={maxFundLimit?.toString()}
            name="maxFundLimit"
            render={({ field }) => <Input label="Max fund limit" {...field} />}
          />
          <div className="w-24 mt-4">
            <Input color="primary" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
