"""Generate the official KAIRO Project Purpose presentation - premium visual theme."""

from pathlib import Path
import pptx
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from lxml import etree

OUTPUT_FILE = Path("KAIRO_Project_Purpose_Presentation.pptx")

# ─── Brand Palette ──────────────────────────────────────────────────────────
BG_DARK        = RGBColor(0x0B, 0x11, 0x20)  # #0B1120  deep navy
BG_MID         = RGBColor(0x0F, 0x17, 0x2A)  # #0F172A  slightly lighter
CARD_BG        = RGBColor(0x11, 0x18, 0x27)  # #111827
CARD_BG2       = RGBColor(0x16, 0x21, 0x3A)  # #16213A  card alt
CARD_BORDER    = RGBColor(0x1E, 0x29, 0x3B)  # #1E293B
TEAL_PRIMARY   = RGBColor(0x14, 0xB8, 0xA6)  # #14B8A6
TEAL_LIGHT     = RGBColor(0x2D, 0xD4, 0xBF)  # #2DD4BF
CYAN_ACCENT    = RGBColor(0x38, 0xBD, 0xF8)  # #38BDF8
TEXT_WHITE     = RGBColor(0xF8, 0xFA, 0xFC)  # #F8FAFC
TEXT_MUTED     = RGBColor(0x94, 0xA3, 0xB8)  # #94A3B8
TEXT_DIM       = RGBColor(0x64, 0x74, 0x8B)  # #64748B
AMBER_ALERT    = RGBColor(0xF5, 0x9E, 0x0B)  # #F59E0B
GREEN_SUCCESS  = RGBColor(0x10, 0xB9, 0x81)  # #10B981
PURPLE_ACCENT  = RGBColor(0x63, 0x66, 0xF1)  # #6366F1
ROSE_ACCENT    = RGBColor(0xF4, 0x3F, 0x5E)  # #F43F5E
SLATE_LINE     = RGBColor(0x1E, 0x29, 0x3B)  # separator colour
OVERLAY_DARK   = RGBColor(0x07, 0x0D, 0x1A)  # deep corner


def _no_line(shape):
    """Remove shape outline completely."""
    shape.line.fill.background()


def _solid(shape, rgb: RGBColor):
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb


# ─── Slide decoration helpers ────────────────────────────────────────────────

def set_bg(slide, prs):
    """Dark base + two layered overlay rectangles for a gradient-like depth effect."""
    # Base fill
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    _solid(bg, BG_DARK)
    _no_line(bg)

    # Top-left lighter vignette
    vl = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, 0, 0, Inches(6.5), Inches(4.0)
    )
    _solid(vl, BG_MID)
    _no_line(vl)
    vl.fill.fore_color.rgb = BG_MID
    # simulate transparency by using a very dark colour, not true alpha
    vl.fill.solid()
    vl.fill.fore_color.rgb = RGBColor(0x10, 0x1B, 0x32)
    _no_line(vl)

    # Bottom-right darker corner
    vr = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(7.5), Inches(3.5), Inches(5.9), Inches(4.0)
    )
    _solid(vr, OVERLAY_DARK)
    _no_line(vr)


def add_decorative_accents(slide, prs):
    """Add three tiny teal/cyan corner accent rectangles for visual energy."""
    # Top-right teal corner streak
    a1 = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        prs.slide_width - Inches(2.2), 0,
        Inches(2.2), Pt(4)
    )
    _solid(a1, TEAL_PRIMARY)
    _no_line(a1)

    a2 = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        prs.slide_width - Inches(1.1), 0,
        Inches(1.1), Pt(9)
    )
    _solid(a2, TEAL_LIGHT)
    _no_line(a2)

    # Bottom-left cyan streak
    a3 = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        0, prs.slide_height - Pt(4),
        Inches(1.8), Pt(4)
    )
    _solid(a3, CYAN_ACCENT)
    _no_line(a3)

    a4 = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        0, prs.slide_height - Pt(10),
        Inches(0.8), Pt(6)
    )
    _solid(a4, TEAL_PRIMARY)
    _no_line(a4)


def add_separator(slide, y_inches, width_inches=11.72, x_inches=0.8, color=None):
    """Add a thin horizontal rule."""
    if color is None:
        color = SLATE_LINE
    sep = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(x_inches), Inches(y_inches),
        Inches(width_inches), Pt(1)
    )
    _solid(sep, color)
    _no_line(sep)


def add_icon_circle(slide, cx, cy, radius, bg_color, label, label_color=None):
    """Draw a small filled circle with a short text label inside."""
    if label_color is None:
        label_color = TEXT_WHITE
    circle = slide.shapes.add_shape(
        MSO_SHAPE.OVAL,
        cx - radius, cy - radius, radius * 2, radius * 2
    )
    _solid(circle, bg_color)
    _no_line(circle)
    tf = circle.text_frame
    tf.word_wrap = False
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = label
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = label_color
    p.alignment = PP_ALIGN.CENTER


