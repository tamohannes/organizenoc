const arxiv_origin = "https://arxiv.org";

class ArXiv extends Platform {
  static isValidURL(tab_url) {
    let is_valid = ArXiv._isValidURL(tab_url);
    if (is_valid) {
      document.getElementById("arxiv_tag").classList.add("is-success");
      document.getElementById("arxiv_tag").classList.remove("is-danger");

      document.getElementById("add_button").disabled = false;
      document.getElementById("aclanthology_tag").style.display = "none";
    }
    return is_valid
  }

  static _isValidURL(tab_url) {
    const u = new URL(tab_url);
    if (u.origin == arxiv_origin) {
      const pathname_split = u.pathname.split("/");
      if (pathname_split.length == 3) {
        if (pathname_split[1] == "pdf") {
          return true;
        } else if (pathname_split[1] == "abs") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async getMetadata() {
    const id = this.parseIDFromURL();
    const xml = await this.getXMLFromID(id);
    const metadata = this.getMetadataFromXML(xml);
    return metadata;
  }

  parseIDFromURL() {
    const u = new URL(this.tab_url);
    const pathname_split = u.pathname.split("/");
    if (pathname_split.length == 3) {
      if (pathname_split[1] == "pdf") {
        return pathname_split[2].split(".pdf")[0];
      } else if (pathname_split[1] == "abs") {
        return pathname_split[2];
      } else {
        throw Error("Not a valid paper link!");
      }
    } else {
      throw Error("Not a valid paper link!");
    }
  }

  async getXMLFromID(paper_id) {
    const url = `http://export.arxiv.org/api/query?id_list=${paper_id}`;
    const resp = await fetch(url);
    const str = await resp.text();
    const data = new window.DOMParser().parseFromString(str, "text/xml");
    return data;
  }

  getMetadataFromXML(xml) {
    const entries = [...xml.getElementsByTagName("entry")[0].children];
    let metadata = {
      authors: [],
      categories: [],
    };

    entries.forEach((entry) => {
      switch (entry.tagName) {
        case "id":
          metadata["paper_link"] = entry.innerHTML;
          break;
        case "updated":
          metadata["updated_date"] = entry.innerHTML;
          break;
        case "published":
          metadata["published_date"] = entry.innerHTML;
          break;
        case "title":
          metadata["title"] = this.cleanup(entry.innerHTML);
          break;
        case "summary":
          metadata["abstract"] = this.cleanup(entry.innerHTML);
          break;
        case "author":
          metadata["authors"].push(entry.children[0].innerHTML);
          break;
        case "link":
          if (entry.attributes.title != undefined) {
            if (entry.attributes.title.value == "pdf") {
              metadata["pdf_link"] = entry.attributes.href.value + ".pdf";
            }
          }
          break;
        case "arxiv:primary_category":
          metadata["primary_category"] = entry.attributes.term.value;
          break;
        case "category":
          metadata["categories"].push(entry.attributes.term.value);
          break;
      }
    });

    return metadata;
  }

  cleanup(string) {
    return string
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
}
