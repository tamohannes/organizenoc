async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  return tab;
}

document.addEventListener("DOMContentLoaded", async () => {
  let notion = new Notion();
  await notion.init();

  const bib = new Bib();
  await bib.init(notion);

  try {
    let projects = await notion.getActiveProjects();
    projects.forEach((elem) => {
      let newOption = document.createElement("option");
      let optionText = document.createTextNode(elem['name']);
      newOption.appendChild(optionText);
      newOption.setAttribute("value", elem['id']);

      document.getElementById("project_select").appendChild(newOption);
    });
    document.getElementById("projects_list").style.display = "";

    document.getElementById("add_button").style.display = "";
    document.getElementById("add_button").addEventListener("click", () => {
      bib.export();
    });
    document.getElementById("progress_bar").style.display = "none";
  } catch (err) {
    document.getElementById("error").innerHTML = err;
    console.log(err);
  }
});
