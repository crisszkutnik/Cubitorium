import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Submit } from '../../components/Submit';
import { UserInfoLayout } from '../../components/layout/UserInfoLayout';
import {
  loggedUserSelector,
  useUserStore,
} from '../../modules/store/userStore';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { Input } from '@nextui-org/react';
import moment from 'moment';
import { useAlertContext } from '../../components/context/AlertContext';

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
  const { success, error } = useAlertContext();

  const { handleSubmit, reset, control } = useForm<Inputs>();

  useEffect(() => {
    if (loggedUser) {
      reset(loggedUser);
    }
  }, [loggedUser]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      await sendUserInfo(
        data.name,
        data.surname,
        data.wcaId,
        data.location,
        data.birthdate ? moment(data.birthdate).format('YYYY-MM-DD') : '',
        data.profileImgSrc,
      );
      success('User details saved successfully');
    } catch (e) {
      console.error(e);
      error('Failed to save user details', e);
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
              defaultValue=""
              name="name"
              render={({ field }) => (
                <Input label="Name" color="primary" {...field} />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="surname"
              render={({ field }) => (
                <Input label="Surname" color="primary" {...field} />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="wcaId"
              render={({ field }) => (
                <Input label="WCA ID" color="primary" {...field} />
              )}
            />
          </div>
          <div className="flex gap-3">
            <Controller
              control={control}
              defaultValue=""
              name="location"
              render={({ field }) => (
                <Input label="Location" color="primary" {...field} />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
              name="birthdate"
              render={({ field }) => (
                <Input
                  label="Birthdate"
                  type="date"
                  color="primary"
                  placeholder=" "
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              defaultValue=""
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
    </UserInfoLayout>
  );
}
