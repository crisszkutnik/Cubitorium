import { ChangeEvent, useRef, useState } from 'react';
import { Input, Textarea } from '@nextui-org/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { CaseAccount } from '../../../modules/types/case.interface';
import { useAlertContext } from '../../../components/context/AlertContext';
import { useSolutionStore } from '../../../modules/store/solutionStore';
import { ScrambleDisplay2 } from '../../../components/ScrambleDisplay2';

interface Props {
  activeCase: CaseAccount | undefined;
}

interface Inputs {
  solution: string;
}

export function ResolutionInput({ activeCase }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const { control, handleSubmit } = useForm<Inputs>();
  const [userSolution, setUserSolution] = useState('');
  const { success, error } = useAlertContext();
  const addSolution = useSolutionStore((state) => state.addSolution);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserSolution(e.target.value);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!activeCase) {
      return;
    }

    try {
      await addSolution(activeCase, data.solution);
      success('Solution added successfully');
    } catch (e) {
      console.error(e);
      error(
        'Failed to add solution. Check that the solution you submitted solves the selected case!',
      );
    }
  };

  return (
    <div className="w-full drop-shadow p-6 rounded bg-white">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="rounded text-md bg-green-100 py-2 px-3 w-full text-center">
          You can see your solution in real time!
        </div>
        <p className="mt-4 text-lg">
          <b>Setup: </b> {activeCase?.account.setup}
        </p>
        <ScrambleDisplay2
          height="h-60 mb-4"
          width="w-fit"
          set={activeCase?.account.set || ''}
          scramble={activeCase?.account.setup + ' ' + userSolution}
        />
      </div>
      <div>
        <div className="text-md items-center flex rounded text-gray-600 text-center mb-5 bg-blue-100 p-2">
          <FontAwesomeIcon icon={faCircleInfo} />
          <p className="pl-3 w-full">
            You need to provide an algorithms that <b>solves</b> the case you
            selected. Otherwise the upload will not be possible
          </p>
        </div>
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="solution"
            render={(props) => (
              <Textarea
                {...props.field}
                onChange={(value) => {
                  props.field.onChange(value);
                  handleInputChange(value);
                }}
              />
            )}
          />
          <Input className="w-24 mt-2" color="primary" type="submit" />
        </form>
      </div>
    </div>
  );
}