def add_pill(slide, left, top, width, height, text, bg, text_color, border=None, font_size=9):
    """Rounded pill badge."""
    pill = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        left, top, width, height
    )
    _solid(pill, bg)
    if border:
        pill.line.color.rgb = border
        pill.line.width = Pt(1)
    else:
        _no_line(pill)
    tf = pill.text_frame
    tf.word_wrap = False
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = True
    p.font.color.rgb = text_color
    p.alignment = PP_ALIGN.CENTER


def add_footer(slide, current_idx: int, total_slides: int):
    """Slim footer with KAIRO brand name + slide number."""
    # Footer separator line
    sep = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.02), Inches(11.72), Pt(1)
    )
    _solid(sep, SLATE_LINE)
    _no_line(sep)

    # Footer text
    fb = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(11.72), Inches(0.35))
    tf = fb.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = (
        f"KAIRO  |  Temporal Knowledge Graph Engineering Intelligence Platform  "
        f"|  Slide {current_idx} / {total_slides}"
    )
    p.font.size = Pt(8)
    p.font.color.rgb = TEXT_DIM


def add_section_header(slide, title, category_text, subtitle="", category_color=None):
    """Polished slide header: category pill + bold title + muted subtitle."""
    if category_color is None:
        category_color = TEAL_LIGHT

    # Category pill
    add_pill(
        slide,
        Inches(0.8), Inches(0.55),
        Inches(2.9), Inches(0.30),
        category_text.upper(),
        RGBColor(0x0B, 0x24, 0x2E),  # very dark teal bg
        category_color,
        border=TEAL_PRIMARY,
        font_size=8
    )

    # Title
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.92), Inches(11.72), Inches(0.65))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    if subtitle:
        tb2 = slide.shapes.add_textbox(Inches(0.8), Inches(1.57), Inches(11.72), Inches(0.38))
        tf2 = tb2.text_frame
        tf2.word_wrap = True
        tf2.margin_left = tf2.margin_right = tf2.margin_top = tf2.margin_bottom = 0
        p2 = tf2.paragraphs[0]
        p2.text = subtitle
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # Underline separator after header
    add_separator(slide, 2.0)


# ─── Card Primitives ─────────────────────────────────────────────────────────

