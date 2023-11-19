class Notion {
  async init() {
    try {
      this.authToken = notion_key;
      this.databaseId = notion_database_id;
      this.serverPort = server_port

      document.getElementById("notion_tag").classList.add("is-success");
      document.getElementById("notion_tag").classList.remove("is-danger");
    } catch (err) {
      document.getElementById("notion_tag").classList.add("is-danger");
      document.getElementById("notion_tag").classList.remove("is-success");

      document.getElementById("error").innerHTML = err;
      console.log(err);
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

  async add_findings_to_paper(metadata, paper_id) {
    let prompt = document.getElementById("prompt");

    if (!prompt.value)
      document.getElementById("error").innerHTML = "fill the prompt";
    else {
      let body = {
        paper_title: metadata.title,
        prompt: prompt.value
      };
      await fetch(`http://127.0.0.1:${this.serverPort}/get_findings`, {
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
}
