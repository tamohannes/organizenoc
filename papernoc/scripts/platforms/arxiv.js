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
    this.id = this.parseIDFromURL();
    this.xml = await this.getXMLFromID(this.id);

    return this.getMetadataFromXML(this.xml);
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

  keepLowerLettersOnly(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) <= 122 && input.charCodeAt(i) >= 97) {
        output += input.charAt(i);
      }
    }
    return output;
  }

  getBibInfo(metadata) {
    let first_author_surname = metadata["authors"][0].split(" ").pop().toLowerCase()
    let year = metadata["updated_date"].split("-")[0]
    let title_first_word = this.keepLowerLettersOnly(metadata["title"].split(" ")[0].toLowerCase())
    let authors = metadata["authors"].join(" and ")

    let bib_key = `${first_author_surname}${year}${title_first_word}`

    const bib_tex = `@article{${bib_key},
  title={${metadata["title"]}},
  author={${authors}},
  year={${year}},
  eprint={${metadata["paper_id"]}},
  journal={arXiv preprint arXiv:${metadata["paper_id"]}},
}`

    return {
      bib_key: bib_key,
      bib_tex: bib_tex
    }
  }

  getMetadataFromXML(xml) {
    const entries = [...xml.getElementsByTagName("entry")[0].children];
    let metadata = {
      paper_id: this.id,
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

    metadata["bib_tex"] = this.getBibInfo(metadata)["bib_tex"]
    metadata["bib_key"] = this.getBibInfo(metadata)["bib_key"]

    return metadata;
  }

  cleanup(string) {
    return string
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
}
