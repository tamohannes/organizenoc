class Paper {
  async init(notion, metadata) {
    try {
      this.notion = notion;
      this.metadata = metadata;

      document.getElementById("add_button").classList.add("is-loading");
      this.paper = await this.notion.getPaperByTitle(this.metadata);
      document.getElementById("add_button").classList.remove("is-loading");
    } catch (err) {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    }
  }

  get_project() {
    return this.paper.properties.Project.select.name;
  }

  async add_notes() {
    try {
      document.getElementById("add_button").classList.add("is-loading");

      await this.notion.add_notes_to_paper();

      document.getElementById("add_button").classList.remove("is-loading");
      document.getElementById("add_button").innerHTML =
        '<i class="fas fa-check-circle"></i>';

      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (e) {
      document.getElementById("error").innerHTML = e;
    }
  }
}
