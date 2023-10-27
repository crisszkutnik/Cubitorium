import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Submit } from '../../components/Submit';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
  loggedUserSelector,
  useUserStore,
} from '../../modules/store/userStore';
import { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { Alert } from '../../components/Alert';
import { Input } from '@nextui-org/react';
import moment from 'moment';

interface Inputs {
  name: string;
  surname: string;
  wcaId: string;
  location: string;
  birthdate: string;
  profileImgSrc: string;
}

export function UserInfo() {
  const [loggedUser, sendUserInfo] = useUserStore(
    (state) => [loggedUserSelector(state), state.sendUserInfo],
    shallow,
  );
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [showErrorAlert, setErrorAlert] = useState(false);

  const { handleSubmit, reset, control } = useForm<Inputs>();

  useEffect(() => {
    if (loggedUser) {
      reset(loggedUser);
    }
  }, [loggedUser]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await sendUserInfo(
        data.name,
        data.surname,
        data.wcaId,
        data.location,
        moment(data.birthdate).format('YYYY-MM-DD'),
        data.profileImgSrc,
      );
      setErrorAlert(false);
      setSuccessAlert(true);
    } catch (e) {
      console.error(e);
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
        <div className="flex flex-col w-full gap-3">
          <div className="flex gap-3">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input label="Name" color="primary" {...field} />
              )}
            />
            <Controller
              control={control}
              name="surname"
              render={({ field }) => (
                <Input label="Surname" color="primary" {...field} />
              )}
            />
            <Controller
              control={control}
              name="wcaId"
              render={({ field }) => (
                <Input label="WCA ID" color="primary" {...field} />
              )}
            />
          </div>
          <div className="flex gap-3">
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Input label="Location" color="primary" {...field} />
              )}
            />
            <Controller
              control={control}
              name="birthdate"
              render={({ field }) => (
                <Input
                  label="Birthdate (DD/MM/YYYY)"
                  type="date"
                  color="primary"
                  placeholder="dd/mm/aaaa"
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="profileImgSrc"
              render={({ field }) => (
                <Input label="Profile image URL" color="primary" {...field} />
              )}
            />
          </div>
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
