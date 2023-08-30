import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useUserStore } from "../../modules/store/userStore";
import { web3Service } from "../../modules/service/web3Service";
import { LoginButton } from "../../components/navbar/LoginButton";

interface FormData {
  name: string;
  surname: string;
}

export function TestPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const { userInfo, isLogged } = useUserStore();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    web3Service.sendUserInfo(data.name, data.surname);
  };

  useEffect(() => {
    if (isLogged) {
      web3Service.getLoggedUserInfo();
    }
  }, [isLogged]);

  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <LoginButton />
      <form>
        <input {...register("name")} />
        <input {...register("surname")} />
        <input type="submit" />
      </form>
      <h1>
        {userInfo.name} {userInfo.surname}
      </h1>
    </div>
  );
}
