import React from 'react';

function parseHTML(html) {
  const t = document.createElement('template');
  t.innerHTML = html;
  return <div dangerouslySetInnerHTML={{ __html: t.innerHTML }} />;
}

export { parseHTML };
