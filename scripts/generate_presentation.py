"""
KAIRO - Clean SaaS Presentation Generator (Light Theme)
Matches the clean white/navy/teal aesthetic of the KAIRO landing page.
"""

from pathlib import Path
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_FILE = Path("KAIRO_Project_Purpose_Presentation.pptx")

# ── Clean Light Theme Palette ─────────────────────────────────────────────────
BG_MAIN     = RGBColor(0xFF, 0xFF, 0xFF)   # #FFFFFF Clean White
BG_ALT      = RGBColor(0xF8, 0xFA, 0xFC)   # #F8FAFC Slate 50 (light grey)
TEXT_DARK   = RGBColor(0x0F, 0x17, 0x2A)   # #0F172A Slate 900 (almost black)
TEXT_MUTED  = RGBColor(0x47, 0x55, 0x69)   # #475569 Slate 600 (grey)
BORDER      = RGBColor(0xE2, 0xE8, 0xF0)   # #E2E8F0 Slate 200
TEAL        = RGBColor(0x14, 0xB8, 0xA6)   # #14B8A6 Brand Teal
TEAL_LIGHT  = RGBColor(0x99, 0xF6, 0xE4)   # #99F6E4 Light Teal
NAVY_BRAND  = RGBColor(0x0B, 0x11, 0x20)   # #0B1120 Logo Navy
CYAN        = RGBColor(0x0E, 0xA5, 0xE9)   # #0EA5E9 Sky Blue
AMBER       = RGBColor(0xF5, 0x9E, 0x0B)   # #F59E0B Warning
ROSE        = RGBColor(0xE1, 0x1D, 0x48)   # #E11D48 Red/Rose
GREEN       = RGBColor(0x10, 0xB9, 0x81)   # #10B981 Success
PURPLE      = RGBColor(0x63, 0x66, 0xF1)   # #6366F1 Indigo

SW = Inches(13.333)
SH = Inches(7.5)
FONT_NAME = 'Segoe UI'

# ── Shape helpers ─────────────────────────────────────────────────────────────

def _no_line(shape):
    shape.line.fill.background()

def rect(slide, l, t, w, h, bg_color, line_color=None, line_pt=1):
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, l, t, w, h)
    s.fill.solid()
    s.fill.fore_color.rgb = bg_color
    if line_color:
        s.line.color.rgb = line_color
        s.line.width = Pt(line_pt)
    else:
        _no_line(s)
    return s

def rrect(slide, l, t, w, h, bg_color, line_color=None, line_pt=1):
    s = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h)
    s.fill.solid()
    s.fill.fore_color.rgb = bg_color
    if line_color:
        s.line.color.rgb = line_color
        s.line.width = Pt(line_pt)
    else:
        _no_line(s)
    return s

