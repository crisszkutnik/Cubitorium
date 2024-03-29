import { Link } from '@nextui-org/react';

export function HowToSubmitGuide() {
    return (
        <div id="how-to-submit">
            <div className="relative flex flex-col items-center space-y-12 mt-8">
                <div className="container mx-auto p-4 text-center items-center">
                <h1 className="text-3xl font-bold text-accent-dark text-center mt-10">
                    How to upload your solution for an algorithm's case 
                </h1>
            
                    {/* Step 1 */}
                    <div className="mt-10 mb-10">
                        <h2 className="text-2xl mb-3">Step 1 ➔ Select your case</h2>
                            <div className="mb-4 flex items-center justify-center">
                                <p className="text-md text-gray-600 mb-4 mr-6 max-w-xs text-right">
                                Select a case on the  <Link href="/algorithms" className="text-sky-600 font-bold">Algorithms</Link> page to which you want to upload a new solution.
                                </p>
                                <img src="/step-01.jpeg" className="border-1 border-purple-800 mb-2 inline-block h-2/5 w-2/4" />
                            </div>
                            <hr/>
                    </div>
                    
                    
                    {/* Step 2 */}
                    <div className="mt-10 mb-10">
                    <h2 className="text-2xl mb-3">Step 2 ➔ Add a solution</h2>
                    <div className="mb-4 flex items-center justify-center">
                    <img src="/step-02.jpeg" className="border-1 border-purple-800 mb-2 inline-block h-3/5 w-4/4" />
                        <p className="text-md text-gray-600 mb-4 ml-6 max-w-xs text-left">
                            Once you select the case, click on the <b>+ Add </b>button in order to be redirected to the  <Link href="/algorithms/upload" className="text-sky-600 font-bold">Upload your Algorithm</Link> page .
                        </p>
                    </div>
                    <hr/>
                    </div>

                    
                    {/* Step 3 */}
                    <div className="mt-10 mb-10"></div>
                    <h2 className="text-2xl mb-3 text-center">Step 3 ➔ Verify the selected case</h2>
                    <div className="mb-4 flex items-center justify-center">
                        <p className="text-md text-gray-600 mb-4 mr-6 max-w-xs text-right">
                        Now, if the shown case is correct, you're ready to go.
                        
                        You will find a box beneath the cube in which you can start typing the solution. <br/>
                            <br/>

                            Remember to use the official <Link className="text-sky-600 font-bold" href="https://www.worldcubeassociation.org/regulations/#article-12-notation">WCA Notation.</Link>
                        </p>
                        <img src="/step-03.jpeg" className="border-1 border-purple-800 mb-2 inline-block h-80 w-500" />
                    </div>
                    <hr/>
                    </div>

                    
                    {/* Step 4 */}
                    <div className="mt-10 mb-10">
                    <h2 className="text-2xl mb-3 mr-20 text-right">Step 4 ➔ Rock the world</h2>
                    <div className="mb-4 flex items-center justify-center">
                        
                        <img src="/step-04.jpeg" className="border-1 border-purple-800 mb-2 inline-block h-80 w-500" />
                        <p className="text-md text-gray-600 mb-4 ml-6 max-w-xs text-left">
                        Start cubing!<br/>
                        You will be able to visualize the solution that you're typing in real time.
                        <br/>
                        <br/>
                        💡 If you type an extra-space or a <b>wrong solution</b>, you don't have to worry at all - we got your back.
                        <br/>
                        <br/>
                        Whenever you are ready, Submit your solution.
                        </p>
                        
                    </div>
                    <hr/>
                    </div>

                    {/* Step 5 */}
                    <div className="mt-10 mb-10">
                    <h2 className="text-2xl mb-3">Step 5 ➔ Sign the transaction</h2>
                    <div className="mb-4 flex items-center justify-center">
                        <p className="text-md text-gray-600 mb-4 mr-6 max-w-xs text-right">
                        This will send your solution to the blockchain, save it, and refund the expenses to you (<i>up to a certain limit</i>). 
                    
                        <br/><br/>
                        
                        Admins set the limit, but don't worry, it's high enough to get you going.
                        </p>
                        <img src="/step-05.jpeg" className="border-1 border-purple-800 mb-2 inline-block h-80 w-500" />
                    </div>
                    <hr/>
                    </div>

                    {/* Step 6 */}
                    <h2 className="text-2xl mb-3 text-green-900">Congrats!</h2>
                    <p className="text-md text-gray-600 mb-4 ml-6 max-w-xs text-center">

                    Your solution is uploaded and everybody can see it now!

                    <br/><br/>
                        <b>Rejoice!</b>     
                    
                    </p>
            
                    <img src="/step-07.jpeg" className="border-1 border-purple-800 mb-2 inline-block max-w-6xl" />    

                    <div className="-mt-20 items-center justify-center">
                        <p className="text-md text-gray-600 mb-4 mr-6 max-w-xs text-left">
                        </p>
                    </div>
                </div>
            </div>
    
      );
    };