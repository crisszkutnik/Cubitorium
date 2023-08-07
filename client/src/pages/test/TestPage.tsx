import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { web3Service } from "../../modules/web3/web3Service";

interface FormData {
  name: string;
  surname: string;
}

export function TestPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const wallet = useAnchorWallet();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await web3Service.sendUserInfo(data.name, data.surname);
    console.log(data);
  };

  useEffect(() => {
    if (wallet) {
      console.log(wallet);
      web3Service.setWallet(wallet);
    }

    loadUserInfo();
  }, [wallet]);

  const loadUserInfo = async () => {
    const a = await web3Service.getUserInfo();
    console.log(a);
  };

  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <WalletMultiButton />
      <form>
        <input {...register("name")} />
        <input {...register("surname")} />
        <input type="submit" />
      </form>
    </div>
  );
}
