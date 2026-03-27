import React, { useState } from "react";

/**
 * Toast 兼容性最小样例
 */
function ToastBasicDemo() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setShow(true)}>
        显示 Toast
      </button>
      {show ? (
        <div role="status" aria-live="polite">
          <span>这是 Toast 最小样例消息。</span>
          <button type="button" onClick={() => setShow(false)}>
            关闭
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ToastBasicDemo;
