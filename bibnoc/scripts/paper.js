class Paper {
  async init(notion, metadata) {
    try {
      this.notion = notion;
      this.metadata = metadata;
      this.serverPort = server_port
    } catch (err) {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    }
  }

  async is_present() {
    this.paper = await this.notion.getPaperByTitle(this.metadata);

    return this.paper ? true : false;
  }

  async is_added() {
    console.log(this.paper)

    let selected_project_name =
      document.getElementById("project_select").options[
        document.getElementById("project_select").selectedIndex
      ].text;
    let project_name =
      selected_project_name == "" ? this.get_project() : selected_project_name;


    let storage_values = await chrome.storage.sync.get({
      default_documents_dir: "/Users/user/Downloads",
    });

    let body = {
      file_dir: storage_values.default_documents_dir + "/" + project_name,
      file_name: this.metadata["bib_key"],
      pdf_link: this.metadata["pdf_link"],
    };

    const response = await fetch(`http://127.0.0.1:${this.serverPort}/is_saved`, {
      method: "POST",
      headers: new Headers({
        // "Authorization": "Bearer MY_KEY",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }),
      body: JSON.stringify(body),
    }).catch((err) => {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    });

    const responseData = await response.json();
    return responseData["status"];
  }

  get_title() {
    return this.paper.properties.Title.title[0].plain_text;
  }

  get_id() {
    return this.paper.id;
  }

  get_project() {
    if (this.paper === undefined || this.paper.properties.Project.select === null)
      return ""
    else
      return this.paper.properties.Project.select.name;
  }

  async add() {
    try {
      document.getElementById("add_button").classList.add("is-loading");

      this.metadata["project_id"] =
        document.getElementById("project_select").value;
      await this.notion.writePaperMetadataToDatabase(this.metadata);

      if (document.getElementById("download_paper").checked)
        await this.download();

      document.getElementById("add_button").classList.remove("is-loading");
      document.getElementById("add_button").innerHTML =
        '<i class="fas fa-check-circle"></i>';

      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  }

  async update() {
    try {
      document.getElementById("update_button").classList.add("is-loading");

      await this.notion.updatePaperMetadataToDatabase(
        this.metadata,
        this.get_id()
      );

      if (document.getElementById("download_paper").checked)
        await this.download();

      document.getElementById("update_button").classList.remove("is-loading");
      document.getElementById("update_button").innerHTML =
        '<i class="fas fa-check-circle"></i>';

      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  }

  async download() {
    let selected_project_name =
      document.getElementById("project_select").options[
        document.getElementById("project_select").selectedIndex
      ].text;
    let project_name =
      selected_project_name == "" ? this.get_project() : selected_project_name;

    let storage_values = await chrome.storage.sync.get({
      default_documents_dir: "/Users/user/Downloads",
    });

    let body = {
      file_dir: storage_values.default_documents_dir + "/" + project_name,
      file_name: this.metadata["bib_key"],
      pdf_link: this.metadata["pdf_link"],
    };
    await fetch(`http://127.0.0.1:${this.serverPort}/save_paper`, {
      method: "POST",
      headers: new Headers({
        // "Authorization": "Bearer MY_KEY",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }),
      body: JSON.stringify(body),
    }).catch((err) => {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    });
  }
}
