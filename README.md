# organizenoc 🗂️

These Chromium extensions enable users to seamlessly add and update research paper information in their Notion database, making it easy to keep track of all their academic materials in one organized location.

Organizenoc currently comprises two extensions: papernoc and notenoc. These extensions offer convenient features for researchers, such as extracting information from a research paper's website and saving it in a Notion database. Additionally, they allow users to download the PDF of the paper and automatically extract any highlights made on the document to the Notion database, neatly organizing all research-related information in one place.

While the extensions can be used separately, we strongly recommend using both of them together for the optimal user experience. When used in conjunction, the extensions provide a seamless and efficient way to manage research paper information in Notion.

## papernoc 📚

This Chromium extension enables users to easily add and update `arXiv` and `ACL Anthology` paper information in their Notion database, streamlining the process of managing academic materials and keeping all research-related information in one centralized location.

<img alt="papernoc demostration" src="demos/papernoc_demo.gif"/>

## notenoc 📔

This Chromium extension allows users to extract highlights from a PDF file, which can be downloaded using the papernoc extension, and automatically add them to their Notion database. This feature provides a convenient and efficient way to manage research-related information in one centralized location.

<img alt="notenoc demostration" src="demos/notenoc_demo.gif"/>

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