def add_card(slide, left, top, width, height,
             title, items, accent=None, tag=None,
             title_size=13, item_size=10):
    """Dark rounded card with colored top accent bar, title, tag, and bullet list."""
    if accent is None:
        accent = TEAL_LIGHT

    # Card background
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    _solid(card, CARD_BG)
    card.line.color.rgb = CARD_BORDER
    card.line.width = Pt(0.75)

    # Colored top accent bar (full width, thin)
    bar = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        left + Pt(6), top + Pt(6),
        width - Pt(12), Pt(3)
    )
    _solid(bar, accent)
    _no_line(bar)

    # Text content
    pad = Inches(0.22)
    tb = slide.shapes.add_textbox(left + pad, top + Inches(0.2), width - pad * 2, height - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

    # Tag (optional small label)
    if tag:
        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(7.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = accent
        p_tag.space_after = Pt(3)
        p_title = tf.add_paragraph()
    else:
        p_title = tf.paragraphs[0]

    p_title.text = title
    p_title.font.size = Pt(title_size)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE
    p_title.space_after = Pt(6)

    # Divider (blank line spacer)
    p_div = tf.add_paragraph()
    p_div.text = ""
    p_div.space_after = Pt(2)

    for item in items:
        p = tf.add_paragraph()
        p.text = f"  {item}"
        p.font.size = Pt(item_size)
        p.font.color.rgb = TEXT_MUTED
        p.space_after = Pt(4)


def add_stat_card(slide, left, top, width, height,
                  value, label, subtext, color=None):
    """Large KPI stat card with accent-coloured big number."""
    if color is None:
        color = TEAL_LIGHT

    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    _solid(card, CARD_BG2)
    card.line.color.rgb = color
    card.line.width = Pt(1.2)

    # Bottom accent strip
    strip = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        left + Pt(6), top + height - Pt(5),
        width - Pt(12), Pt(4)
    )
    _solid(strip, color)
    _no_line(strip)

    pad = Inches(0.22)
    tb = slide.shapes.add_textbox(left + pad, top + Inches(0.18), width - pad * 2, height - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

    p_val = tf.paragraphs[0]
    p_val.text = value
    p_val.font.size = Pt(34)
    p_val.font.bold = True
    p_val.font.color.rgb = color

    p_lbl = tf.add_paragraph()
    p_lbl.text = label
    p_lbl.font.size = Pt(12)
    p_lbl.font.bold = True
    p_lbl.font.color.rgb = TEXT_WHITE
    p_lbl.space_after = Pt(5)

    p_sub = tf.add_paragraph()
    p_sub.text = subtext
    p_sub.font.size = Pt(9.5)
    p_sub.font.color.rgb = TEXT_MUTED


def add_step_row(slide, steps, top, row_height=Inches(1.8)):
    """Horizontal numbered step row with connecting chevron-like dividers."""
    n = len(steps)
    slide_w = Inches(13.333)
    margin = Inches(0.8)
    gap = Inches(0.15)
    card_w = (slide_w - margin * 2 - gap * (n - 1)) / n

    for i, (num, title, body, accent) in enumerate(steps):
        left = margin + i * (card_w + gap)

        # Card
        card = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, left, top, card_w, row_height
        )
        _solid(card, CARD_BG)
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(0.75)

        # Number circle (left inside)
        add_icon_circle(
            slide,
            left + Inches(0.38), top + row_height / 2,
            Inches(0.28),
            accent,
            str(num),
            TEXT_WHITE
        )

        # Text to right of circle
        tx = left + Inches(0.78)
        tw = card_w - Inches(0.9)
        tb = slide.shapes.add_textbox(tx, top + Inches(0.15), tw, row_height - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.space_after = Pt(4)

        p_b = tf.add_paragraph()
        p_b.text = body
        p_b.font.size = Pt(9.5)
        p_b.font.color.rgb = TEXT_MUTED


# ═══════════════════════════════════════════════════════════════════════════════
# SLIDE BUILDERS
# ═══════════════════════════════════════════════════════════════════════════════

def build_slide_1_title(prs, blank_layout):
    """Title slide: large hero text, metadata card, decorative elements."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)

    # Left vertical teal stripe accent
    vstripe = s.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(1.5), Pt(4), Inches(4.5)
    )
    _solid(vstripe, TEAL_PRIMARY)
    _no_line(vstripe)

    # Category pill top
    add_pill(
        s, Inches(0.8), Inches(1.6), Inches(3.8), Inches(0.33),
        "ENGINEERING INTELLIGENCE PLATFORM",
        RGBColor(0x07, 0x1F, 0x2A), TEAL_LIGHT,
        border=TEAL_PRIMARY, font_size=8.5
    )

    # KAIRO big wordmark
    tb_k = s.shapes.add_textbox(Inches(0.8), Inches(2.05), Inches(8.5), Inches(1.35))
    tf_k = tb_k.text_frame
    tf_k.word_wrap = False
    tf_k.margin_left = tf_k.margin_right = tf_k.margin_top = tf_k.margin_bottom = 0
    p_k = tf_k.paragraphs[0]
    p_k.text = "KAIRO"
    p_k.font.size = Pt(72)
    p_k.font.bold = True
    p_k.font.color.rgb = TEXT_WHITE

    # Subtitle line
    tb_sub = s.shapes.add_textbox(Inches(0.8), Inches(3.5), Inches(9.5), Inches(0.52))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    tf_sub.margin_left = tf_sub.margin_right = tf_sub.margin_top = tf_sub.margin_bottom = 0
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = "A Temporal Knowledge Graph Based Engineering Intelligence Platform"
    p_sub.font.size = Pt(17)
    p_sub.font.bold = False
    p_sub.font.color.rgb = TEAL_LIGHT

    # Purpose line
    tb_p = s.shapes.add_textbox(Inches(0.8), Inches(4.1), Inches(9.5), Inches(0.55))
    tf_p = tb_p.text_frame
    tf_p.word_wrap = True
    tf_p.margin_left = tf_p.margin_right = tf_p.margin_top = tf_p.margin_bottom = 0
    p_pu = tf_p.paragraphs[0]
    p_pu.text = (
        "Reconstructing and preserving architectural memory across commits, "
        "pull requests, and design decisions to eliminate undocumented decision drift."
    )
    p_pu.font.size = Pt(11.5)
    p_pu.font.color.rgb = TEXT_MUTED

    # Right-side teal glow circle (decorative)
    glow = s.shapes.add_shape(
        MSO_SHAPE.OVAL,
        Inches(10.5), Inches(0.8),
        Inches(2.6), Inches(2.6)
    )
    _solid(glow, RGBColor(0x0D, 0x2B, 0x28))
    _no_line(glow)

    glow2 = s.shapes.add_shape(
        MSO_SHAPE.OVAL,
        Inches(10.9), Inches(1.2),
        Inches(1.8), Inches(1.8)
    )
    _solid(glow2, RGBColor(0x11, 0x40, 0x3B))
    _no_line(glow2)

    tb_logo = s.shapes.add_textbox(Inches(10.9), Inches(1.2), Inches(1.8), Inches(1.8))
    tf_logo = tb_logo.text_frame
    tf_logo.word_wrap = False
    tf_logo.margin_left = tf_logo.margin_right = tf_logo.margin_top = tf_logo.margin_bottom = 0
    p_logo = tf_logo.paragraphs[0]
    p_logo.text = "K"
    p_logo.font.size = Pt(54)
    p_logo.font.bold = True
    p_logo.font.color.rgb = TEAL_LIGHT
    p_logo.alignment = PP_ALIGN.CENTER

    # Separator before metadata
    add_separator(s, 4.78, color=TEAL_PRIMARY)

    # Metadata block
    meta = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(4.9), Inches(11.72), Inches(1.75)
    )
    _solid(meta, CARD_BG)
    meta.line.color.rgb = CARD_BORDER
    meta.line.width = Pt(0.75)

    tf_m = meta.text_frame
    tf_m.word_wrap = True
    tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = tf_m.margin_bottom = Inches(0.2)

    p_m1 = tf_m.paragraphs[0]
    p_m1.text = "Team:  Sharvari Bhondekar   |   Aman Mehtar   |   Shruti Gauchandra"
    p_m1.font.size = Pt(12.5)
    p_m1.font.bold = True
    p_m1.font.color.rgb = TEXT_WHITE

    p_m2 = tf_m.add_paragraph()
    p_m2.text = "Mentors:  Prof. Kranti Gule   |   Dr. Tatwadarshi P. Nagarhalli (HOD)"
    p_m2.font.size = Pt(11)
    p_m2.font.color.rgb = CYAN_ACCENT
    p_m2.space_before = Pt(5)

    p_m3 = tf_m.add_paragraph()
    p_m3.text = (
        "Department of Artificial Intelligence & Data Science  |  "
        "Vidyavardhini's College of Engineering and Technology (VCET)"
    )
    p_m3.font.size = Pt(10)
    p_m3.font.color.rgb = TEXT_MUTED
    p_m3.space_before = Pt(5)

    add_footer(s, 1, 10)
    return s


def build_slide_2_problem(prs, blank_layout):
    """3-column problem statement slide."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "The Critical Problem: Engineering Memory Vaporization",
        "Industry Challenge",
        "Why modern software engineering teams lose architectural context over time",
        category_color=ROSE_ACCENT
    )

    COL_W = Inches(3.64)
    COL_TOP = Inches(2.12)
    COL_H = Inches(4.6)

    add_card(s, Inches(0.8),  COL_TOP, COL_W, COL_H,
        "Tool Fragmentation",
        [
            "Teams use fragmented tools: GitHub, Jira, Slack, wikis, PR threads.",
            "These systems track task status but never preserve why decisions were made.",
            "When original engineers leave, critical institutional memory vanishes.",
            "New engineers inherit codebases with zero verifiable context on trade-offs.",
        ],
        accent=PURPLE_ACCENT, tag="Siloed Information",
        title_size=13, item_size=10)

    add_card(s, Inches(4.84), COL_TOP, COL_W, COL_H,
        "Invisible Decision Drift",
        [
            "Documented architecture and live codebases continuously drift apart.",
            "Pull requests inadvertently violate foundational architectural decisions (ADRs).",
            "Technical debt accumulates silently until massive regressions occur.",
            "No objective mathematical index exists to measure architectural drift.",
        ],
        accent=AMBER_ALERT, tag="Silent Divergence",
        title_size=13, item_size=10)

    add_card(s, Inches(8.88), COL_TOP, COL_W, COL_H,
        "Temporal Blindness in AI",
        [
            "Standard Vector RAG retrieves code snippets by keyword similarity alone.",
            "Cannot distinguish an active architectural rule from a superseded 2021 choice.",
            "AI dev tools recommend obsolete practices as authoritative standards.",
            "Missing bitemporal intervals create high risk in AI-assisted coding.",
        ],
        accent=ROSE_ACCENT, tag="RAG Limitation",
        title_size=13, item_size=10)

    add_footer(s, 2, 10)
    return s


def build_slide_3_purpose(prs, blank_layout):
    """Project purpose slide with mission banner + 3-pillar cards."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Project Purpose: Why KAIRO Exists",
        "Core Mission",
        "Building an authoritative, bitemporal engineering knowledge graph for software reasoning",
        category_color=TEAL_LIGHT
    )

    # Mission banner (teal filled)
    banner = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(2.1), Inches(11.72), Inches(1.05)
    )
    _solid(banner, RGBColor(0x0D, 0x3B, 0x38))
    banner.line.color.rgb = TEAL_PRIMARY
    banner.line.width = Pt(1)

    # Left accent stripe on banner
    bstripe = s.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0.8), Inches(2.1), Pt(4), Inches(1.05)
    )
    _solid(bstripe, TEAL_PRIMARY)
    _no_line(bstripe)

    tf_b = banner.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = Inches(0.3)
    tf_b.margin_right = Inches(0.2)
    tf_b.margin_top = tf_b.margin_bottom = Inches(0.12)
    p_b1 = tf_b.paragraphs[0]
    p_b1.text = "Mission Statement:"
    p_b1.font.size = Pt(9)
    p_b1.font.bold = True
    p_b1.font.color.rgb = TEAL_LIGHT
    p_b2 = tf_b.add_paragraph()
    p_b2.text = (
        "Transform unstructured developer telemetry into an active, verifiable bitemporal knowledge graph - "
        "enabling teams to query, track, and protect the architectural rationale of their codebases."
    )
    p_b2.font.size = Pt(13)
    p_b2.font.bold = True
    p_b2.font.color.rgb = TEXT_WHITE

    # 3 pillar cards
    COL_W = Inches(3.64)
    COL_TOP = Inches(3.35)
    COL_H = Inches(3.35)

    add_card(s, Inches(0.8),  COL_TOP, COL_W, COL_H,
        "Reconstruct Reasoning",
        [
            "Mine commits, PR discussions, code reviews, and issue threads.",
            "Extract discrete architectural decisions with verbatim provenance quotes.",
            "Enable natural-language queries: 'Why did we choose JWT over Redis sessions?'",
        ],
        accent=TEAL_LIGHT, tag="Cognitive Memory", item_size=10.5)

    add_card(s, Inches(4.84), COL_TOP, COL_W, COL_H,
        "Pre-Merge Interception",
        [
            "Scan modified files in pending pull requests against the knowledge graph.",
            "Flag conflicts with documented architectural decisions before code merges.",
            "Prevent regressions caused by developer rotation and forgotten standards.",
        ],
        accent=AMBER_ALERT, tag="Proactive Protection", item_size=10.5)

    add_card(s, Inches(8.88), COL_TOP, COL_W, COL_H,
        "Quantify Repository Health",
        [
            "Introduce mathematical metrics for architecture governance.",
            "Decision Drift Index (DDI) measures codebase divergence from intent.",
            "Engineering Evolution Score (EES) tracks stability, ownership, and risk.",
        ],
        accent=GREEN_SUCCESS, tag="Verifiable Governance", item_size=10.5)

    add_footer(s, 3, 10)
    return s


def build_slide_4_two_layer(prs, blank_layout):
    """Two-layer trust isolation architecture - 2-column wide cards."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Architectural Innovation: Two-Layer Trust Isolation",
        "Zero-Hallucination Design",
        "Separating verifiable deterministic code facts from LLM-interpreted architectural decisions",
        category_color=CYAN_ACCENT
    )

    COL_TOP = Inches(2.12)
    COL_H   = Inches(4.6)
    COL_W   = Inches(5.65)

    add_card(s, Inches(0.8), COL_TOP, COL_W, COL_H,
        "Layer 1: Deterministic Fact Graph",
        [
            "Strictly factual engineering telemetry synced directly from GitHub APIs.",
            "Entities: Repositories, Commits, Authors, Pull Requests, Files, Diffs.",
            "Zero LLM involvement - guarantees 100% fidelity and zero hallucination risk.",
            "Deterministic edge linking connects commits, authors, PRs, and files with precise timestamps.",
            "Ground truth anchor for all downstream graph walks and impact predictions.",
        ],
        accent=CYAN_ACCENT, tag="100% Verifiable Reality",
        title_size=14, item_size=10.5)

    # Connecting arrow label
    arrow_tb = s.shapes.add_textbox(Inches(6.52), Inches(3.9), Inches(0.36), Inches(0.5))
    tf_a = arrow_tb.text_frame
    tf_a.margin_left = tf_a.margin_right = tf_a.margin_top = tf_a.margin_bottom = 0
    p_a = tf_a.paragraphs[0]
    p_a.text = "+"
    p_a.font.size = Pt(22)
    p_a.font.bold = True
    p_a.font.color.rgb = TEAL_PRIMARY
    p_a.alignment = PP_ALIGN.CENTER

    add_card(s, Inches(6.88), COL_TOP, COL_W, COL_H,
        "Layer 2: Interpreted Decision Graph",
        [
            "Architectural decisions and rationale extracted via LLMs from PR discussions.",
            "Bitemporal Validity Intervals: Every decision carries Valid-Time and Transaction-Time.",
            "Verbatim Provenance Quotation: Extracted claims must quote exact PR comments.",
            "Superseding Graph Edges: New ADRs automatically retire outdated decision nodes.",
            "Confidence Scoring: Each decision carries an empirical verification score (e.g. 94%).",
        ],
        accent=TEAL_LIGHT, tag="Bitemporal LLM Reasoning",
        title_size=14, item_size=10.5)

    add_footer(s, 4, 10)
    return s


