import { Add } from './Add';
import { Delete } from './Delete';

export function PrivilegedUsers() {
  return (
    <div className="bg-white drop-shadow w-full p-4 rounded">
      <h2 className="text-accent-dark font-semibold text-xl mb-2">
        Privileged users
      </h2>
      <div className="flex gap-4">
        <Add />
        <Delete />
      </div>
    </div>
  );
}
