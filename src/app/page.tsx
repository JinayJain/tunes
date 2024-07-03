function Home() {
  return (
    <div className="px-8 py-8 flex md:min-h-screen md:flex-row flex-col space-y-4 md:space-x-4">
      <div className="flex-1">
        <h1 className="text-3xl md:text-6xl font-semibold bg-gradient-to-r from-purple-700 via-pink-500 to-rose-500 text-transparent bg-clip-text">
          Modular synthesis in your browser
        </h1>
        <p className="mt-2 text-lg md:text-2xl text-gray-600">
          Quickly build and share audio experiences with a simple drag-and-drop
          interface.
        </p>

        <a href="https://forms.gle/pMLumhdsEGCPE7ho7" target="_blank">
          <button className="mt-4 px-8 py-2 bg-rose-600 text-white rounded-md text-lg hover:bg-rose-700 active:bg-rose-800">
            Join waitlist
          </button>
        </a>
      </div>
    </div>
  );
}

export default Home;
