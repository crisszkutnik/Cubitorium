import { ChangeEvent, useState } from 'react';
import { ScrambleDisplay } from '../../../components/ScrambleDisplay';
import { Textarea } from '@nextui-org/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface Props {
  setupScramble: string;
}

interface Inputs {
  solution: string;
}

export function ResolutionInput({ setupScramble }: Props) {
  const [isVerified, setIsVerified] = useState(false);

  const { control, handleSubmit } = useForm<Inputs>();
  const [userSolution, setUserSolution] = useState('');

  const handleVerify = () => {
    setIsVerified(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserSolution(e.target.value);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    if (isVerified) {
      // TODO: if verified, upload, how? IDK
    } else {
      // TODO: if not? IDK as well
    }
  };

  return (
    <div className="w-full drop-shadow p-6 rounded bg-white">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="rounded text-md bg-green-100 py-2 px-3 w-full text-center">
          You can see your solution in real time!
        </div>
        <ScrambleDisplay
          height="h-60 mb-8"
          width="w-fit"
          event={'3x3'}
          scramble={setupScramble + ' ' + userSolution}
        ></ScrambleDisplay>
      </div>

      <div className="mb-10">
        <div className="text-md items-center flex rounded text-gray-600 text-center mb-5 bg-blue-100 p-2">
          <FontAwesomeIcon icon={faCircleInfo} />
          <p className="w-full">
            You need to provide an algorithms that <b>solves</b> the case you
            selected. Otherwise the upload will not be possible
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white rounded-lg px-4 py-2 mr-4"
              onClick={handleVerify}
            >
              Verify
            </button>
            <button
              className={`${
                isVerified ? 'bg-green-500' : 'bg-green-300 pointer-events-none'
              } text-white rounded-lg px-4 py-2`}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
