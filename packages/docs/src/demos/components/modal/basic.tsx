import React, { useState } from "react";

/**
 * Modal 兼容性最小样例
 */
function ModalBasicDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setVisible(true)}>
        打开 Modal
      </button>
      {visible ? (
        <div role="dialog" aria-modal="true">
          <p>这是 Modal 最小样例内容。</p>
          <button type="button" onClick={() => setVisible(false)}>
            关闭
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ModalBasicDemo;
