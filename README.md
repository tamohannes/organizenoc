# OrganizeNoc 🗂️

OrganizeNoc is a suite of extensions designed to elevate researchers' experiences in field exploration, facilitating the seamless addition, querying, and extraction of insights from papers.

This collection of extensions empowers researchers to effortlessly incorporate and update paper information in their Notion database, streamlining the process of keeping all academic materials neatly organized in one centralized location.

OrganizeNoc consists of three extensions: PaperNoc, NoteNoc, and FindingNoc. These extensions offer convenient features for researchers, including:
- Extracting all metadata (title, authors, abstract, bibKey, etc.) from a research paper and saving it in a Notion database.
- Downloading the PDF of the paper and automatically extracting any highlights made on the document to the Notion database.
- Querying questions about the paper using GPT and storing the responses in the Notion database.

While the extensions can be used independently, we highly recommend using all of them together for the optimal user experience. When used in conjunction, the extensions provide a seamless and efficient way to manage research paper information in Notion.


## PaperNoc 📚

This extension enables users to easily add and update `arXiv` and `ACL Anthology` paper information in their Notion database, streamlining the process of managing academic materials and keeping all research-related information in one centralized location.

<img alt="papernoc demostration" src="demos/papernoc_demo.gif"/>

## NoteNoc 📝

This extension allows users to extract highlights from a PDF file, which can be downloaded using the papernoc extension, and automatically add them to their Notion database. This feature provides a convenient and efficient way to manage research-related information in one centralized location.

<img alt="notenoc demostration" src="demos/notenoc_demo.gif"/>

## FindingNoc 🔍

This extension empowers users to pose questions about the paper, leveraging LlamIndex's ArxivToolSpec module. The responses to these queries will be neatly organized and stored in the body of the paper item.

<img alt="findingnoc demostration" src="demos/findingnoc_demo.gif"/>


# Setup steps 🐾

To set up the backend server:

- Navigate to the `server` directory.
- Run `pip install -r requirements.txt` to install the necessary requirements.
- Once the requirements are installed, start the server by running the following command: `uvicorn main:app --reload --port 8214`.

To set up papernoc and notenoc:

- Create a new integration app in Notion and give it a name of your choice. For example, you could name it `papernoc`. You can create a new integration app at https://www.notion.so/my-integrations.
- Copy the `Integration Token` that is provided, as you will need it later.
- Navigate to your Notion database and click on `three dots -> connections -> papernoc` to grant the integration permission to add and modify content in the database.
- Create a `keys.js` file in the resources directory and fill in the integration key (copied earlier) and the database ID. An example file for this is provided in `keys-example.js`.
