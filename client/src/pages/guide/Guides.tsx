import { GetStartedGuide } from './GetStartedGuide';
import { HowToSubmitGuide } from './HowToSubmitGuide';

export function Guides() {
  return (
    <div className="relative h-screen text-center mt-96">

      <h1 className="text-4xl font-bold mb-4 -mt-80">📚 Guides</h1>

      <div className="max-w-200 max-h-200">

        <p className="text-md text-gray-600 mb-4 mt-4">
          Explore the Cubitorium guides to learn everything <br/> you need to know 
          before starting!
        </p>

        <p className="text-xs text-gray-500 mb-5 bg-gray-50 max-w-xs mx-auto p-2">
        Although the site is quite intuitive and you are sure to be able to do what you want - we have left a series of guides for you to read. It's always good to read.
        </p>

        <div className="mx-auto relative text-left max-w-sm">
          <ul>
            <li>
              <a href="#get-started" className="text-sky-500">
                💳 How to set up your wallet
              </a>
            </li>
            <li>
              <a href="#how-to-submit" className="text-sky-500">
                🚀 How to submit your first solution for a case
              </a>
            </li>
          </ul>
          
        </div>
        <hr className="mt-5" />
    

        
       
        <GetStartedGuide />
        <hr className="mt-20" />
        <HowToSubmitGuide />

      </div>
    </div>
  );
}
