class Notion {
  async init() {
    try {
      this.authToken = notion_key;
      this.databaseId = notion_database_id;

      document.getElementById("notion_tag").classList.add("is-success");
      document.getElementById("notion_tag").classList.remove("is-danger");
    } catch (err) {
      document.getElementById("notion_tag").classList.add("is-danger");
      document.getElementById("notion_tag").classList.remove("is-success");

      document.getElementById("error").innerHTML = err;
      console.log(err);
    }
  }

  async add_notes_to_paper() {
    let document_path = document.getElementById("document_path");
    let page_title = document.getElementById("page_title");

    if (!document_path.value || !page_title.value)
      document.getElementById("error").innerHTML = "fill the inputs";
    else {
      let body = {
        document_path: document_path.value,
        page_title: page_title.value,
      };
      await fetch("http://127.0.0.1:8214/add_note", {
        method: "POST",
        headers: new Headers({
          // "Authorization": "Bearer MY_KEY",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }),
        body: JSON.stringify(body),
      }).catch((err) => {
        document.getElementById("error").innerHTML = err;
      });
    }
  }

  async getPaperByTitle(metadata) {
    let requestBody = {
      filter: {
        property: "URL",
        url: {
          equals: metadata["paper_link"],
        },
      },
    };

    const response = await fetch(
      `https://api.notion.com/v1/databases/${this.databaseId}/query/`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        }),
        body: JSON.stringify(requestBody),
      }
    ).catch((err) => {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    });

    const searchResultData = await response.json();
    let paper = searchResultData["results"][0];

    return paper;
  }
}
