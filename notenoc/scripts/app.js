async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

document.addEventListener("DOMContentLoaded", async () => {
  const tab = await getCurrentTab();

  const platform = Platform.get_platform(tab.url);
  await platform.init(tab.url);

  const notion = new Notion();
  await notion.init();

  const paper = new Paper();
  await paper.init(notion, platform.metadata);

  try {
    let storage_values = await chrome.storage.sync.get({
      default_documents_dir: "",
    });

    default_papers_full_dir = pathJoin([
      storage_values.default_documents_dir,
      paper.get_project(),
      new URL(platform.metadata["pdf_link"]).pathname.split("/").pop(),
    ]);
    document.getElementById("document_path").value = default_papers_full_dir;
    document.getElementById("page_title").value = platform.metadata["title"];

    document.getElementById("add_button").addEventListener("click", () => {
      paper.add_notes();
    });
  } catch (err) {
    document.getElementById("error").innerHTML = err;
    console.log(err);
  }
});
