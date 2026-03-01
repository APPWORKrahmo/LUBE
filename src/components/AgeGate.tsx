interface AgeGateProps {
  onConfirm: () => void;
}

export default function AgeGate({ onConfirm }: AgeGateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            LUBE
          </h1>
          <p className="text-xl text-gray-300 font-light tracking-wide">
            All evenings need a little lubrication.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 space-y-6">
          <p className="text-2xl text-white font-semibold">
            This is an 18+ party game.
          </p>

          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Enter If You're That Bitch
          </button>
        </div>

        <p className="text-xs text-gray-500">
          By entering, you confirm you are 18 years or older
        </p>
      </div>
    </div>
  );
}
