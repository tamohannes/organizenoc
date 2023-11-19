from typing import Dict, List, Tuple

import fitz

CONTENT_TYPES: List[str] = ["Highlight", "Underline"]

RGB_TO_NAME: Dict[tuple, str] = {
    (249, 205, 89): "yellow",
    (124, 200, 103): "green",
    (105, 175, 240): "blue",
    (251, 91, 137): "red",
    (200, 133, 218): "purple",
}

DEBUG_MODE = False


class Document:
    def __init__(self) -> None:
        self.area_matching_threshold = 2
        if DEBUG_MODE:
            import matplotlib.pyplot as plt
            from matplotlib.patches import Rectangle

            self.fig, self.ax = plt.subplots()
            self.ax.plot([0, 500], [0, 500])

    def get_notes(self, document_path: str) -> Dict[str, List]:
        document = fitz.open(document_path)

        document_highlights = {}
        for page in document:
            highlights = self.handle_page(page)
            if highlights:
                document_highlights[str(page.number)] = highlights

        return document_highlights

    def handle_page(self, page):
        self.wordlist: List[
            Tuple[float, float, float, float, str, int, int, int]
        ] = page.get_text(
            "words"
        )  # list of words on page

        highlights = []
        annot = page.first_annot
        while annot:
            _, annot_name = annot.type
            if annot_name in CONTENT_TYPES:
                content, y_pos = self._parse_highlight(annot)
                highlights.append(
                    {
                        "type": annot_name,
                        "content": content,
                        "y_pos": y_pos,
                        "color": RGB_TO_NAME[
                            tuple(int(i * 255) for i in annot.colors["stroke"])
                        ],
                    }
                )

            annot = annot.next
        highlights_sorted = sorted(highlights, key=lambda x: x["y_pos"])
        return highlights_sorted

    def _parse_highlight(
        self,
        annot: fitz.Annot,
    ) -> str:
        points = annot.vertices
        quad_count = int(len(points) / 4)
        sentences = []
        words = None

        for i in range(quad_count):
            # where the highlighted part is
            r = fitz.Quad(points[i * 4 : i * 4 + 4]).rect
            r_height = r.y1 - r.y0
            if DEBUG_MODE:
                self.plot_yellow(r)

            contd_index = self.wordlist.index(words[-1]) + 1 if words else 0
            words = []

            for w in self.wordlist[contd_index:]:
                wr = fitz.Rect(w[:4])
                # trim word height
                wr.y0 += (wr.y1 - wr.y0) - r_height

                if wr.intersects(r):
                    words.append(w)
                    if DEBUG_MODE:
                        self.plot_blue(wr)

            sentences.append(" ".join(w[4] for w in words))
        sentence = " ".join(sentences)
        return sentence, r.y0

    # debug method
    def _plot_yellow(self, r):
        self.ax.add_patch(
            Rectangle((r.x0, r.y0), r.x1 - r.x0, r.y1 - r.y0, facecolor="yellow")
        )

    # debug method
    def _plot_blue(self, wr):
        self.ax.sadd_patch(
            Rectangle(
                (wr.x0, wr.y0),
                wr.x1 - wr.x0,
                wr.y1 - wr.y0,
                facecolor="#0000ff8c",
            )
        )
        plt.savefig("./highlight_map.png")