def build_slide_5_graphrag(prs, blank_layout):
    """Three-Mode GraphRAG - 3 column cards."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Retrieval Innovation: Three-Mode GraphRAG Engine",
        "Retrieval Intelligence",
        "Dynamic mode selection that solves vocabulary mismatch and temporal blindness in AI-assisted code reasoning",
        category_color=TEAL_LIGHT
    )

    COL_W   = Inches(3.64)
    COL_TOP = Inches(2.12)
    COL_H   = Inches(4.6)

    add_card(s, Inches(0.8),  COL_TOP, COL_W, COL_H,
        "1. Anchored Retrieval",
        [
            "Starts from a specific file path node (e.g. auth/middleware.py).",
            "Recursive SQL CTE graph traversal across structural dependencies.",
            "Finds architectural decisions even with zero vocabulary overlap.",
            "Ideal for understanding the full history and intent behind a module.",
        ],
        accent=TEAL_LIGHT, tag="Structural CTE Walk", item_size=10.5)

    add_card(s, Inches(4.84), COL_TOP, COL_W, COL_H,
        "2. As-Of Bitemporal",
        [
            "Queries the repository state as it existed at any historical snapshot.",
            "Example: 'What was our session management standard in March 2023?'",
            "Filters validity intervals (valid_from <= T <= valid_to) to suppress future decisions.",
            "Prevents anachronisms and superseded policies from infecting analysis.",
        ],
        accent=PURPLE_ACCENT, tag="Time-Bounded Context", item_size=10.5)

    add_card(s, Inches(8.88), COL_TOP, COL_W, COL_H,
        "3. Semantic Similarity",
        [
            "High-dimensional vector embedding search powered by pgvector.",
            "Resilient fallback for broad, conceptual developer queries.",
            "Filters semantic nearest-neighbours through graph connectivity boundaries.",
            "Combines statistical vector search with structural graph precision.",
        ],
        accent=CYAN_ACCENT, tag="pgvector Fallback", item_size=10.5)

    add_footer(s, 5, 10)
    return s


def build_slide_6_metrics(prs, blank_layout):
    """DDI and EES metrics slide - 2 large stat cards + 2 description cards."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Novel Quantitative Metrics: DDI & EES",
        "Architectural Governance",
        "Mathematical metrics turning code health and architectural drift into actionable engineering KPIs",
        category_color=AMBER_ALERT
    )

    STAT_TOP = Inches(2.12)
    STAT_H   = Inches(2.0)
    COL_W    = Inches(5.65)
    DESC_TOP = Inches(4.28)
    DESC_H   = Inches(2.45)

    add_stat_card(s, Inches(0.8),  STAT_TOP, COL_W, STAT_H,
        "72 / 100",
        "Decision Drift Index  (DDI)",
        "Quantifies the mathematical divergence between documented architectural intent and active code. "
        "High DDI signals elevated architectural risk and potential technical debt bankruptcy.",
        color=AMBER_ALERT)

    add_stat_card(s, Inches(6.88), STAT_TOP, COL_W, STAT_H,
        "85 / 100",
        "Engineering Evolution Score  (EES)",
        "Longitudinal repository health index evaluating delivery stability, author ownership diversity, "
        "and decision drift across rolling quarterly windows.",
        color=GREEN_SUCCESS)

    add_card(s, Inches(0.8),  DESC_TOP, COL_W, DESC_H,
        "Why DDI Matters",
        [
            "Detects silent architecture erosion before technical debt bankruptcy.",
            "Flags undocumented modifications to foundational layers (auth, database, caching).",
            "Provides automated merge blockers when PRs spike DDI beyond safe thresholds.",
        ],
        accent=AMBER_ALERT, item_size=10.5)

    add_card(s, Inches(6.88), DESC_TOP, COL_W, DESC_H,
        "Why EES Matters",
        [
            "Replaces subjective code reviews with a repeatable empirical score.",
            "Assesses module bus-factor by tracking commit author concentration over time.",
            "Guides sprint refactoring allocation based on factual component decay.",
        ],
        accent=GREEN_SUCCESS, item_size=10.5)

    add_footer(s, 6, 10)
    return s


