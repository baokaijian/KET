import runpy
import unittest
from pathlib import Path

importer = runpy.run_path(str(Path(__file__).resolve().parents[2] / "scripts/import-vocabulary-metadata.py"))


class Page:
    width = 600
    height = 800

    def __init__(self, text=""):
        self.text = text

    def crop(self, bounds):
        return self

    def extract_text(self, **kwargs):
        return self.text


class ImportTests(unittest.TestCase):
    def test_pos_qualifiers_and_optional_particles(self):
        parse = importer["parse_entry"]
        self.assertEqual(parse("design (PLANNING) (n)"), ("design", ["n"]))
        self.assertEqual(parse("train (transitive and intransitive) (v)"), ("train", ["v"]))
        self.assertEqual(parse("as well (as) (prep)"), ("as well (as)", ["prep"]))
        self.assertEqual(parse("listen (to) (v)"), ("listen (to)", ["v"]))
        self.assertEqual(parse("yog(h)urt (n)"), ("yog(h)urt", ["n"]))
        self.assertEqual(parse("chips (pl n)"), ("chips", ["pl", "n"]))
        self.assertIsNone(parse("• I like design (n)"))

    def test_all_headings_and_final_page(self):
        pages = [Page() for _ in range(32)]
        pages[3] = Page("it (pron)\nIT (n)\nMay (n)\nmay (mv)\nMiss (n)\nmiss (v)\ndesign (v)\ndesign (DRAWING) (n)\ntrain (n)\ntrain (transitive and intransitive) (v)\nas well (adv)\nas well (as) (prep)\nhat (n)\nunhappy (n)\nwind (n)\nnurse (n)")
        pages[24] = Page("Clothes and Accessories\nhat\nPersonal Feelings, Opinions and Experiences (adjectives)\nunhappy")
        pages[31] = Page("Weather\nwind\nWork and Jobs\nnurse")
        pdf = type("PDF", (), {"pages": pages})()
        entries = importer["extract"](pdf)
        self.assertEqual(entries["it"]["pos"], ["pron"])
        self.assertEqual(entries["IT"]["pos"], ["n"])
        self.assertEqual(entries["May"]["pos"], ["n"])
        self.assertEqual(entries["may"]["pos"], ["mv"])
        self.assertEqual(entries["Miss"]["pos"], ["n"])
        self.assertEqual(entries["miss"]["pos"], ["v"])
        self.assertEqual(entries["design"]["pos"], ["n", "v"])
        self.assertEqual(entries["train"]["pos"], ["n", "v"])
        self.assertEqual(entries["aswell"]["pos"], ["adv"])
        self.assertEqual(entries["aswellas"]["pos"], ["prep"])
        self.assertEqual(entries["hat"]["topics"], ["Clothes and Accessories"])
        self.assertEqual(entries["unhappy"]["topics"], ["Personal Feelings, Opinions and Experiences (adjectives)"])
        self.assertEqual(entries["wind"]["topics"], ["Weather"])
        self.assertEqual(entries["nurse"]["topics"], ["Work and Jobs"])

    def test_topic_aliases_keep_optional_spellings(self):
        self.assertIn("grandad", importer["topic_keys"]("grandad / granddad"))
        self.assertIn("granddad", importer["topic_keys"]("grandad / granddad"))
        self.assertIn("yoghurt", importer["topic_keys"]("yog(h)urt"))
        self.assertIn("yogurt", importer["topic_keys"]("yog(h)urt"))
        self.assertNotIn("ring", importer["topic_keys"]("give somebody a call/ring"))


if __name__ == "__main__":
    unittest.main()
