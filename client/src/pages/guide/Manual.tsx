export function Manual() {
    return (
        <div className="relative h-screen">
            <div className="relative flex flex-col items-center space-y-12 mt-10">
                <div className="container mx-auto p-4 text-center items-center">
                    <h1 className="text-2xl font-bold mb-4">How to upload your solution for a case</h1>
            

                    {/* Step 1 */}
                    <div className="mt-10 mb-10">
                        <h2 className="text-2xl underline mb-3">Step 1: Select your case</h2>
                            <div className="mb-4 flex items-center justify-center">
                                <p className="text-sm text-gray-600 mb-4 mr-6 max-w-xs text-right">
                                    On the Algorithms page you will find a complete series of cases to select. <br/> Be sure to select the case that you want to practice
                                    or upload your solution.
                                </p>
                                <img src="../../../public/step-01.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-2/5 w-2/4" />
                            </div>
                            <hr/>
                    </div>
                    
                    

                    {/* Step 2 */}
                    <div className="mt-10 mb-10">
                    <h2 className="text-2xl underline mb-3">Step 2: Add a solution for the selected case</h2>
                    <div className="mb-4 flex items-center justify-center">
                    <img src="../../../public/step-02.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-3/5 w-4/4" />
                        <p className="text-sm text-gray-600 mb-4 ml-6 max-w-xs text-left">
                            Once you selected your case to practice or upload, click on the <b>+ Add</b> button in order to be redirected to the Upload your Algorithm page.
                        </p>
                    </div>
                    <hr/>
                    </div>

                    

                    {/* Step 3 */}
                    <div className="mt-10 mb-10"></div>
                    <h2 className="text-2xl underline mb-3 text-center">Step 3: Verify the selected case</h2>
                    <div className="mb-4 flex items-center justify-center">
                        <p className="text-sm text-gray-600 mb-4 mr-6 max-w-xs text-right">
                            Now, if the case visualized is what you wanted for, now you're ready to go. <br/>
                            You will find a textarea below the setup of the cube in which you can start typing the solution. <br/>
                            <br/>

                            <b>Remember</b> to use the official <a className="text-sky-600 font-bold" href="https://meep.cubing.net/wcanotation.html">WCA Notation.</a>
                        </p>
                        <img src="../../../public/step-03.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-80 w-500" />
                    </div>
                    <hr/>
                    </div>

                    
                    {/* Step 4 */}
                    <div className="mt-10 mb-10">
                    <h2 className="text-2xl underline mb-3 text-right">Step 4: Rock the world</h2>
                    <div className="mb-4 flex items-center justify-center">
                        
                        <img src="../../../public/step-04.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-80 w-500" />
                        <p className="text-sm text-gray-600 mb-4 ml-6 max-w-xs text-left">
                            Start cubing! <br/>
                            As the image shows, you will be able to visualize in <b>real time</b> the solution that you're typing. 
                            <br/>
                            <br/>
                            If you type an extra-space or something - you don't have to worry at all, because Cubitorium will solve it and validate your solution.
                            <br/>
                            <br/>
                            When you already <b>solved</b> the case, type the Submit button to upload your solutio
                        </p>
                        
                    </div>
                    <hr/>
                    </div>

                    

                    {/* Step 5 */}
                    <div className="mt-10 mb-10">
                    <h2 className="text-2xl underline mb-3">Step 5: Sign the transaction</h2>
                    <div className="mb-4 flex items-center justify-center">
                        <p className="text-sm text-gray-600 mb-4 mr-6 max-w-xs text-right">
                        This will validate your solution, save it, and refund the expenses to you (<i>up to a certain limit.</i>)

                        <br/>
                        <br/>

                        This limit is set by the admins. If you exceed it, you will have to pay to submit your solutions.<br/>
                         Don't worry, if you get there, the cost is low. quizas expandir un poco mas idk idk idk
                        </p>
                        <img src="../../../public/step-05.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-80 w-500" />
                    </div>
                    <hr/>
                    </div>

                
                    

                    {/* Step 6 */}
                    <h2 className="text-2xl mb-3 text-green-900">Congrats buddy! </h2>
                    <div className="mb-4 flex items-center justify-center">
                        <img src="../../../public/step-06.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-80 w-500" />
                        <p className="text-sm text-gray-600 mb-4 ml-6 max-w-xs text-left">
                            Your solution was uploaded, now you can visualize it adaidsbaidniadsa.

                            <br/>
                            <br/>
                            <br/>
                            <b>Lorem Ispur</b> (casero):<br/>
                                cries tobal cries and tobal tower and flowres  dasndi q8w h9qwh diwqdqwd Lore

                                                        h-3/6	height: 50%;
                                h-4/6	height: 66.666667%;
                                h-5/6	height: 83.333333%;
                                h-full	height: 100%;
                                h-screen	height: 100vh;
                                h-min	height: min-content;
                                h-max	height: max-content;
                                h-fit	height: fit-content;

                        </p>
                    </div>



                    {/* Step 7 */}
                    <div className="mb-4 flex items-center justify-center">
                        <p className="text-sm text-gray-600 mb-4 mr-6 max-w-xs text-left">

                            
                        </p>
                        <img src="../../../public/step-07.jpeg" className="border-2 border-purple-800 mb-2 inline-block h-80 w-500" />
                    </div>

                
                </div>
            </div>
    
      );
    };