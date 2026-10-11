"""Extract factual POS and topic metadata from the Cambridge August 2025 PDF."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POS = r"(?:prep phr|phr v|abbrev|exclam|conj|pron|prep|adj|adv|det|av|mv|n|pl|sing|v)"
POS_GROUP = re.compile(rf"\(((?:unc\s+)?{POS}\b[^)]*)\)")
USAGE_QUALIFIER = re.compile(
    r"\s+\((?:[A-Z][A-Z /-]*|technology|become happy|digitally|stylish|clever|"
    r"transitive and intransitive|music)\)\s*$"
)
HEADINGS = {
    "Appliances", "Clothes and Accessories", "Colours", "Communication and Technology", "Documents and Texts",
    "Education", "Entertainment and Media", "Family and Friends", "Food and Drink",
    "Health, Medicine and Exercise", "Hobbies and Leisure", "House and Home",
    "Measurements", "Personal Feelings, Opinions and Experiences (adjectives)", "Places: Buildings",
    "Places: Countryside", "Places: Town and City", "Services", "Shopping", "Sport",
    "The Natural World", "Time", "Travel and Transport", "Weather", "Work and Jobs",
}


def key(text):
    if text.strip() in {"IT", "May", "Miss"}:
        return text.strip()
    text = re.sub(r"\s*\((?:cm|km|kg|g|ml)\)", "", text.lower())
    return re.sub(r"[^a-z0-9]+", "", text.replace("yog(h)urt", "yoghurt"))


def parse_entry(line):
    if line.startswith("•"):
        return None
    match = POS_GROUP.search(line)
    if not match:
        return None
    headword = USAGE_QUALIFIER.sub("", line[:match.start()].strip())
    if not headword:
        return None
    return headword, re.findall(rf"\b{POS}\b", match.group(1))


def topic_keys(term):
    # Keep optional spellings, but also match entries without usage qualifiers.
    keys = set()
    parts = term.split("/")
    variants = parts if all(len(part.split()) <= 2 for part in parts) else []
    for variant in [term, *variants]:
        keys.add(key(variant))
        keys.add(key(re.sub(r"\([^)]*\)", "", variant)))
    return keys - {""}


def add_topic_lines(data, lines, current=None):
    aliases = {}
    for entry_key, entry in data.items():
        for alias in topic_keys(entry["headword"]):
            aliases.setdefault(alias, set()).add(entry_key)
    for line in lines:
        stripped = line.strip()
        if stripped in HEADINGS:
            current = stripped
            continue
        if not current or not stripped or "©" in line or "Vocabulary List" in line or "Page " in line:
            continue
        for term in re.split(r"\s{2,}", stripped):
            for candidate in topic_keys(term):
                for entry_key in aliases.get(candidate, ()):
                    if current not in data[entry_key]["topics"]:
                        data[entry_key]["topics"].append(current)
    return current


def extract(pdf):
    data = {}
    for page in pdf.pages[3:24]:
        for left, right in [(0, page.width / 2), (page.width / 2, page.width)]:
            text = page.crop((left, 0, right, page.height - 65)).extract_text() or ""
            for line in text.splitlines():
                parsed = parse_entry(line)
                if not parsed:
                    continue
                headword, pos = parsed
                if not pos:
                    continue
                entry = data.setdefault(key(headword), {"headword": headword, "pos": [], "topics": []})
                entry["pos"] = sorted(set(entry["pos"] + pos))
    current = None
    for page in pdf.pages[24:]:
        text = page.extract_text(layout=True) or ""
        current = add_topic_lines(data, text.splitlines(), current)
    return data

if __name__ == "__main__":
    import pdfplumber

    with pdfplumber.open(sys.argv[1]) as pdf:
        data = extract(pdf)
    output = {"source": "https://www.cambridgeenglish.org/Images/506886-a2-key-2020-vocabulary-list.pdf", "edition": "August 2025", "entries": data}
    destination = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "src/data/vocabulary-metadata.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"Extracted {len(data)} headwords with POS metadata")
