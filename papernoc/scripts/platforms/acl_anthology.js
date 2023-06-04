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
        const file_id = this.parseFileIDFromURL();
        const file_url = await this.getXMLFromFileID(file_id);
        const xml = await this.getXMLFromFileURL(file_url);
        const paperdata = this.getPaperData(xml);
        const metadata = this.getMetadataFromXML(paperdata);

        metadata["published_date"] = this.getPaperPublicationDate(xml);
        return metadata;
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

    async getXMLFromFileID(file_id) {
        const file_url = `https://api.github.com/repos/acl-org/acl-anthology/contents/data/xml/${file_id}.xml`
        const resp = await fetch(file_url)
        const json = await resp.json();
        return json.download_url
    }

    async getXMLFromFileURL(file_url) {
        const resp = await fetch(file_url)
        const text = await resp.text()
        const data = new window.DOMParser().parseFromString(text, "text/xml")
        return data
    }

    getPaperData(xml) {
        const paper_info = this.parsePaperInfoFromURL();

        return xml.evaluate(
            `/collection/volume[@id="${paper_info['venue']}"]/paper[@id="${paper_info['id']}"]`,
            xml,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        ).singleNodeValue
    }

    getPaperPublicationDate(xml) {
        const paper_info = this.parsePaperInfoFromURL();

        return xml.evaluate(
            `/collection/volume[@id="${paper_info['venue']}"]`,
            xml,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        ).singleNodeValue.getAttribute("ingest-date")
    }

    getMetadataFromXML(xml) {
        let metadata = {
            authors: [],
            categories: [],
        };

        xml.childNodes.forEach((entry) => {
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
                    metadata["bibkey"] = entry.innerHTML
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
