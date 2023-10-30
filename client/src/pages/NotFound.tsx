export function NotFound() {
    return (
      <div className="relative h-screen mt-20 text-center">
        <img src="/rubik-sad.png" className="mx-auto" />
        <h1 className="text-accent-dark font-semibold text-5xl mt-4">
          4<img src="/404.gif" className="h-8 inline-block text-center rounded-full border-5 border-blue-950"/>4 - Not Found
        </h1>
        
        <h3 className="max-w-xs text-center mt-4 mx-auto">
            Just like finding the right moves to solve a Cube, sometimes it takes a little twist and turn to discover the right path.
        </h3>
        <h2 className="text-indigo-700 font-bold">Keep Searching!</h2>
      </div>
    );
  }
  