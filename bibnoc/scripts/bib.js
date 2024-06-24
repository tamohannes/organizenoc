class Bib {
    async init(notion) {
        try {
            this.notion = notion;
        } catch (err) {
            document.getElementById("error").innerHTML = err;
            console.log(err);
        }
    }

    async export() {
        try {
            document.getElementById("add_button").classList.add("is-loading");

            this.project_id = document.getElementById("project_select");
            this.project_title = this.project_id.options[this.project_id.selectedIndex].text;
            console.log(this.project_title);

            let papers = await this.notion.getPapersByProject(this.project_title)

            const bibTexs_rich_text = papers.map(item => item.properties.bibTex.rich_text[0]);

            let bibTexs = bibTexs_rich_text.filter(item => item !== undefined && item.plain_text !== "");

            document.getElementById("info").innerHTML = "Exporting " + bibTexs.length + " out of " + papers.length + " papers to clipboard";

            console.log(bibTexs);

            let bibTex = bibTexs.map(item => item.plain_text).join("\n\n")

            navigator.clipboard.writeText(bibTex).then(function () {
                document.getElementById("add_button").classList.remove("is-loading");
                document.getElementById("add_button").innerHTML = '<i class="fas fa-check-circle"></i>';

            })

            setTimeout(() => {
                window.close();
            }, 1500);
        } catch (err) {
            console.log(err);
        }
    }



}
