import React, { type ComponentType, useEffect, useState } from 'react';
import { demoRegistry } from '../../demos/registry';

type DemoId = keyof typeof demoRegistry;

interface DemoRendererProps {
  demoId: string;
}

/**
 * 按 id 懒加载并渲染真实 demo
 */
export default function DemoRenderer({ demoId }: DemoRendererProps) {
  const [LoadedDemoComponent, setLoadedDemoComponent] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 切换或重试 demo 时，先清理上一次状态，避免错误状态残留
    setLoadedDemoComponent(null);
    setLoadError(false);
    setLoadErrorMessage(null);

    // 某些 RN 生态依赖在浏览器运行时会读取 process.env
    // docs 端兜底注入最小 polyfill，避免 ReferenceError: process is not defined
    if (typeof window !== 'undefined') {
      const globalWithProcess = globalThis as any;
      if (typeof globalWithProcess.__DEV__ === 'undefined') {
        globalWithProcess.__DEV__ = true;
      }
      if (!globalWithProcess.global) {
        globalWithProcess.global = globalWithProcess;
      }
      if (!globalWithProcess.process) {
        globalWithProcess.process = { env: {} };
      } else if (!globalWithProcess.process.env) {
        globalWithProcess.process.env = {};
      }
    }

    const entry = demoRegistry[demoId as DemoId];
    if (!entry) {
      setLoadError(true);
      setLoadErrorMessage('未在 demoRegistry 中找到对应 id');
      return;
    }

    let active = true;
    entry
      .load()
      .then((mod) => {
        if (!active) {
          return;
        }
        setLoadError(false);
        setLoadErrorMessage(null);
        setLoadedDemoComponent(() => mod.default);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[DemoRenderer] 加载 demo 失败: ${demoId}`, error);
        setLoadError(true);
        setLoadErrorMessage(message);
      });

    return () => {
      active = false;
    };
  }, [demoId]);

  if (loadError) {
    return (
      <p>
        示例加载失败：{demoId}
        {loadErrorMessage ? `（${loadErrorMessage}）` : '，请确认 demo id 与实现是否匹配。'}
      </p>
    );
  }

  if (!LoadedDemoComponent) {
    return <p>示例加载中...</p>;
  }

  return <LoadedDemoComponent />;
}
