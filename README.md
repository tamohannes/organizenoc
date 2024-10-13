# OrganizeNoc 🗂️

<sub>Crafted with care by a fellow researcher, for researchers like you 😊</sub>

OrganizeNoc is a suite of Chromium extensions designed to elevate researchers' experiences in field exploration, facilitating the seamless addition, querying, and extraction of insights from papers.

This collection of extensions empowers researchers to effortlessly incorporate and update paper information in their Notion database, streamlining the process of keeping all academic materials neatly organized in one centralized location.

OrganizeNoc consists of four extensions: PaperNoc, NoteNoc, FindingNoc and BibNoc. These extensions offer convenient features for researchers, including:
- Extracting all metadata (title, authors, abstract, bibKey, etc.) from a research paper and saving it in a Notion database.
- Downloading the PDF of the paper and automatically extracting any highlights made on the document to the Notion database.
- Querying questions about the paper using GPT and storing the responses in the Notion database.
- Exporting the BibTeX of project papers to have a quick and easy starting point for paper writing.

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

## BibNoc 📦

This extension assists users in quickly starting the paper writing process by easily exporting project papers BibTeX entries.

<img alt="bibnoc demostration" src="demos/bibnoc_demo.gif"/>



# Installation

## Backend Server Setup

Follow these steps to set up the backend server:

1. **Navigate to the Server Directory**: Change your current working directory to the `server` folder.
2. **Install Dependencies**: Execute the following command to install the necessary requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. **Start the Server**: Launch the server by running:
   ```bash
   uvicorn main:app --reload --port 8214
   ```

## Notion Integration

To integrate your Notion database with the extensions, perform the following steps:

1. **Create a Notion Integration App**:
   - Visit [Notion Integrations](https://www.notion.so/my-integrations) and create a new integration app. You can name it something like `organizenoc`.
   - Copy the `Integration Token` provided after creation for later use.

2. **Configure Notion Permissions**:
   - Go to your Notion database, click on `three dots -> connections -> organizenoc` to allow the newly created integration to add and modify content.

3. **Setup Configuration File**:
   - Create a `configs.js` file within the `resources` directory.
   - Populate this file with the `notion_key`, the database ID, the server port (which we set to `8214` earlier) and the other configs as shown in the provided `configs-example.js`.

These steps will ensure a seamless integration of your Notion database with the extensions.

# Safari Support

To enable the use of extensions on Safari, follow these steps to convert each extension into the Safari format:

1. **Install Xcode**: Ensure that Xcode is installed on your macOS machine.
2. **Convert the Extension**: Use the command below to convert your extension to the Safari format. Replace `PATH_TO_AN_EXTENSION` with the actual path to the extension you want to convert:

   ```bash
   xcrun safari-web-extension-converter PATH_TO_AN_EXTENSION
   ```

3. **Build the Extension in Xcode**: An Xcode window will appear after running the command. Build the project for macOS within Xcode.
4. **Enable Unsigned Extensions**:
   - Open Safari and go to `Settings`.
   - Navigate to the `Developer` tab and enable `Allow unsigned extensions`.
5. **Activate the Extension**:
   - In the `Extensions` tab of your settings, you will find your newly available extensions.
   - Activate the desired extensions and start using them in Safari.

Enjoy enhancing your Safari experience with your new extensions!
