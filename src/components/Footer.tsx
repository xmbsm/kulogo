"use client";

interface FooterProps {
  isDarkMode?: boolean;
}

export default function Footer({ isDarkMode = false }: FooterProps) {

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 mt-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1400px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 左侧信息 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8">
                <img 
                  src={isDarkMode ? "/images/logo-light.svg" : "/images/logo-night.svg"} 
                  alt="酷设计" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl">酷设计</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              专注收录国内外矢量 LOGO，为设计师和开发者提供高质量的品牌标识资源。
            </p>
            <p className="text-muted-foreground text-xs">
              © 2024-2026 . 由 🎨 乔同学 整理
            </p>
          </div>
          
          {/* 右侧导航 */}
          <div className="md:text-right">
            <div className="md:inline-block md:text-left">
              <h3 className="font-semibold text-lg mb-4">导航</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">首页</a>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">关于</a>
                <a href="/sponsor" className="text-muted-foreground hover:text-primary transition-colors">赞助支持</a>
                <a href="https://github.com/xmbsm/kulogo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">提交</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部链接 */}
        <div className="border-t border-border pt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>菜单一</span>
            <span>菜单一</span>
            <span>菜单一</span>
            <span>菜单一</span>
            <span>菜单一</span>
            <span>菜单一</span>
            <span>菜单一</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
