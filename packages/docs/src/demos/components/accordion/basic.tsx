import React from "react";

/**
 * Accordion 基础示例（Web 最小可运行版本）
 */
function AccordionBasicDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        {open ? "收起" : "展开"}第一项
      </button>
      {open ? <p>这是第一项内容。</p> : null}
    </section>
  );
}

export default AccordionBasicDemo;
