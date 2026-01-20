export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center animate-fade-in">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Privacy & Data Usage
          </h1>
          <p className="text-gray-400">
            Your privacy is our top priority
          </p>
        </div>

        <div className="space-y-6 animate-slide-up">
          <section className="glass p-6 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📹</div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-blue-400">
                  Webcam Usage
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  FocusSense uses your webcam only to detect whether you are
                  focused on the screen during a study session. All webcam
                  processing happens locally in your browser. <span className="font-semibold text-white">No video or
                  images are recorded, stored, or sent to any server.</span>
                </p>
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🌐</div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-purple-400">
                  Website & YouTube Tracking
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Website and YouTube activity categorization is performed
                  locally using a browser extension. The application does not
                  store browsing history, URLs, page content, or video titles.
                  Only aggregated time spent on productive and distracting
                  categories is saved.
                </p>
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl border-2 border-green-500/30 hover:border-green-500/50 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">💾</div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-green-400">
                  Data Stored
                </h2>
                <ul className="list-none space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Total focused time</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Total distracted time</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Session duration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Aggregated productivity statistics</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl border-2 border-red-500/30 hover:border-red-500/50 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🚫</div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-red-400">
                  What We Do NOT Collect
                </h2>
                <ul className="list-none space-y-2 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-red-400">✕</span>
                    <span>Webcam video or images</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-red-400">✕</span>
                    <span>Exact websites or URLs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-red-400">✕</span>
                    <span>YouTube video titles or watch history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-red-400">✕</span>
                    <span>Personal messages or content</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚙️</div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-yellow-400">
                  User Control
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  All tracking features are optional. You can pause or disable
                  webcam detection and website tracking at any time from the
                  application settings or browser extension. You're always in control.
                </p>
              </div>
            </div>
          </section>

          {/* Trust Badge */}
          <div className="glass p-8 rounded-2xl border-2 border-gray-700 text-center animate-fade-in">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-3">100% Local Processing</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              All face detection and focus analysis happens entirely on your device. 
              Your data never leaves your computer. We believe in privacy by design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
