export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4 text-sm text-gray-600">
            <a 
              href="https://kindtoolai.replit.app/about" 
              className="hover:text-primary transition-colors font-korean"
              data-testid="footer-link-about"
            >
              사이트 소개
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="https://kindtoolai.replit.app/disclaimer" 
              className="hover:text-primary transition-colors font-korean"
              data-testid="footer-link-disclaimer"
            >
              면책조항
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="https://kindtoolai.replit.app/privacy-policy" 
              className="hover:text-primary transition-colors font-korean"
              data-testid="footer-link-privacy"
            >
              개인정보처리방침
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="https://kindtoolai.replit.app/terms-of-service" 
              className="hover:text-primary transition-colors font-korean"
              data-testid="footer-link-terms"
            >
              이용약관
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="https://kindtoolai.replit.app/contact" 
              className="hover:text-primary transition-colors font-korean"
              data-testid="footer-link-contact"
            >
              문의하기
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-gray-500 text-sm font-korean">
            © 2025 KindTool.ai - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
