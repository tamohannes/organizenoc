class Platform {
    async init(tab_url) {
        try {
            this.tab_url = tab_url;
            this.metadata = await this.getMetadata();
        } catch (err) {
            document.getElementById("error").innerHTML = err;
            console.log(err);
        }
    }

    static get_platform(tab_url) {
        if (tab_url != null) {
            if (ArXiv.isValidURL(tab_url)) {
                return new ArXiv(tab_url)
            } else if (ACLAnthology.isValidURL(tab_url)) {
                return new ACLAnthology(tab_url)
            }
        } else {
            return null
        }
    }

    async getMetadata() {
        throw new Error("Method not implemented");
    }

    cleanup(string) {
        return string
            .replace(/(\r\n|\n|\r)/gm, " ")
            .replace(/\s+/g, " ")
            .trim();
    };
}
