import { useState } from "react";

export function ResolutionInput() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerified(true);
  };

  const handleUpload = () => {
    if (isVerified) {
      // TODO: if verified, upload, how? IDK
    } else {
      // TODO: if not? IDK as well
    }
  };

  return (
    <div className="w-1/2 px-4 py-10 ml-96 -mt-96">
      <div className="w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-10 grid">
        <div className="note text-xs text-gray-600 text-center tracking-wide leading-5 mb-5 bg-purple-100 p-2">
          You need to provide a <b className="font-semibold">cube-solving algorithm;</b> otherwise, the upload will not be possible.
        </div>
          <textarea
            className="custom-textarea border rounded-lg p-2 w-full h-20 text-lg tracking-wide"
            placeholder="Solve the cube!"
          />
        </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mr-4"
            onClick={handleVerify}
          >
            Verify
          </button>
          <button
            className={`${
              isVerified ? "bg-green-500" : "bg-green-300 pointer-events-none"
            } text-white rounded-lg px-4 py-2`}
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

