"use client";

import { useEffect, useRef } from 'react';
import { config } from '../config';

interface GoogleAdsProps {
  className?: string;
}

export default function GoogleAds({ className = '' }: GoogleAdsProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 检查是否开启了谷歌广告
    if (!config.ads.google.enabled || !config.ads.google.clientId || !config.ads.google.slotId) {
      return;
    }

    // 加载谷歌广告脚本
    if (!window.googletag) {
      window.googletag = window.googletag || {};
      window.googletag.cmd = window.googletag.cmd || [];
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ads.google.clientId}`;
      document.head.appendChild(script);

      // 初始化谷歌广告
      window.googletag.cmd.push(() => {
        window.googletag.defineSlot(
          `/21877759777/${config.ads.google.slotId}`,
          [[300, 250], [336, 280], [728, 90], [300, 600], [160, 600]],
          adRef.current?.id || ''
        )?.addService(window.googletag.pubads());
        window.googletag.pubads().enableSingleRequest();
        window.googletag.enableServices();
      });
    } else {
      // 如果已经加载了谷歌广告脚本，直接显示广告
      window.googletag.cmd.push(() => {
        window.googletag.display(adRef.current?.id || '');
      });
    }
  }, []);

  // 如果没有开启广告，不渲染任何内容
  if (!config.ads.google.enabled || !config.ads.google.clientId || !config.ads.google.slotId) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      id={`google-ad-${Math.random().toString(36).substr(2, 9)}`}
      className={`google-ad ${className}`}
      style={{
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        position: 'relative'
      }}
    >
      {/* 广告标签 */}
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        backgroundColor: '#f1f3f4',
        color: '#5f6368',
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #dadce0',
        fontWeight: '500'
      }}>
        广告
      </div>
      {/* 广告将通过谷歌脚本动态插入 */}
    </div>
  );
}
