export function NotFound() {
    return (
      <div className="relative h-screen mt-20 text-center">
        <img src="/rubik-sad.png" className="mx-auto" />
        <h1 className="text-accent-dark font-semibold text-4xl mt-4">
          4<img className="inline-block h-10 grayscale" src="/public/Logo.png" alt="Cubitorium" />4 - Not Found
        </h1>
        <h3 className="max-w-xs text-center mt-4 mx-auto">
            Just like finding the right moves to solve a Rubik's Cube, sometimes it takes a little twist and turn to discover the right path.
        </h3>
        <h2 className="text-green-600 font-bold">Keep Searching!</h2>
      </div>
    );
  }
  