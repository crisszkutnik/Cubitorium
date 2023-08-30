import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { Submit } from "../../components/Submit";
import { UserInfoLayout } from "../../components/layout/UserInfoLayout";

interface Inputs {
  name: string;
  surname: string;
}

export function UserInfo() {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <UserInfoLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-white drop-shadow w-full p-4"
      >
        <div className="flex w-full">
          <Input
            register={register("name")}
            labelClassName="mr-2 w-1/2"
            label="Name"
            name="name"
          />
          <Input
            register={register("surname")}
            labelClassName="ml-2 w-1/2"
            label="Surname"
            name="surname"
          />
        </div>
        <div className="mt-4">
          <Submit />
        </div>
      </form>
    </UserInfoLayout>
  );
}
