import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { Submit } from '../../components/Submit';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
  loggedUserSelector,
  useUserStore,
} from '../../modules/store/userStore';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { Alert } from '../../components/Alert';

interface Inputs {
  name: string;
  surname: string;
  wcaId: string;
  location: string;
}

export function UserInfo() {
  const [loggedUser, sendUserInfo] = useUserStore(
    (state) => [loggedUserSelector(state), state.sendUserInfo],
    shallow,
  );
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [showErrorAlert, setErrorAlert] = useState(false);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    if (loggedUser) {
      reset(loggedUser);
    }
  }, [loggedUser]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await sendUserInfo(data.name, data.surname, data.wcaId, data.location);
      setErrorAlert(false);
      setSuccessAlert(true);
    } catch (e) {
      setSuccessAlert(false);
      setErrorAlert(true);
    }
  };

  return (
    <UserInfoLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-white drop-shadow w-full p-4"
      >
        <div className="flex w-full">
          <Input
            register={register('name')}
            labelClassName="mr-2 w-1/2"
            label="Name"
            name="name"
          />
          <Input
            register={register('surname')}
            labelClassName="ml-2 w-1/2"
            label="Surname"
            name="surname"
          />
          <Input
            register={register('wcaId')}
            labelClassName="mr-2 w-1/2"
            label="WCA ID"
            name="wcaId"
          />
          <Input
            register={register('location')}
            labelClassName="ml-2 w-1/2"
            label="Location"
            name="location"
          />
        </div>
        <div className="mt-4">
          <Submit />
        </div>
      </form>
      {showSuccessAlert && (
        <Alert
          onPress={() => setSuccessAlert(false)}
          text="User details saved successfully"
          type="success"
        />
      )}
      {showErrorAlert && (
        <Alert
          onPress={() => setSuccessAlert(false)}
          text="Failed to save user details"
          type="error"
        />
      )}
    </UserInfoLayout>
  );
}
