import React from "react";
import { demoRegistry } from "../../demos/registry";

type DemoId = keyof typeof demoRegistry;

interface DemoRendererProps {
  demoId: string;
}

interface DemoErrorBoundaryProps {
  demoId: string;
  children: React.ReactNode;
}

interface DemoErrorBoundaryState {
  hasError: boolean;
}

/**
 * 示例渲染错误边界，避免单个 demo 影响整页可用性
 */
class DemoErrorBoundary extends React.Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  state: DemoErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DemoErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return <p>示例渲染失败：{this.props.demoId}，请检查组件实现。</p>;
    }
    return this.props.children;
  }
}

/**
 * 按 id 懒加载并渲染真实 demo
 */
export default function DemoRenderer({ demoId }: DemoRendererProps) {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    const entry = demoRegistry[demoId as DemoId];
    if (!entry) {
      setLoadError(true);
      return;
    }

    let active = true;
    entry
      .load()
      .then((mod) => {
        if (!active) {
          return;
        }
        setComponent(() => mod.default);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, [demoId]);

  if (loadError) {
    return <p>示例加载失败：{demoId}，请确认 demo id 与实现是否匹配。</p>;
  }

  if (!Component) {
    return <p>示例加载中...</p>;
  }

  return (
    <DemoErrorBoundary demoId={demoId}>
      <Component />
    </DemoErrorBoundary>
  );
}
