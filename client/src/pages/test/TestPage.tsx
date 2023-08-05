import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";

interface FormData {
  name: string;
  surname: string;
}

export function TestPage() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    //web3Service.sendUserInfo(data.name, data.surname);
    console.log(data);
  };

  useEffect(() => {
    loadUserInfo;
  }, []);

  const loadUserInfo = () => {
    //const a = web3Service.getUserInfo();
    //console.log(a);
  };

  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <form>
        <input {...register("name")} />
        <input {...register("surname")} />
        <input type="submit" />
      </form>
    </div>
  );
}
