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

      
        <div className="mx-auto relative text-left max-w-md mt-10 text-lg text-center">
          <ul>
            <li>
              <a href="#get-started" className="text-sky-500">
                💳 Configure your wallet
              </a>
            </li>
            <li>
              <a href="#how-to-submit" className="text-sky-500">
                🚀 Submit your first solution for an Algorithm's case
              </a>
            </li>
          </ul>
        </div>

        <p className="text-xs text-gray-500 mb-5 bg-gray-50 max-w-xs mx-auto p-2 mt-10">
        Although the site is quite intuitive and you are sure to be able to do what you want - we have left a series of guides for you to read.
        </p>

      
        
        {/* Divider */}
        <div className="border-b border-gray-300 my-4 max-w-5xl mx-auto"></div>


        {/* Guides, maybe add more? */}
        <GetStartedGuide />
        <div className="border-b border-gray-300 my-4 max-w-5xl mx-auto"></div>
        <HowToSubmitGuide />

      </div>
 
    </div>
  );
}
