"""Extract factual POS and topic metadata from the Cambridge August 2025 PDF."""
import json
import re
import sys
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
POS = r"(?:prep phr|phr v|abbrev|exclam|conj|pron|prep|adj|adv|det|av|mv|n|pl|sing|v)"
ENTRY = re.compile(rf"^(.+?)\s*\(((?:unc\s+)?{POS}\b[^)]*)\)")
HEADINGS = {
    "Clothes", "Colours", "Communication and Technology", "Documents and Texts",
    "Education", "Entertainment and Media", "Family and Friends", "Food and Drink",
    "Health, Medicine and Exercise", "Hobbies and Leisure", "House and Home",
    "Measurements", "Personal Feelings, Opinions and Experiences", "Places: Buildings",
    "Places: Countryside", "Places: Town and City", "Services", "Shopping", "Sport",
    "The Natural World", "Time", "Travel and Transport", "Work and Jobs",
}


def key(text):
    text = re.sub(r"\s*\((?:cm|km|kg|g|ml)\)", "", text.lower())
    return re.sub(r"[^a-z0-9]+", "", text.replace("yog(h)urt", "yoghurt"))


data = {}
with pdfplumber.open(sys.argv[1]) as pdf:
    for page in pdf.pages[3:24]:
        for left, right in [(0, page.width / 2), (page.width / 2, page.width)]:
            text = page.crop((left, 0, right, page.height - 65)).extract_text() or ""
            for line in text.splitlines():
                match = ENTRY.match(line)
                if not match or line.startswith("•"):
                    continue
                headword, raw_pos = match.groups()
                pos = re.findall(rf"\b{POS}\b", raw_pos)
                if not pos:
                    continue
                entry = data.setdefault(key(headword), {"headword": headword, "pos": [], "topics": []})
                entry["pos"] = sorted(set(entry["pos"] + pos))
    current = None
    for page in pdf.pages[24:31]:
        text = page.extract_text(layout=True) or ""
        for line in text.splitlines():
            stripped = line.strip()
            if stripped in HEADINGS:
                current = stripped
                continue
            if not current or not stripped or "©" in line or "Vocabulary List" in line or "Page " in line:
                continue
            for term in re.split(r"\s{2,}", stripped):
                term = re.sub(r"\s*\([^)]*\)", "", term).strip()
                candidates = [key(term)] + [key(part) for part in term.split("/")]
                for candidate in candidates:
                    if candidate in data and current not in data[candidate]["topics"]:
                        data[candidate]["topics"].append(current)

output = {"source": "https://www.cambridgeenglish.org/Images/506886-a2-key-2020-vocabulary-list.pdf", "edition": "August 2025", "entries": data}
(ROOT / "src/data/vocabulary-metadata.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
print(f"Extracted {len(data)} headwords with POS metadata")
