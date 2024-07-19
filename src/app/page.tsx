import Image from "next/image";

function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/img/app.png"
        fill
        alt=""
        className="absolute inset-0 z-0 brightness-[0.2] blur-[2px] pointer-events-none"
      />
      <div className="relative z-10 px-8 py-8 flex flex-col items-center text-center space-y-4 text-white">
        <div className="flex-1">
          <h1 className="text-3xl md:text-6xl font-semibold drop-shadow-lg">
            Modular synthesis in your browser
          </h1>
          <p className="mt-2 text-lg md:text-2xl opacity-80">
            Create and share audio experiences.{" "}
            <span className="font-semibold">No installation required</span>.
          </p>

          <a href="https://forms.gle/pMLumhdsEGCPE7ho7" target="_blank">
            <button className="mt-8 px-8 py-2 bg-rose-600 text-white rounded-md text-2xl hover:bg-rose-700 active:bg-rose-800 font-bold">
              Join waitlist
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
