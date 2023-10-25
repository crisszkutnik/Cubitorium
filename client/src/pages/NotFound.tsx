export function NotFound() {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center -mt-20">
        <img src="/rubik-sad.png" />
        <h1 className="text-accent-dark font-semibold text-4xl mt-4">
          404 - Not Found
        </h1>
        <h3 className="max-w-xs text-center mt-4">
            Just like finding the right moves to solve a Rubik's Cube, sometimes it takes a little twist and turn to discover the right path.
        </h3>
        <h2 className="text-green-600 font-bold">Keep Searching!</h2>
      </div>
    );
  }
  