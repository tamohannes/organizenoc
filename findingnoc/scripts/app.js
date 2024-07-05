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
      documents_root_dir: default_root_dir,
    });

    default_papers_full_dir = pathJoin([
      storage_values.documents_root_dir,
      paper.get_project(),
      `${platform.metadata.bib_key}.pdf`,
    ]);

    document.getElementById("add_button").addEventListener("click", () => {
      paper.add_notes();
    });
  } catch (err) {
    document.getElementById("error").innerHTML = err;
    console.log(err);
  }
});
