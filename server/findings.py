import configparser

import openai
from llama_index.tools.arxiv import ArxivToolSpec
from llama_index.agent.openai import OpenAIAgent

config = configparser.ConfigParser()
config.read("config.ini")

openai.api_key = config["OPENAI"]["api_key"]


class Finder:
    def __init__(self) -> None:
        arxiv_tool = ArxivToolSpec()
        self.agent = OpenAIAgent.from_tools(
            arxiv_tool.to_tool_list(),
            verbose=True,
        )

    def get_findings(self, item):
        self.prompt = item.prompt.replace("<PAPER>", item.paper_title)
        output = self.agent.chat(self.prompt)
        return output.response
