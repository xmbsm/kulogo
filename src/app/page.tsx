"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Sun, Moon, Copy, Download, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import JSZip from "jszip";
import { svgs } from "../data/svgs";
import { categories } from "../data/categories";
import type { iSVG } from "../types/svg";
import { cn, getSvgContent, copyToClipboard, downloadFile } from "../lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLogos, setSelectedLogos] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<iSVG | null>(null);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [copyMenuPosition, setCopyMenuPosition] = useState({ x: 0, y: 0 });
  const [currentSvg, setCurrentSvg] = useState<iSVG | null>(null);
  const [copyingSvg, setCopyingSvg] = useState<iSVG | null>(null);
  const [displayedCount, setDisplayedCount] = useState(35); // 默认显示35个logo

  const filteredSvgs = useMemo(() => {
    return svgs.filter((svg) => {
      const matchesSearch =
        svg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svg.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? svg.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // 当搜索或分类变化时，重置显示数量
  useEffect(() => {
    setDisplayedCount(35);
  }, [searchQuery, selectedCategory]);

  const toggleLogoSelection = (id: number) => {
    const newSelected = new Set(selectedLogos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLogos(newSelected);
  };

  const getRoutePath = (route: string | { dark: string; light: string }) => {
    if (typeof route === "string") {
      console.log('Route is string:', route);
      return route;
    }
    const path = isDarkMode ? route.dark : route.light;
    console.log('Route is object, selected path:', path);
    return path;
  };

  const handleCopy = (svg: iSVG, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setCopyMenuPosition({ x: rect.left, y: rect.bottom + 10 });
    setCurrentSvg(svg);
    setCopyingSvg(svg);
    setCopyMenuOpen(true);
  };

  const copySvg = () => {
    if (!copyingSvg) {
      console.error('copyingSvg is null');
      toast.error("复制失败");
      setCopyMenuOpen(false);
      return;
    }
    
    console.log('Copying SVG:', copyingSvg.title);
    
    // 获取实际的SVG内容
    const svgUrl = getRoutePath(copyingSvg.route);
    fetch(svgUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        console.log('SVG content length:', content.length);
        
        // 使用最简单的方法复制
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        let success = false;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          console.error('复制失败:', err);
          success = false;
        }
        
        document.body.removeChild(textArea);
        
        console.log('SVG copy success:', success);
        
        if (success) {
          toast.success(`已复制到剪贴板\n分类: ${copyingSvg.category}\nLogo: ${copyingSvg.title}`);
        } else {
          toast.error("复制失败");
        }
      })
      .catch(error => {
        console.error('获取SVG内容失败:', error);
        toast.error("复制失败");
      })
      .finally(() => {
        setCopyMenuOpen(false);
        setCopyingSvg(null);
      });
  };

  const copyPng = () => {
    if (!copyingSvg) {
      console.error('copyingSvg is null');
      toast.error("复制失败");
      setCopyMenuOpen(false);
      return;
    }
    
    console.log('Copying PNG:', copyingSvg.title);
    
    // 简化PNG复制：先复制SVG，然后提示用户可以转换
    const svgUrl = getRoutePath(copyingSvg.route);
    fetch(svgUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        console.log('SVG content length:', content.length);
        
        // 使用最简单的方法复制
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        let success = false;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          console.error('复制失败:', err);
          success = false;
        }
        
        document.body.removeChild(textArea);
        
        console.log('PNG copy success:', success);
        
        if (success) {
          toast.success(`已复制SVG内容（PNG复制需要通过设计软件转换）\n分类: ${copyingSvg.category}\nLogo: ${copyingSvg.title}`);
        } else {
          toast.error("复制失败");
        }
      })
      .catch(error => {
        console.error('获取SVG内容失败:', error);
        toast.error("复制失败");
      })
      .finally(() => {
        setCopyMenuOpen(false);
        setCopyingSvg(null);
      });
  };

  const handleDownload = async (svg: iSVG) => {
    try {
      const content = await getSvgContent(getRoutePath(svg.route));
      downloadFile(content, `${svg.title}.svg`);
      toast.success("下载成功！");
    } catch (error) {
      toast.error("下载失败");
    }
  };

  const handleBatchDownload = async () => {
    if (selectedLogos.size === 0) {
      toast.warning("请先选择要下载的 Logo");
      return;
    }

    const zip = new JSZip();
    const selectedSvgs = svgs.filter((svg) => selectedLogos.has(svg.id));
    let successCount = 0;

    for (const svg of selectedSvgs) {
      try {
        console.log('Processing SVG for batch download:', svg.title);
        const routePath = getRoutePath(svg.route);
        console.log('Route path:', routePath);
        
        // 直接使用fetch获取SVG内容
        const response = await fetch(routePath);
        console.log('Response status for', svg.title, ':', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const content = await response.text();
        console.log('SVG content length for', svg.title, ':', content.length);
        
        if (content.length > 0) {
          zip.file(`${svg.title}.svg`, content);
          successCount++;
        } else {
          console.error(`Empty SVG content for ${svg.title}`);
        }
      } catch (error) {
        console.error(`Failed to add ${svg.title} to zip`, error);
      }
    }

    if (successCount === 0) {
      toast.error("无法获取任何Logo内容，下载失败");
      return;
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      console.log('Zip generated, size:', content.size);
      
      if (content.size === 0) {
        toast.error("压缩包为空，下载失败");
        return;
      }
      
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "svg-logos.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`已下载 ${successCount} 个 Logo！`);
      setSelectedLogos(new Set());
    } catch (error) {
      console.error('Failed to generate zip file:', error);
      toast.error("压缩包生成失败");
    }
  };

  const openModal = (svg: iSVG) => {
    setSelectedLogo(svg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLogo(null);
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", isDarkMode ? "dark" : "")}>
      <div className="min-h-screen bg-background text-foreground">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SV</span>
                </div>
                <span className="font-bold text-xl">SVG Logo</span>
              </div>
              <div className="flex items-center gap-4">
                {selectedLogos.size > 0 && (
                  <button
                    onClick={handleBatchDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    批量下载 ({selectedLogos.size})
                  </button>
                )}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SVG Logo 素材库
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              专注收录国内矢量 Logo 的开源站点，支持在线浏览、检索、复制与下载
            </p>
          </div>

          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="搜索 Logo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-accent border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent hover:bg-accent/80"
                )}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent hover:bg-accent/80"
                  )}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {filteredSvgs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground text-lg">
                没有找到匹配的 Logo
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filteredSvgs.slice(0, displayedCount).map((svg) => (
                    <motion.div
                      key={svg.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group"
                    >
                      <div
                        className="relative bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => openModal(svg)}
                      >
                        <div className={cn(
                          "absolute top-2 right-2 transition-opacity z-10",
                          selectedLogos.has(svg.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLogoSelection(svg.id);
                            }}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                              selectedLogos.has(svg.id)
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border hover:border-primary"
                            )}
                          >
                            {selectedLogos.has(svg.id) && (
                              <div className="w-2 h-2 bg-current rounded-full" />
                            )}
                          </button>
                        </div>

                        <div className="aspect-square flex items-center justify-center mb-3">
                          <img
                            src={getRoutePath(svg.route)}
                            alt={svg.title}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="font-medium text-sm truncate">{svg.title}</h3>
                          <p className="text-xs text-muted-foreground">{svg.category}</p>
                        </div>

                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(svg, e);
                            }}
                            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(svg);
                            }}
                            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {displayedCount < filteredSvgs.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setDisplayedCount(prev => Math.min(prev + 35, filteredSvgs.length))}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  >
                    加载更多 ({filteredSvgs.length - displayedCount} 个)
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="border-t border-border py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
            <p>SVG Logo 素材库 - 开源项目</p>
          </div>
        </footer>

        <AnimatePresence>
          {isModalOpen && selectedLogo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-card border border-border rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <div className="aspect-square max-w-xs mx-auto mb-6 flex items-center justify-center bg-accent/30 rounded-xl">
                    <img
                      src={getRoutePath(selectedLogo.route)}
                      alt={selectedLogo.title}
                      className="max-w-full max-h-full object-contain p-8"
                    />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{selectedLogo.title}</h2>
                  <p className="text-muted-foreground mb-4">{selectedLogo.category}</p>
                  
                  {selectedLogo.url && selectedLogo.url !== "TODO" && (
                    <a
                      href={selectedLogo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
                    >
                      访问官网
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}

                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(selectedLogo, e);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Copy className="w-5 h-5" />
                      复制
                    </button>
                    <button
                      onClick={() => handleDownload(selectedLogo)}
                      className="flex items-center gap-2 px-6 py-3 bg-accent rounded-xl hover:bg-accent/80 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      下载 SVG
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {copyMenuOpen && currentSvg && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCopyMenuOpen(false)}
                className="fixed inset-0 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'fixed',
                  left: copyMenuPosition.x,
                  top: copyMenuPosition.y,
                  zIndex: 50
                }}
                className="bg-card border border-border rounded-lg shadow-lg p-1 min-w-[150px]"
              >
                <button
                  onClick={copySvg}
                  className="w-full px-4 py-2 text-left rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  复制 SVG
                </button>
                <button
                  onClick={copyPng}
                  className="w-full px-4 py-2 text-left rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  复制 PNG
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