def build_slide_7_impact_scanner(prs, blank_layout):
    """Change Impact Scanner walkthrough - 3-step columns."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Pre-Merge Intelligence: Change Impact Scanner",
        "Pull Request Governance",
        "PR #412 walkthrough: detecting blast radius and architectural conflicts before merge",
        category_color=ROSE_ACCENT
    )

    # PR badge header
    pr_badge = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(2.12), Inches(11.72), Inches(0.42)
    )
    _solid(pr_badge, RGBColor(0x1C, 0x0E, 0x06))
    pr_badge.line.color.rgb = AMBER_ALERT
    pr_badge.line.width = Pt(0.75)

    tf_pr = pr_badge.text_frame
    tf_pr.word_wrap = False
    tf_pr.margin_left = Inches(0.3)
    tf_pr.margin_right = tf_pr.margin_top = tf_pr.margin_bottom = Inches(0.05)
    p_pr = tf_pr.paragraphs[0]
    p_pr.text = (
        "Simulated PR  #412  |  Migrate auth middleware to stateless JWTs  "
        "|  +142 lines  -89 lines  |  Author: @sharvari"
    )
    p_pr.font.size = Pt(10)
    p_pr.font.bold = True
    p_pr.font.color.rgb = AMBER_ALERT

    COL_W   = Inches(3.64)
    COL_TOP = Inches(2.68)
    COL_H   = Inches(4.04)

    add_card(s, Inches(0.8),  COL_TOP, COL_W, COL_H,
        "Step 1: Conflict Detection",
        [
            "PR #412 modifies authentication middleware to stateless JWTs (+142, -89).",
            "KAIRO scans files and traverses graph to discover ADR-042.",
            "ADR-042 mandated session-based auth as the documented standard.",
            "Alert: 'PR contradicts architectural decision ADR-042 - review required.'",
        ],
        accent=AMBER_ALERT, tag="ADR Collision", item_size=10.5)

    add_card(s, Inches(4.84), COL_TOP, COL_W, COL_H,
        "Step 2: Churn & Bug Risk",
        [
            "Scanner queries Layer 1 telemetry for auth/middleware.py historical data.",
            "File Churn: Modified 47 times in the last 6 months.",
            "Historical Regression Rate: 23% of previous edits introduced defects.",
            "Warning: 'Fragile file detected. Additional security review recommended.'",
        ],
        accent=PURPLE_ACCENT, tag="Telemetry Risk", item_size=10.5)

    add_card(s, Inches(8.88), COL_TOP, COL_W, COL_H,
        "Step 3: Resolution & Clearance",
        [
            "Original architect (@dave) is inactive; @alice holds 67% module ownership.",
            "Review auto-assigned to active primary maintainers.",
            "Team generates superseding ADR-048 to formally approve JWT migration.",
            "DDI recalculated: Architecture remains 100% documented upon merge.",
        ],
        accent=GREEN_SUCCESS, tag="Resolution", item_size=10.5)

    add_footer(s, 7, 10)
    return s


def build_slide_8_agile(prs, blank_layout):
    """Agile hierarchy and planning poker - 2-column."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Agile Alignment: Multi-Level Hierarchy & Planning Poker",
        "Full-Lifecycle Agile",
        "Connecting high-level business objectives to architecture-aware backlog execution",
        category_color=CYAN_ACCENT
    )

    COL_W   = Inches(5.65)
    COL_TOP = Inches(2.12)
    COL_H   = Inches(4.6)

    add_card(s, Inches(0.8), COL_TOP, COL_W, COL_H,
        "Multi-Level Work Hierarchy  (/demo/hierarchy)",
        [
            "Structured alignment: Objectives -> Projects -> Epics -> Issues -> Sub-tasks.",
            "Live Progress Rollups: Automatic point completion at each parent tier.",
            "Architecture Impact Badges: Issues flagged by the scanner shown on the tree.",
            "Bidirectional GitHub sync: Issues and milestones with real-time commit data.",
            "Unified visibility for both developers and project managers.",
        ],
        accent=CYAN_ACCENT, tag="Strategic Rollup",
        title_size=13, item_size=10.5)

    add_card(s, Inches(6.88), COL_TOP, COL_W, COL_H,
        "Interactive Planning Poker  (/demo/board)",
        [
            "Architecture-Aware Story Point Estimation integrated into sprint board.",
            "Fibonacci Deck: 1, 2, 3, 5, 8, 13, 21 point scale for consensus voting.",
            "Simulated team votes from @aman, @shruti, @sharvari, and @alex.",
            "AI Historical Benchmark: Recommends complexity based on file fragility.",
            "1-click commitment updates sprint velocity and backlog balance.",
        ],
        accent=TEAL_LIGHT, tag="Team Consensus",
        title_size=13, item_size=10.5)

    add_footer(s, 8, 10)
    return s


