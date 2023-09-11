import { Add } from './Add';
import { Delete } from './Delete';

export function PrivilegedUsers() {
  return (
    <div className="bg-white drop-shadow w-full p-4 rounded gap-4">
      <h2 className="text-accent-dark font-semibold text-xl mb-2">
        Privileged users
      </h2>
      <Add />
      <Delete />
    </div>
  );
}
