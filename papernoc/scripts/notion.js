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

  async getProjects() {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${this.databaseId}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${this.authToken}`,
          "Notion-Version": "2021-05-13",
        }),
      }
    ).catch((err) => console.log(err));
    const searchResultData = await response.json();
    return searchResultData["properties"]["Project"]["select"]["options"];
  }

  async getActiveProjects() {
    let projects = await this.getProjects();
    return projects.filter(item => item.color === 'green')
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

  async writePaperMetadataToDatabase(metadata) {
    let requestBody = {
      parent: { type: "database_id", database_id: this.databaseId },
      properties: {
        Title: {
          type: "title",
          title: [{ type: "text", text: { content: metadata["title"] } }],
        },
        Abstract: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["abstract"] } },
          ],
        },
        Authors: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["authors"].join(", ") } },
          ],
        },
        bibKey: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["bib_key"] } },
          ],
        },
        bibTex: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["bib_tex"] } },
          ],
        },
        doi: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["doi"] } },
          ],
        },
        URL: {
          type: "url",
          url: metadata["paper_link"],
        },
        "Published Date": {
          type: "date",
          date: { start: metadata["published_date"] },
        },
      },
    };

    if (metadata["project_id"] !== "") {
      requestBody["properties"]["Project"] = {
        type: "select",
        select: { id: metadata["project_id"] },
      };
    }

    await fetch("https://api.notion.com/v1/pages/", {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      }),
      body: JSON.stringify(requestBody),
    }).catch((err) => {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    });
  }

  async updatePaperMetadataToDatabase(metadata, paper_id) {
    let requestBody = {
      properties: {
        Title: {
          type: "title",
          title: [{ type: "text", text: { content: metadata["title"] } }],
        },
        Abstract: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["abstract"] } },
          ],
        },
        Authors: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["authors"].join(", ") } },
          ],
        },
        bibKey: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["bib_key"] } },
          ],
        },
        bibTex: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["bib_tex"] } },
          ],
        },
        doi: {
          type: "rich_text",
          rich_text: [
            { type: "text", text: { content: metadata["doi"] } },
          ],
        },
        URL: {
          type: "url",
          url: metadata["paper_link"],
        },
        "Published Date": {
          type: "date",
          date: { start: metadata["published_date"] },
        },
      },
    };

    await fetch(`https://api.notion.com/v1/pages/${paper_id}`, {
      method: "PATCH",
      headers: new Headers({
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      }),
      body: JSON.stringify(requestBody),
    }).catch((err) => {
      document.getElementById("error").innerHTML = err;
      console.log(err);
    });
  }
}
