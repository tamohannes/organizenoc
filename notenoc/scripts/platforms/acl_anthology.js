const acl_anthology_origin = "https://aclanthology.org";


class ACLAnthology extends Platform {
    static isValidURL(tab_url) {
        let is_valid = ACLAnthology._isValidURL(tab_url);
        if (is_valid) {
            document.getElementById("aclanthology_tag").classList.add("is-success");
            document.getElementById("aclanthology_tag").classList.remove("is-danger");

            document.getElementById("add_button").disabled = false;
            document.getElementById("arxiv_tag").style.display = "none";
        }
        return is_valid
    }

    static _isValidURL(tab_url) {
        const u = new URL(tab_url);
        if (u.origin == acl_anthology_origin) {
            return true;
        } else {
            return false;
        }
    }

    async getMetadata() {
        this.file_id = this.parseFileIDFromURL();
        this.file_url = await this.getXMLFromFileID();
        this.xml = await this.getXMLFromFileURL();
        this.paper_info = await this.parsePaperInfoFromURL();
        this.paperdata = this.getPaperData();

        return this.getMetadataFromXML();
    }

    parsePaperInfoFromURL() {
        const u = new URL(this.tab_url);
        const keys = u.pathname.split("/")[1].split("-")[1]

        return {
            "id": keys.split(".")[1],
            "venue": keys.split(".")[0],
        }
    }

    parseFileIDFromURL() {
        const u = new URL(this.tab_url);
        return u.pathname.split("/")[1].split("-")[0]
    }

    async getXMLFromFileID() {
        const file_url = `https://api.github.com/repos/acl-org/acl-anthology/contents/data/xml/${this.file_id}.xml`
        const resp = await fetch(file_url)
        const json = await resp.json();
        return json.download_url
    }

    async getXMLFromFileURL() {
        const resp = await fetch(this.file_url)
        const text = await resp.text()
        const data = new window.DOMParser().parseFromString(text, "text/xml")
        return data
    }

    getPaperData() {
        return this.xml.evaluate(
            `/collection/volume[@id="${this.paper_info['venue']}"]/paper[@id="${this.paper_info['id']}"]`,
            this.xml,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        ).singleNodeValue
    }

    getPaperPublicationDate() {
        return this.xml.evaluate(
            `/collection/volume[@id="${this.paper_info['venue']}"]`,
            this.xml,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        ).singleNodeValue.getAttribute("ingest-date")
    }

    getMetadataFromXML() {
        let metadata = {
            authors: [],
            categories: [],
        };

        this.paperdata.childNodes.forEach((entry) => {
            switch (entry.tagName) {
                case "title":
                    metadata["title"] = this.cleanup_title(entry.innerHTML);
                    break;
                case "abstract":
                    metadata["abstract"] = this.cleanup(entry.innerHTML);
                    break;
                case "author":
                    metadata["authors"].push(this.cleanup_author(entry.innerHTML));
                    break;
                case "bibkey":
                    metadata["bib_key"] = entry.innerHTML
                    metadata["bib_tex"] = ""
                    break;
                case "doi":
                    metadata["doi"] = entry.innerHTML
                    break;
                case "url":
                    metadata["paper_link"] = `${acl_anthology_origin}/${entry.innerHTML}`;
                    metadata["pdf_link"] = `${acl_anthology_origin}/${entry.innerHTML}.pdf`;
                    break;
            }
        });

        metadata["published_date"] = this.getPaperPublicationDate(this.xml);

        return metadata;
    }

    cleanup_author(string) {
        return string.replace("</first><last>", " ").replace("<first>", "").replace("</last>", "")
    }

    cleanup_title(string) {
        return string.split("<fixed-case>").join("").split("</fixed-case>").join("")
    }

    cleanup(string) {
        return string
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/\s+/g, " ")
            .trim();
    }
}
