import re
from typing import Dict, Any

def generate_bibtex(paper: Dict[str, Any]) -> str:
    """Generate clean BibTeX snippet for an academic paper."""
    title = paper.get("title", "Untitled Paper")
    authors = paper.get("authors") or ["Anonymous"]
    authors_str = " and ".join(authors)
    year = paper.get("year") or 2026
    venue = paper.get("venue") or "Academic Journal"
    doi = paper.get("doi") or ""

    # Generate citation key e.g. Rostova2025Advancements
    first_author_surname = authors[0].split()[-1] if authors else "Paper"
    first_author_surname = re.sub(r'[^a-zA-Z]', '', first_author_surname)
    first_word_title = re.sub(r'[^a-zA-Z]', '', title.split()[0])
    cite_key = f"{first_author_surname}{year}{first_word_title}"

    bibtex_lines = [
        f"@article{{{cite_key},",
        f"  title     = {{{title}}},",
        f"  author    = {{{authors_str}}},",
        f"  journal   = {{{venue}}},",
        f"  year      = {{{year}}},"
    ]
    if doi:
        bibtex_lines.append(f"  doi       = {{{doi}}},")
    bibtex_lines.append("}")

    return "\n".join(bibtex_lines)
