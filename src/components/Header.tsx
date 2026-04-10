"use client";

import { useState } from "react";
import { Sun, Moon, Github, Download } from "lucide-react";

interface HeaderProps {
  selectedLogosCount?: number;
  onBatchDownload?: () => void;
}

export default function Header({ selectedLogosCount = 0, onBatchDownload }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="bg-background text-foreground">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1400px' }}>
            <div className="flex items-center h-16">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8">
                    <img 
                      src={isDarkMode ? "/images/logo-light.svg" : "/images/logo-night.svg"} 
                      alt="SVG Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-bold text-xl">酷设计</span>
                </div>
                
                {/* 桌面端菜单 */}
                <div className="hidden md:flex items-center gap-6">
                  <a href="/" className="text-foreground hover:text-primary transition-colors">首页</a>
                  <a href="/about" className="text-foreground hover:text-primary transition-colors">关于我们</a>
                  <a href="/sponsor" className="text-foreground hover:text-primary transition-colors">赞助支持</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">GitHub</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">Twitter</a>
                </div>
              </div>
              
              <div className="ml-auto flex items-center gap-4">
                {selectedLogosCount > 0 && onBatchDownload && (
                  <button
                    onClick={onBatchDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    批量下载 ({selectedLogosCount})
                  </button>
                )}
                <a 
                  href="https://github.com/xmbsm/kulogo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {/* 移动端菜单按钮 */}
                <button 
                  className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* 移动端菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 border-t border-border bg-background shadow-lg z-40">
              <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3" style={{ maxWidth: '1400px' }}>
                <a href="/" className="block py-2 text-foreground hover:text-primary transition-colors">首页</a>
                <a href="/about" className="block py-2 text-foreground hover:text-primary transition-colors">关于我们</a>
                <a href="/sponsor" className="block py-2 text-foreground hover:text-primary transition-colors">赞助支持</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block py-2 text-foreground hover:text-primary transition-colors">GitHub</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block py-2 text-foreground hover:text-primary transition-colors">Twitter</a>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