def tbox(slide, l, t, w, h, text, size, bold=False, color=TEXT_DARK, align=PP_ALIGN.LEFT):
    tb = slide.shapes.add_textbox(l, t, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Inches(0.05)
    p = tf.paragraphs[0]
    p.text = text
    p.font.name = FONT_NAME
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.alignment = align
    return tb

def draw_logo(slide, cx, cy, size=Inches(0.4)):
    """Draws the exact KAIRO logo from the landing page (Navy rounded rect + teal/cyan K)."""
    # Background navy box
    box = rrect(slide, cx, cy, size, size, NAVY_BRAND)
    
    # Scale factors based on box size
    s = size
    # Vertical line (white)
    spine = rect(slide, cx + s*0.28, cy + s*0.22, Pt(3), s*0.56, BG_MAIN)
    _no_line(spine)
    
    # Upper arm (Teal)
    ul = slide.shapes.add_shape(MSO_SHAPE.LINE_INVERSE, cx + s*0.28, cy + s*0.22, s*0.40, s*0.34)
    ul.line.color.rgb = TEAL
    ul.line.width = Pt(3)
    
    # Lower arm (Cyan)
    ll = slide.shapes.add_shape(MSO_SHAPE.LINE_INVERSE, cx + s*0.28, cy + s*0.56, s*0.41, s*0.34)
    ll.line.color.rgb = CYAN
    ll.line.width = Pt(3)
    ll.rotation = 0

    # Nodes (Dots)
    dots = [
        (cx + s*0.25, cy + s*0.17, CYAN),
        (cx + s*0.25, cy + s*0.43, TEAL),
        (cx + s*0.25, cy + s*0.69, CYAN),
        (cx + s*0.64, cy + s*0.13, TEAL),
        (cx + s*0.66, cy + s*0.69, CYAN),
    ]
    ds = s*0.14
    for dx, dy, dc in dots:
        d = slide.shapes.add_shape(MSO_SHAPE.OVAL, dx, dy, ds, ds)
        d.fill.solid()
        d.fill.fore_color.rgb = dc
        _no_line(d)

def slide_chrome(slide, prs, slide_num, total_slides):
    """Sets background, footer, and subtle top accent."""
    # Background
    rect(slide, 0, 0, SW, SH, BG_MAIN)
    # Subtle top border line
    rect(slide, 0, 0, SW, Pt(4), TEAL)
    
    # Footer
    rect(slide, Inches(0.8), SH - Inches(0.5), SW - Inches(1.6), Pt(1), BORDER)
    draw_logo(slide, Inches(0.8), SH - Inches(0.42), Inches(0.25))
    tbox(slide, Inches(1.15), SH - Inches(0.43), Inches(8.0), Inches(0.3),
         "KAIRO  |  Project management that understands your codebase", 9, color=TEXT_MUTED)
    tbox(slide, SW - Inches(1.5), SH - Inches(0.43), Inches(0.7), Inches(0.3),
         f"{slide_num} / {total_slides}", 9, bold=True, color=TEXT_DARK, align=PP_ALIGN.RIGHT)

def page_header(slide, title, subtitle):
    """Clean, spacious header for content slides."""
    tbox(slide, Inches(0.8), Inches(0.6), Inches(11.7), Inches(0.6),
         title, 28, bold=True, color=TEXT_DARK)
    tbox(slide, Inches(0.8), Inches(1.2), Inches(11.7), Inches(0.4),
         subtitle, 14, color=TEXT_MUTED)
    # Subtle separator
    rect(slide, Inches(0.8), Inches(1.7), Inches(11.73), Pt(1), BORDER)

def clean_card(slide, l, t, w, h, title, bullets, accent_color=TEAL):
    """White card with soft border and top accent line."""
    # Card base
    rrect(slide, l, t, w, h, BG_MAIN, line_color=BORDER, line_pt=1)
    # Top accent line
    rect(slide, l + Pt(6), t + Pt(6), w - Pt(12), Pt(3), accent_color)
    
    # Content
    pad = Inches(0.25)
    tbox(slide, l + pad, t + Inches(0.25), w - pad*2, Inches(0.4),
         title, 14, bold=True, color=TEXT_DARK)
    
    by = t + Inches(0.65)
    for b in bullets:
        tb = tbox(slide, l + pad, by, w - pad*2, Inches(0.4),
                  f"•  {b}", 11, color=TEXT_MUTED)
        by += Inches(0.35)

# ═════════════════════════════════════════════════════════════════════════════
# SLIDES
# ═════════════════════════════════════════════════════════════════════════════

def slide_1_title(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 1, 8)
    
    # Left Column: Brand & Title (Width: 6.5")
    draw_logo(s, Inches(0.8), Inches(1.5), Inches(0.8))
    tbox(s, Inches(1.7), Inches(1.6), Inches(4.0), Inches(0.8),
         "KAIRO", 44, bold=True, color=TEXT_DARK)
    
    tbox(s, Inches(0.8), Inches(2.5), Inches(6.5), Inches(1.2),
         "Project management that understands your codebase.",
         32, bold=True, color=TEXT_DARK)
         
    tbox(s, Inches(0.8), Inches(3.9), Inches(6.0), Inches(1.0),
         "Reconstructing and preserving architectural memory across commits, PRs, and design decisions to stop undocumented drift before merging.",
         13, color=TEXT_MUTED)
         
    # Team Box
    team_box = rrect(s, Inches(0.8), Inches(5.2), Inches(6.0), Inches(1.2), BG_ALT, line_color=BORDER)
    tbox(s, Inches(1.0), Inches(5.35), Inches(5.6), Inches(0.3),
         "Team: Sharvari Bhondekar | Aman Mehtar | Shruti Gauchandra", 10, bold=True, color=TEXT_DARK)
    tbox(s, Inches(1.0), Inches(5.65), Inches(5.6), Inches(0.3),
         "Mentors: Prof. Kranti Gule | Dr. Tatwadarshi P. Nagarhalli", 10, color=TEAL)
    tbox(s, Inches(1.0), Inches(5.95), Inches(5.6), Inches(0.3),
         "Dept. of AI & DS, Vidyavardhini's College of Engineering & Technology", 9, color=TEXT_MUTED)

    # Right Column: Visual Dashboard Mockup (Strict bounds: X=7.8 to 12.5)
    dx = Inches(7.8)
    dw = Inches(4.7)
    dy = Inches(1.5)
    dh = Inches(4.9)
    
    rrect(s, dx, dy, dw, dh, BG_MAIN, line_color=BORDER, line_pt=1)
    # Header of dashboard
    rect(s, dx, dy, dw, Inches(0.4), BG_ALT)
    rect(s, dx, dy + Inches(0.4), dw, Pt(1), BORDER)
    tbox(s, dx + Inches(0.2), dy + Inches(0.08), Inches(3.0), Inches(0.3),
         "ENGINEERING INTELLIGENCE", 9, bold=True, color=TEXT_MUTED)
    tbox(s, dx + dw - Inches(1.0), dy + Inches(0.08), Inches(0.8), Inches(0.3),
         "LIVE SYNC", 9, bold=True, color=TEAL, align=PP_ALIGN.RIGHT)

    features = [
        ("Temporal Knowledge Graph", "Bitemporal links connecting code to decisions", "Degree ≤ 20", CYAN),
        ("Decision Drift Index (DDI)", "Detects PRs contradicting active ADRs", "72 / 100", AMBER),
        ("Change Impact Scanner", "Pre-merge blast radius prediction", "12 Files", ROSE),
        ("3-Mode GraphRAG", "Synthesize repository answers with citations", "94% Conf.", TEAL)
    ]
    
    for i, (title, sub, badge, col) in enumerate(features):
        fy = dy + Inches(0.6) + (i * Inches(1.05))
        rrect(s, dx + Inches(0.2), fy, dw - Inches(0.4), Inches(0.9), BG_MAIN, line_color=BORDER)
        
        # Circle icon
        circ = s.shapes.add_shape(MSO_SHAPE.OVAL, dx + Inches(0.35), fy + Inches(0.25), Inches(0.4), Inches(0.4))
        circ.fill.solid()
        circ.fill.fore_color.rgb = BG_ALT
        circ.line.color.rgb = col
        circ.line.width = Pt(1.5)
        
        tbox(s, dx + Inches(0.85), fy + Inches(0.15), dw - Inches(2.0), Inches(0.3), title, 11, bold=True, color=TEXT_DARK)
        tbox(s, dx + Inches(0.85), fy + Inches(0.45), dw - Inches(2.0), Inches(0.35), sub, 9, color=TEXT_MUTED)
        
        # Badge
        rrect(s, dx + dw - Inches(1.1), fy + Inches(0.3), Inches(0.8), Inches(0.25), BG_MAIN, line_color=col)
        tbox(s, dx + dw - Inches(1.1), fy + Inches(0.32), Inches(0.8), Inches(0.25), badge, 8, bold=True, color=col, align=PP_ALIGN.CENTER)

def slide_2_problem(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 2, 8)
    page_header(s, "The Engineering Memory Crisis", "Why development teams lose context and accumulate hidden debt.")

    CW = Inches(3.77)
    CT = Inches(2.2)
    CH = Inches(3.6)
    
    clean_card(s, Inches(0.8), CT, CW, CH, "1. Tool Fragmentation", [
        "Jira, GitHub, and Slack are completely siloed.",
        "Tools track the current status (Done/In Progress), but never track the 'why'.",
        "When original developers leave, institutional memory vanishes entirely."
    ], PURPLE)

    clean_card(s, Inches(4.78), CT, CW, CH, "2. Invisible Decision Drift", [
        "Documented architecture and live code drift apart daily.",
        "Pull requests inadvertently violate foundational architectural standards.",
        "Teams lack any mathematical index to measure or alert on architectural drift."
    ], AMBER)

    clean_card(s, Inches(8.76), CT, CW, CH, "3. Temporal Blindness", [
        "Standard AI/RAG retrieves code purely by keyword similarity.",
        "It cannot distinguish an active architectural rule from an obsolete 2021 choice.",
        "Results in AI confidently recommending deprecated practices."
    ], ROSE)
    
    rrect(s, Inches(0.8), Inches(6.1), Inches(11.73), Inches(0.5), BG_ALT, line_color=ROSE)
    tbox(s, Inches(1.0), Inches(6.2), Inches(11.3), Inches(0.3), 
         "Result: Slower onboarding, fragile codebases, and architectural regressions.", 12, bold=True, color=ROSE, align=PP_ALIGN.CENTER)

def slide_3_solution(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 3, 8)
    page_header(s, "The KAIRO Solution", "A unified bitemporal knowledge graph translating telemetry into intelligence.")

    # Flow Diagram
    by = Inches(3.0)
    
    # 1. Inputs
    rrect(s, Inches(0.8), Inches(2.2), Inches(2.5), Inches(3.2), BG_ALT, line_color=BORDER)
    tbox(s, Inches(0.8), Inches(2.4), Inches(2.5), Inches(0.3), "DATA INPUTS", 10, bold=True, color=TEXT_MUTED, align=PP_ALIGN.CENTER)
    rect(s, Inches(1.1), Inches(2.9), Inches(1.9), Inches(0.5), BG_MAIN, line_color=CYAN); tbox(s, Inches(1.1), Inches(3.05), Inches(1.9), Inches(0.3), "Commits / PRs", 11, bold=True, align=PP_ALIGN.CENTER)
    rect(s, Inches(1.1), Inches(3.6), Inches(1.9), Inches(0.5), BG_MAIN, line_color=CYAN); tbox(s, Inches(1.1), Inches(3.75), Inches(1.9), Inches(0.3), "Issue Threads", 11, bold=True, align=PP_ALIGN.CENTER)
    rect(s, Inches(1.1), Inches(4.3), Inches(1.9), Inches(0.5), BG_MAIN, line_color=CYAN); tbox(s, Inches(1.1), Inches(4.45), Inches(1.9), Inches(0.3), "Code Reviews", 11, bold=True, align=PP_ALIGN.CENTER)

    # Arrow
    tbox(s, Inches(3.4), Inches(3.6), Inches(0.5), Inches(0.5), "➔", 30, color=BORDER)

    # 2. Engine
    engine = rrect(s, Inches(4.0), Inches(2.2), Inches(5.33), Inches(3.2), NAVY_BRAND, line_color=TEAL, line_pt=2)
    tbox(s, Inches(4.0), Inches(2.4), Inches(5.33), Inches(0.3), "KAIRO ENGINE", 12, bold=True, color=TEAL, align=PP_ALIGN.CENTER)
    
    rect(s, Inches(4.3), Inches(2.9), Inches(4.7), Inches(0.6), BG_MAIN); tbox(s, Inches(4.4), Inches(3.0), Inches(4.5), Inches(0.4), "1. Graph Builder: Maps code structural facts", 11, bold=True)
    rect(s, Inches(4.3), Inches(3.7), Inches(4.7), Inches(0.6), BG_MAIN); tbox(s, Inches(4.4), Inches(3.8), Inches(4.5), Inches(0.4), "2. LLM Extractor: Mines architectural decisions", 11, bold=True)
    rect(s, Inches(4.3), Inches(4.5), Inches(4.7), Inches(0.6), BG_MAIN); tbox(s, Inches(4.4), Inches(4.6), Inches(4.5), Inches(0.4), "3. Bitemporal Index: Stamps historical validity", 11, bold=True)

    # Arrow
    tbox(s, Inches(9.4), Inches(3.6), Inches(0.5), Inches(0.5), "➔", 30, color=BORDER)

    # 3. Outputs
    rrect(s, Inches(10.0), Inches(2.2), Inches(2.53), Inches(3.2), BG_ALT, line_color=BORDER)
    tbox(s, Inches(10.0), Inches(2.4), Inches(2.53), Inches(0.3), "INTELLIGENCE", 10, bold=True, color=TEXT_MUTED, align=PP_ALIGN.CENTER)
    rect(s, Inches(10.3), Inches(2.9), Inches(1.93), Inches(0.5), BG_MAIN, line_color=TEAL); tbox(s, Inches(10.3), Inches(3.05), Inches(1.93), Inches(0.3), "3-Mode GraphRAG", 10, bold=True, align=PP_ALIGN.CENTER)
    rect(s, Inches(10.3), Inches(3.6), Inches(1.93), Inches(0.5), BG_MAIN, line_color=AMBER); tbox(s, Inches(10.3), Inches(3.75), Inches(1.93), Inches(0.3), "Impact Scanner", 10, bold=True, align=PP_ALIGN.CENTER)
    rect(s, Inches(10.3), Inches(4.3), Inches(1.93), Inches(0.5), BG_MAIN, line_color=ROSE); tbox(s, Inches(10.3), Inches(4.45), Inches(1.93), Inches(0.3), "Drift Index (DDI)", 10, bold=True, align=PP_ALIGN.CENTER)

    rrect(s, Inches(0.8), Inches(5.8), Inches(11.73), Inches(0.6), BG_ALT, line_color=TEAL)
    tbox(s, Inches(1.0), Inches(5.95), Inches(11.3), Inches(0.3), 
         "Result: An actively protected codebase where architectural intent is mathematically tracked and queryable.", 12, bold=True, color=TEAL, align=PP_ALIGN.CENTER)

def slide_4_features(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 4, 8)
    page_header(s, "Unique Features & Innovation", "Core capabilities unseen in traditional project management tools.")

    CW = Inches(5.76)
    CH = Inches(1.9)
    
    # Left Column
    clean_card(s, Inches(0.8), Inches(2.1), CW, CH, "3-Mode GraphRAG Engine", [
        "Anchored Mode: Structural graph traversal from a specific file path.",
        "As-Of Mode: Bitemporal snapshot queries (e.g. 'architecture in March').",
        "Semantic Mode: pgvector nearest-neighbor fallback for broad queries."
    ], TEAL)
    
    clean_card(s, Inches(0.8), Inches(4.2), CW, CH, "Two-Layer Trust Isolation", [
        "Layer 1 (Deterministic): API facts with 0% hallucination risk.",
        "Layer 2 (Probabilistic): LLM decisions bound by verbatim provenance quotes.",
        "Safely combines statistical AI with strict mathematical ground truth."
    ], PURPLE)
    
    # Right Column
    clean_card(s, Inches(6.77), Inches(2.1), CW, CH, "Decision Drift Index (DDI)", [
        "The first mathematical metric quantifying architectural drift.",
        "Compares active code against documented ADRs.",
        "Automatically blocks CI/CD pipelines if drift exceeds safe thresholds."
    ], AMBER)
    
    clean_card(s, Inches(6.77), Inches(4.2), CW, CH, "Change Impact Scanner", [
        "Simulates the 'blast radius' of pull requests before they merge.",
        "Correlates historical file churn with regression bug probability.",
        "Identifies ownership gaps and assigns optimal reviewers automatically."
    ], ROSE)

def slide_5_architecture(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 5, 8)
    page_header(s, "System Architecture", "End-to-end technology stack designed for performance and scale.")

    LW = Inches(11.73)
    LX = Inches(0.8)
    LH = Inches(1.0)
    GAP = Inches(0.2)

    # 1. API / Frontend
    rrect(s, LX, Inches(2.0), LW, LH, BG_ALT, line_color=BORDER)
    rect(s, LX, Inches(2.0), Pt(6), LH, TEAL)
    tbox(s, LX + Inches(0.3), Inches(2.35), Inches(3.0), Inches(0.3), "PRESENTATION LAYER", 11, bold=True, color=TEXT_MUTED)
    tbox(s, LX + Inches(3.5), Inches(2.35), Inches(7.0), Inches(0.3), "Next.js 16 | React 19 | Tailwind CSS | SaaS Workspace UI", 13, bold=True, color=TEXT_DARK)

    # 2. Application Core
    rrect(s, LX, Inches(3.2), LW, LH, BG_ALT, line_color=BORDER)
    rect(s, LX, Inches(3.2), Pt(6), LH, PURPLE)
    tbox(s, LX + Inches(0.3), Inches(3.55), Inches(3.0), Inches(0.3), "APPLICATION LAYER", 11, bold=True, color=TEXT_MUTED)
    tbox(s, LX + Inches(3.5), Inches(3.55), Inches(7.0), Inches(0.3), "Python 3.13 | FastAPI | Pydantic | OpenRouter LLM Gateway", 13, bold=True, color=TEXT_DARK)

    # 3. Data Store
    rrect(s, LX, Inches(4.4), LW, LH, BG_ALT, line_color=BORDER)
    rect(s, LX, Inches(4.4), Pt(6), LH, CYAN)
    tbox(s, LX + Inches(0.3), Inches(4.75), Inches(3.0), Inches(0.3), "DATA KNOWLEDGE LAYER", 11, bold=True, color=TEXT_MUTED)
    tbox(s, LX + Inches(3.5), Inches(4.75), Inches(7.0), Inches(0.3), "PostgreSQL | pgvector | Recursive SQL CTEs (Graph Traversal)", 13, bold=True, color=TEXT_DARK)

    # 4. Ingestion
    rrect(s, LX, Inches(5.6), LW, LH, BG_ALT, line_color=BORDER)
    rect(s, LX, Inches(5.6), Pt(6), LH, AMBER)
    tbox(s, LX + Inches(0.3), Inches(5.95), Inches(3.0), Inches(0.3), "INGESTION LAYER", 11, bold=True, color=TEXT_MUTED)
    tbox(s, LX + Inches(3.5), Inches(5.95), Inches(7.0), Inches(0.3), "GitHub Apps API | Real-time Webhooks | Async Telemetry Sync", 13, bold=True, color=TEXT_DARK)

def slide_6_usecases(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 6, 8)
    page_header(s, "Use Cases & Impact", "Real-world engineering scenarios solved by KAIRO.")

    CW = Inches(3.77)
    CT1 = Inches(2.0)
    CT2 = Inches(4.1)
    CH = Inches(1.9)

    clean_card(s, Inches(0.8), CT1, CW, CH, "Developer Onboarding", [
        "New hires query the graph to understand codebase history instantly.",
        "Reduces time-to-first-commit significantly."
    ], GREEN)

    clean_card(s, Inches(4.78), CT1, CW, CH, "Pre-Merge Intelligence", [
        "Scanner flags ADR violations before a PR is merged.",
        "Prevents regressions and architectural decay."
    ], AMBER)

    clean_card(s, Inches(8.76), CT1, CW, CH, "Technical Debt Audits", [
        "DDI tracking highlights heavily drifted modules.",
        "Helps leaders prioritize sprint refactoring empirically."
    ], ROSE)

    clean_card(s, Inches(0.8), CT2, CW, CH, "Time-Travel Debugging", [
        "Query the exact architectural state of the repo 6 months ago.",
        "Bitemporal index ensures no anachronisms."
    ], CYAN)

    clean_card(s, Inches(4.78), CT2, CW, CH, "Agile Poker Estimation", [
        "AI estimates story points based on historical file fragility.",
        "Ties high-level epics directly to code impact."
    ], TEAL)

    clean_card(s, Inches(8.76), CT2, CW, CH, "Compliance & Auditing", [
        "Verbatim provenance provides an exact paper trail.",
        "Crucial for enterprise governance and security reviews."
    ], PURPLE)
    
    # Stat bar
    rrect(s, Inches(0.8), Inches(6.15), Inches(11.73), Inches(0.4), NAVY_BRAND)
    tbox(s, Inches(1.0), Inches(6.22), Inches(11.3), Inches(0.3), 
         "Benchmark: 7.1x cross-reference recovery | 56% → 27% overlap reduction | < 1% hallucination rate", 10, bold=True, color=TEAL_LIGHT, align=PP_ALIGN.CENTER)

def slide_7_references(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 7, 8)
    page_header(s, "References", "Foundational academic research and industry standards.")

    refs = [
        ("Edge, C., Ramos, J., & Xu, X. (2021). Temporal Knowledge Graphs.", "Bitemporal graph models for valid-time and transaction-time intervals."),
        ("Lewis, P., et al. (2020). Retrieval-Augmented Generation.", "Foundational RAG architecture extended by KAIRO's graph traversal."),
        ("Edge, D., et al. (2024). From Local to Global: A Graph RAG Approach.", "Microsoft Research framework inspiring multi-mode retrieval."),
        ("Snyder, M., & Atkins, B. (2017). Architecture Decision Records (ADRs).", "ThoughtWorks standard adopted for Layer 2 decision node schemas."),
        ("Nauer, E., et al. (2023). Software Evolution and Technical Debt Metrics.", "Empirical foundation for the Engineering Evolution Score (EES)."),
        ("Pgvector Contributors. (2023). pgvector: Open-source vector search.", "Vector extension enabling KAIRO's semantic retrieval fallback.")
    ]

    by = Inches(2.2)
    for i, (cit, rel) in enumerate(refs):
        # Number
        tbox(s, Inches(0.8), by, Inches(0.5), Inches(0.3), f"[{i+1}]", 11, bold=True, color=TEAL)
        # Citation
        tbox(s, Inches(1.3), by, Inches(11.2), Inches(0.3), cit, 11, bold=True, color=TEXT_DARK)
        # Relevance
        tbox(s, Inches(1.3), by + Inches(0.25), Inches(11.2), Inches(0.3), f"Relevance: {rel}", 10, color=TEXT_MUTED)
        by += Inches(0.65)

def slide_8_thankyou(prs, layout):
    s = prs.slides.add_slide(layout)
    slide_chrome(s, prs, 8, 8)
    
    # Large Logo centered
    draw_logo(s, Inches(5.9), Inches(1.8), Inches(1.5))
    
    tbox(s, Inches(1.0), Inches(3.6), Inches(11.3), Inches(0.8), "Thank You", 48, bold=True, color=TEXT_DARK, align=PP_ALIGN.CENTER)
    
    rect(s, Inches(6.0), Inches(4.5), Inches(1.3), Pt(4), TEAL)
    
    tbox(s, Inches(1.0), Inches(4.8), Inches(11.3), Inches(0.4), "Project management that understands your codebase.", 16, color=TEXT_MUTED, align=PP_ALIGN.CENTER)
    
    # CTA Box
    cta = rrect(s, Inches(3.66), Inches(5.6), Inches(6.0), Inches(0.6), BG_ALT, line_color=BORDER, line_pt=1.5)
    tbox(s, Inches(3.66), Inches(5.75), Inches(6.0), Inches(0.4), "Live Demo: /demo?mode=judge  |  GitHub: sharvarianand/kairo", 12, bold=True, color=TEAL, align=PP_ALIGN.CENTER)

# ═════════════════════════════════════════════════════════════════════════════

def build():
    prs = pptx.Presentation()
    prs.slide_width = SW
    prs.slide_height = SH
    blank = prs.slide_layouts[6]

    slide_1_title(prs, blank)
    slide_2_problem(prs, blank)
    slide_3_solution(prs, blank)
    slide_4_features(prs, blank)
    slide_5_architecture(prs, blank)
    slide_6_usecases(prs, blank)
    slide_7_references(prs, blank)
    slide_8_thankyou(prs, blank)

    prs.save(OUTPUT_FILE)
    print(f"Saved: {OUTPUT_FILE}")

if __name__ == "__main__":
    build()