def build_slide_9_results(prs, blank_layout):
    """Empirical benchmark results - 3 stat cards + tech stack card."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Empirical Validation & Benchmark Results",
        "Experimental Findings",
        "Rigorous benchmarks across open-source repositories and simulated engineering testbeds",
        category_color=GREEN_SUCCESS
    )

    STAT_W   = Inches(3.64)
    STAT_TOP = Inches(2.12)
    STAT_H   = Inches(2.1)

    add_stat_card(s, Inches(0.8),  STAT_TOP, STAT_W, STAT_H,
        "7.1x",
        "Cross-Reference Recovery",
        "Timeline API graph ingestion recovered 7.1x more relationships between "
        "PRs, commits, and reviews vs. standard regex extraction.",
        color=TEAL_LIGHT)

    add_stat_card(s, Inches(4.84), STAT_TOP, STAT_W, STAT_H,
        "56% -> 27%",
        "Overlap Reduction",
        "Dynamic Hub Degree Suppression prevents sweeping commits from dominating "
        "search, cutting result-set overlap by more than half.",
        color=CYAN_ACCENT)

    add_stat_card(s, Inches(8.88), STAT_TOP, STAT_W, STAT_H,
        "< 1%",
        "Hallucination Rejection",
        "Verbatim-quote verification on Layer 2 decisions eliminated fabricated "
        "citations, achieving 99%+ provenance precision.",
        color=GREEN_SUCCESS)

    # Full-width tech stack card
    add_card(s, Inches(0.8), Inches(4.38), Inches(11.72), Inches(2.35),
        "Production Technology Stack",
        [
            "Backend:   Python 3.13, FastAPI async REST API, Pydantic validation models.",
            "Database:  PostgreSQL + pgvector + recursive SQL CTEs (replaces heavy Neo4j overhead).",
            "Frontend:  Next.js 16 (React 19, Turbopack), Tailwind CSS 4, Lucide React iconography.",
            "LLMOps:    OpenRouter proxy (Cohere, Qwen, Llama) with content-hash caching for reproducible inference.",
        ],
        accent=PURPLE_ACCENT, tag="Engineering Stack",
        title_size=13, item_size=10.5)

    add_footer(s, 9, 10)
    return s


def build_slide_10_conclusion(prs, blank_layout):
    """Conclusion - 3 column impact pillars + final CTA."""
    s = prs.slides.add_slide(blank_layout)
    set_bg(s, prs)
    add_decorative_accents(s, prs)
    add_section_header(
        s,
        "Conclusion: The Strategic Impact of KAIRO",
        "Project Impact",
        "Preserving intellectual capital and building self-reasoning software engineering ecosystems",
        category_color=TEAL_LIGHT
    )

    COL_W   = Inches(3.64)
    COL_TOP = Inches(2.12)
    COL_H   = Inches(3.85)

    add_card(s, Inches(0.8),  COL_TOP, COL_W, COL_H,
        "For Engineering Teams",
        [
            "Zero Knowledge Loss: Engineers instantly understand why code was written.",
            "Safer Code Reviews: Know the architectural blast radius before merging.",
            "Confidence in Refactoring: Identify fragile hotspots and outdated decisions.",
            "Eliminates guesswork in legacy maintenance workflows.",
        ],
        accent=TEAL_LIGHT, tag="Developer Productivity", item_size=10.5)

    add_card(s, Inches(4.84), COL_TOP, COL_W, COL_H,
        "For Engineering Leadership",
        [
            "Objective Quality Metrics: Track DDI and EES on executive dashboards.",
            "Eliminate Architectural Debt: Identify divergence months before outages.",
            "Auditability: Verbatim provenance provides enterprise governance paper-trails.",
        ],
        accent=CYAN_ACCENT, tag="Governance & Oversight", item_size=10.5)

    add_card(s, Inches(8.88), COL_TOP, COL_W, COL_H,
        "The Research Contribution",
        [
            "Solves Temporal Blindness: Bitemporal intervals as the key for LLMOps in codebases.",
            "Two-Layer Trust Paradigm: Deterministic telemetry + probabilistic LLM outputs coexist safely.",
            "A New Category: Self-reasoning software engineering memory platform.",
        ],
        accent=GREEN_SUCCESS, tag="Academic Innovation", item_size=10.5)

    # Bottom CTA banner
    cta = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(0.8), Inches(6.12), Inches(11.72), Inches(0.72)
    )
    _solid(cta, RGBColor(0x08, 0x2E, 0x2A))
    cta.line.color.rgb = TEAL_PRIMARY
    cta.line.width = Pt(1)

    tf_cta = cta.text_frame
    tf_cta.word_wrap = False
    tf_cta.margin_left = Inches(0.3)
    tf_cta.margin_right = tf_cta.margin_top = tf_cta.margin_bottom = Inches(0.1)
    p_cta = tf_cta.paragraphs[0]
    p_cta.text = (
        "KAIRO  |  github.com/sharvarianand/kairo  "
        "|  Try the live demo at  /demo?mode=judge"
    )
    p_cta.font.size = Pt(13)
    p_cta.font.bold = True
    p_cta.font.color.rgb = TEAL_LIGHT
    p_cta.alignment = PP_ALIGN.CENTER

    add_footer(s, 10, 10)
    return s


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def build_presentation():
    prs = pptx.Presentation()
    prs.slide_width  = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    build_slide_1_title(prs, blank)
    build_slide_2_problem(prs, blank)
    build_slide_3_purpose(prs, blank)
    build_slide_4_two_layer(prs, blank)
    build_slide_5_graphrag(prs, blank)
    build_slide_6_metrics(prs, blank)
    build_slide_7_impact_scanner(prs, blank)
    build_slide_8_agile(prs, blank)
    build_slide_9_results(prs, blank)
    build_slide_10_conclusion(prs, blank)

    prs.save(OUTPUT_FILE)
    print(f"Presentation saved: {OUTPUT_FILE}")
    print(f"Slides: {len(prs.slides)}")


if __name__ == "__main__":
    build_presentation()
