import { Button , Link} from '@nextui-org/react';

export function Guides() {
  return (
    <div className="relative h-screen text-center mt-96">
      <h1 className="text-4xl font-bold mb-4 -mt-80">
      
      📚 Guides
        </h1>

      <div className="max-w-200 max-h-200">
        
        <p className="text-md text-gray-600 mb-10 mt-4">
          Explore the Cubitorium guides to learn everything <br/> you need to know 
          to become a master.
        </p>
        <div className="mx-auto relative text-left max-w-sm">
          <li>
            <Link href="/guides/get-started" className="text-sky-500">
              💳 How to set up your wallet
            </Link>
          </li>
          <li>
            <Link href="/guides/how-to-submit" className="text-sky-500">
              🚀  How to submit your first solution for a case
            </Link>
          </li>

        </div>
       
      </div>
    </div>
   
  );
}
