async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

document.addEventListener("DOMContentLoaded", async () => {
  const tab = await getCurrentTab();

  const arxiv = new ArXiv();
  await arxiv.init(tab.url);
  arxiv.isValidURL();

  const notion = new Notion();
  await notion.init();

  const paper = new Paper();
  await paper.init(notion, arxiv.metadata);

  try {
    let storage_values = await chrome.storage.sync.get({
      default_documents_dir: "",
    });

    console.log(paper.get_project())
    default_papers_full_dir = pathJoin([
      storage_values.default_documents_dir,
      paper.get_project(),
      arxiv.metadata["pdf_link"].split("/pdf/")[1],
    ]);
    document.getElementById("document_path").value = default_papers_full_dir;
    document.getElementById("page_title").value = arxiv.metadata["title"];

    document.getElementById("add_button").addEventListener("click", () => {
      paper.add_notes();
    });
  } catch (err) {
    document.getElementById("error").innerHTML = err;
    console.log(err);
  }
});
