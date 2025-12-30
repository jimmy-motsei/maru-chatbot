'use client';

import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--maru-dark)] flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-white">Maru AI </span>
          <span className="text-[var(--maru-turquoise)]">Chatbot</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Your intelligent assistant for AI & automation solutions. Get instant answers about our services,
          pricing, and how we can help your business grow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://maruonline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[var(--maru-turquoise)] text-[var(--maru-dark)] rounded-lg font-semibold hover:bg-[var(--maru-turquoise)]/90 transition-all"
          >
            Visit Maru Online
          </a>
          <button
            onClick={() => {
              const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
              chatButton?.click();
            }}
            className="px-8 py-3 border-2 border-[var(--maru-turquoise)] text-[var(--maru-turquoise)] rounded-lg font-semibold hover:bg-[var(--maru-turquoise)]/10 transition-all"
          >
            Try the Chatbot
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        <div className="glass p-6 rounded-xl">
          <div className="w-12 h-12 bg-[var(--maru-turquoise)]/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-gray-400">
            Powered by Google Gemini for intelligent, context-aware conversations about our services.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="w-12 h-12 bg-[var(--maru-turquoise)]/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Lead Qualification</h3>
          <p className="text-gray-400">
            Automatically collects visitor information and qualifies leads based on their needs.
          </p>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="w-12 h-12 bg-[var(--maru-turquoise)]/20 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Instant Responses</h3>
          <p className="text-gray-400">
            Get immediate answers to questions about our AI & automation services 24/7.
          </p>
        </div>
      </div>

      {/* Integration Info */}
      <div className="max-w-3xl mx-auto glass p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Integrate?</h2>
        <p className="text-gray-300 mb-6">
          This chatbot can be easily embedded on the main Maru Online website or any other page.
          Just add a simple script tag or React component.
        </p>
        <div className="bg-[var(--maru-dark)] p-4 rounded-lg text-left overflow-x-auto">
          <code className="text-sm text-[var(--maru-turquoise)]">
            {`<ChatWidget />`}
          </code>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>Built with Next.js 15, Google Gemini AI, and Framer Motion</p>
        <p className="mt-2">
          <a
            href="https://maruonline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--maru-turquoise)] hover:underline"
          >
            Maru Online
          </a>{' '}
          | AI & Automation for SMEs
        </p>
      </footer>
    </div>
  );
}
