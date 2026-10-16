from typing import List, Dict, Any, Optional
import re
from app.utils.bibtex import generate_bibtex

class LaTeXExporter:
    """
    Generates IEEE/ACM-compliant LaTeX literature review manuscripts
    and direct Overleaf project integration payloads.
    """
    
    def sanitize_latex(self, text: Optional[str]) -> str:
        """Escape LaTeX special characters while preserving readable text."""
        if not text:
            return ""
        replacements = {
            "\\": "\\textbackslash{}",
            "&": "\\&",
            "%": "\\%",
            "$": "\\$",
            "#": "\\#",
            "_": "\\_",
            "{": "\\{",
            "}": "\\}",
            "~": "\\textasciitilde{}",
            "^": "\\textasciicircum{}"
        }
        for orig, escaped in replacements.items():
            text = text.replace(orig, escaped)
        return text

    def generate_latex_manuscript(
        self,
        project_title: str,
        topic: str,
        papers: List[Dict[str, Any]],
        gaps: List[Dict[str, Any]]
    ) -> str:
        """Compile a complete, publication-grade LaTeX .tex manuscript."""
        clean_title = self.sanitize_latex(project_title or "Comprehensive Literature Review")
        clean_topic = self.sanitize_latex(topic or "Deep Learning & Artificial Intelligence")

        # Build citations mapping: paper_id -> bib_key
        bib_keys = {}
        for idx, p in enumerate(papers):
            authors = p.get("authors") or ["Author"]
            first_author = authors[0].split()[-1] if authors else "Author"
            first_author = re.sub(r'[^a-zA-Z]', '', first_author) or "Author"
            year = p.get("year", 2024)
            bib_key = f"{first_author.lower()}{year}_{idx+1}"
            bib_keys[p.get("id", str(idx))] = bib_key

        lines = [
            r"\documentclass[journal,10pt,twocolumn]{IEEEtran}",
            r"\usepackage[utf8]{inputenc}",
            r"\usepackage{cite}",
            r"\usepackage{amsmath,amssymb,amsfonts}",
            r"\usepackage{algorithmic}",
            r"\usepackage{graphicx}",
            r"\usepackage{textcomp}",
            r"\usepackage{xcolor}",
            r"\usepackage{booktabs}",
            r"\usepackage{hyperref}",
            r"\hypersetup{colorlinks=true, linkcolor=blue, citecolor=blue, urlcolor=blue}",
            r"",
            f"\\title{{{clean_title}: A Systematic Literature Review and Research Gap Formulation}}",
            r"",
            r"\author{Principal Academic Investigator\\",
            r"\IEEEmembership{Autonomous Research Division, AI Research Gap Finder Platform}\\",
            f"\\textsl{{Target Domain: {clean_topic}}}}}",
            r"",
            r"\begin{document}",
            r"\maketitle",
            r"",
            r"\begin{abstract}",
            f"This systematic review investigates state-of-the-art methodology, benchmark limitations, and critical unexplored research questions in the domain of {clean_topic}. By synthesizing evidence from {len(papers)} peer-reviewed publications using hybrid vector and lexical retrieval, we identify {len(gaps)} candidate research gaps and formulate structured hypotheses for future empirical validation.",
            r"\end{abstract}",
            r"",
            r"\begin{IEEEkeywords}",
            r"Literature Review, Research Gaps, Empirical Validation, Hybrid Retrieval, Methodology Synthesis.",
            r"\end{IEEEkeywords}",
            r"",
            r"\section{Introduction}",
            f"The accelerated proliferation of scholarly literature in \\textbf{{{clean_topic}}} necessitates rigorous cross-manuscript evidence synthesis. While contemporary literature has introduced effective modeling paradigms, significant constraints persist regarding computational throughput, cross-domain generalization, and benchmark robustness.",
            f"In this work, we analyze {len(papers)} primary studies indexed in the project corpus, systematically extracting empirical limitations, contrasting conflicting conclusions, and defining verifiable avenues for future inquiry.",
            r"",
            r"\section{Corpus Evidence & Comparative Matrix}",
            r"Table~\ref{tab:corpus} summarizes the primary academic corpus evaluated in this review.",
            r"",
            r"\begin{table*}[t]",
            r"\caption{Synthesized Corpus of Evaluated Literature}",
            r"\label{tab:corpus}",
            r"\centering",
            r"\begin{tabular}{lp{6cm}ccl}",
            r"\toprule",
            r"\textbf{Citation Key} & \textbf{Title} & \textbf{Year} & \textbf{Citations} & \textbf{Open Access} \\",
            r"\midrule"
        ]

        # Populate table rows
        for p in papers:
            p_id = p.get("id", "")
            b_key = bib_keys.get(p_id, "ref")
            p_title = self.sanitize_latex(p.get("title", "Academic Paper")[:55])
            p_year = p.get("year", 2024)
            p_cites = p.get("citation_count", 0)
            p_oa = "Yes" if p.get("is_open_access") else "Indexed"
            lines.append(f"\\cite{{{b_key}}} & {p_title}... & {p_year} & {p_cites} & {p_oa} \\\\")

        lines.extend([
            r"\bottomrule",
            r"\end{tabular}",
            r"\end{table*}",
            r"",
            r"\section{Systematic Research Gap Analysis}",
            f"Applying structured 9-stage limitation extraction across the evaluated manuscripts revealed {len(gaps)} primary research gaps categorized by methodology, domain scope, and empirical verification."
        ])

        # Populate Gaps
        for idx, gap in enumerate(gaps, 1):
            g_title = self.sanitize_latex(gap.get("title", f"Identified Research Gap {idx}"))
            g_cat = self.sanitize_latex(gap.get("category", "Methodological Gap"))
            g_desc = self.sanitize_latex(gap.get("description", "Empirical limitation identified in published baseline evaluations."))
            g_score = gap.get("confidence_score", 0.85)
            g_q = self.sanitize_latex(gap.get("potential_question", "How can this limitation be systematically mitigated?"))
            g_exp = self.sanitize_latex(gap.get("suggested_experiment", "Conduct ablation testing on diverse out-of-distribution datasets."))

            lines.extend([
                f"\\subsection{{Gap {idx}: {g_title}}}",
                f"\\textbf{{Category:}} {g_cat} \\hfill \\textbf{{Confidence:}} {int(g_score * 100)}\\%",
                r"\begin{quote}",
                f"\\textit{{{g_desc}}}",
                r"\end{quote}",
                f"\\textbf{{Core Research Question:}} {g_q}\\\\",
                f"\\textbf{{Recommended Validation Experiment:}} {g_exp}",
                r""
            ])

        lines.extend([
            r"\section{Conclusion and Future Roadmap}",
            f"This review synthesized key paradigms across {len(papers)} evaluated manuscripts in {clean_topic}. Resolving the outlined research gaps requires targeted benchmark expansions and robust counter-evidence validation. The provided bib entries and gap formulations serve as an immediate foundation for dissertation and conference manuscript drafting.",
            r"",
            r"\bibliographystyle{IEEEtran}",
            r"\bibliography{references}",
            r"",
            r"\end{document}"
        ])

        return "\n".join(lines)

    def generate_bibtex_corpus(self, papers: List[Dict[str, Any]]) -> str:
        """Generate comprehensive BibTeX bibliography file references.bib."""
        bib_entries = []
        for idx, p in enumerate(papers):
            bib_entries.append(generate_bibtex(p))
        return "\n\n".join(bib_entries)

latex_exporter = LaTeXExporter()
