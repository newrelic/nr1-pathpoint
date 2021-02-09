function parseHTML(html) {
  var t = document.createElement("template");
  t.innerHTML = html;
  return <div dangerouslySetInnerHTML={{ __html: t.innerHTML }} />;
}

export { parseHTML };
