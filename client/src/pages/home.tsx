import { TranslationInterface } from "@/components/translation-interface";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl character-bounce" data-testid="header-icon">💝</span>
            <h1 className="text-xl font-bold text-gray-800 font-korean" data-testid="header-title">다정한 번역기</h1>
          </div>
          <a 
            href="https://kindtool.ai/" 
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
            data-testid="link-home"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium font-korean text-sm">홈으로</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <h2 className="text-3xl font-bold text-gray-800 font-korean" data-testid="hero-title">다정한 번역기</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed font-korean" data-testid="hero-description">
            겉으로는 거칠지만, 사실은 따뜻한 마음을 번역합니다.
          </p>
        </div>

        {/* Translation Interface */}
        <TranslationInterface />
      </main>

      <Footer />
    </div>
  );
}
