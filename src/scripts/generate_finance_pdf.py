import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AWO Admin Panel — Finance Module Backend API Specification")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "CONFIDENTIAL — FOR BACKEND ENGINEERING & INTEGRATION")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        
        self.restoreState()

def build_pdf():
    pdf_filename = r"c:\Projects\AWO-admin-FE\awo-admin\AWO_Finance_Module_API_Specification.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#006E1C")
    dark_slate = colors.HexColor("#0F172A")
    text_muted = colors.HexColor("#475569")
    code_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#CBD5E1")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=text_muted,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=dark_slate,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=dark_slate,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        backColor=code_bg,
        borderColor=border_color,
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8
    )

    badge_get = ParagraphStyle('BadgeGet', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#0369A1"))
    badge_put = ParagraphStyle('BadgePut', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#B45309"))

    story = []

    # Title Banner
    story.append(Paragraph("AWO Admin Platform", title_style))
    story.append(Paragraph("<b>Finance Module — Backend API Requirements & Data Contract</b>", ParagraphStyle('Sub', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=dark_slate)))
    story.append(Paragraph("Document Version: 1.0 &nbsp;|&nbsp; Target: Backend Development Team &nbsp;|&nbsp; Scope: Phase 8 Financial Architecture", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=14))

    # Executive Overview
    story.append(Paragraph("1. Architecture Overview & Core Financial Workflows", h1_style))
    story.append(Paragraph(
        "The AWO Finance Module manages end-to-end monetary transactions, customer escrow guarantees, provider payouts, refund audits, dynamic commission management, and temporal revenue reporting. The backend API must expose RESTful endpoints adhering to standard JSON response conventions.",
        body_style
    ))

    overview_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Endpoint Route</b>", body_style), Paragraph("<b>Key Responsibilities</b>", body_style)],
        [Paragraph("Transactions", body_style), Paragraph("/api/v1/admin/finance/transactions", body_style), Paragraph("Audit trail for all payments, refunds, escrow holds, and payouts.", body_style)],
        [Paragraph("Escrow System", body_style), Paragraph("/api/v1/admin/finance/escrow", body_style), Paragraph("Holds customer funds securely until mission completion or dispute.", body_style)],
        [Paragraph("Payouts", body_style), Paragraph("/api/v1/admin/finance/payouts", body_style), Paragraph("Tracks provider earnings disbursements to bank/Stripe accounts.", body_style)],
        [Paragraph("Refunds", body_style), Paragraph("/api/v1/admin/finance/refunds", body_style), Paragraph("Customer refund review, approval, rejection, and settlement.", body_style)],
        [Paragraph("Commission", body_style), Paragraph("/api/v1/admin/finance/commission", body_style), Paragraph("Configures global baseline % and category-specific override fees.", body_style)],
        [Paragraph("Revenue Reports", body_style), Paragraph("/api/v1/admin/finance/revenue-reports", body_style), Paragraph("Aggregates gross volume, platform cut, payouts, and net income.", body_style)],
    ]
    t_overview = Table(overview_data, colWidths=[1.3*inch, 2.3*inch, 3.4*inch])
    t_overview.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_overview)
    story.append(Spacer(1, 10))

    # Section 2: Standard Envelope & Pagination
    story.append(Paragraph("2. Standard API Response Convention & Pagination", h1_style))
    story.append(Paragraph(
        "All list endpoints must return a standardized JSON envelope with a <code>data</code> array and optional <code>metadata</code> pagination block.",
        body_style
    ))
    envelope_sample = """{\n  "data": [ ... ],\n  "metadata": {\n    "page": 1,\n    "page_size": 20,\n    "total": 142\n  }\n}"""
    story.append(Paragraph(envelope_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # Section 3: Detailed Endpoints
    story.append(Paragraph("3. Detailed Endpoint Specifications", h1_style))

    # 3.1 Transactions
    story.append(Paragraph("3.1 Transactions API", h2_style))
    story.append(Paragraph("<b>GET /api/v1/admin/finance/transactions</b> — List Transactions", body_style))
    story.append(Paragraph("<b>Query Parameters:</b> <code>page</code> (int), <code>page_size</code> (int), <code>status</code> ('completed'|'pending'|'failed'|'refunded'|'held_in_escrow'|'all'), <code>type</code> ('booking_payment'|'payout'|'refund'|'commission'|'all'), <code>search</code> (string).", body_style))
    tx_sample = """{\n  "id": "tx_8912",\n  "transaction_code": "TX-8912",\n  "reference_number": "REF-2026-9021",\n  "booking_id": "bk_101",\n  "booking_code": "BK-9021",\n  "customer": { "id": "cust_1", "name": "Johnathan Miller", "email": "john@example.com" },\n  "provider": { "id": "prov_1", "name": "Michael Dubois", "email": "michael@example.com" },\n  "amount": 125.00,\n  "currency": "EUR",\n  "type": "booking_payment",\n  "status": "completed",\n  "payment_method": "Credit Card (Visa **** 4242)",\n  "created_at": "2026-09-18T14:30:00Z"\n}"""
    story.append(Paragraph(tx_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("<b>GET /api/v1/admin/finance/transactions/:id</b> — Transaction Detail", body_style))
    story.append(Paragraph("Returns a single Transaction object containing complete audit trail and optional <code>metadata</code> payload.", body_style))
    story.append(Spacer(1, 6))

    # 3.2 Escrow
    story.append(Paragraph("3.2 Escrow Management API", h2_style))
    story.append(Paragraph("<b>GET /api/v1/admin/finance/escrow</b> — List Escrow Records", body_style))
    story.append(Paragraph("<b>Query Parameters:</b> <code>page</code>, <code>page_size</code>, <code>status</code> ('held'|'pending_release'|'released'|'refunded'|'disputed'|'all'), <code>search</code>.", body_style))
    escrow_sample = """{\n  "data": [\n    {\n      "id": "esc_501",\n      "reference": "ESC-9021",\n      "booking_id": "bk_101",\n      "booking_code": "BK-9021",\n      "customer": { "id": "cust_1", "name": "Elena Rostova" },\n      "provider": { "id": "prov_2", "name": "Claire Moreau" },\n      "amount": 250.00,\n      "currency": "EUR",\n      "status": "held",\n      "hold_date": "2026-09-15T10:00:00Z",\n      "release_date": "2026-09-22T18:00:00Z",\n      "service_completed_at": null,\n      "created_at": "2026-09-15T10:00:00Z",\n      "notes": "Payment secured upon mission confirmation"\n    }\n  ],\n  "summary": {\n    "total_escrow": 12540.00,\n    "pending_release": 3420.00,\n    "released": 45100.00,\n    "refunded": 1200.00,\n    "currency": "EUR"\n  }\n}"""
    story.append(Paragraph(escrow_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))
    
    story.append(Paragraph("<b>GET /api/v1/admin/finance/escrow/summary</b> — Escrow KPI Totals", body_style))
    story.append(Paragraph("Returns <code>{ total_escrow, pending_release, released, refunded, currency }</code> for fast dashboard metric widgets.", body_style))
    story.append(Spacer(1, 6))

    # Page Break for clean reading
    story.append(PageBreak())

    # 3.3 Payouts
    story.append(Paragraph("3.3 Provider Disbursements & Payouts API", h2_style))
    story.append(Paragraph("<b>GET /api/v1/admin/finance/payouts</b> — List Payouts", body_style))
    story.append(Paragraph("<b>Query Parameters:</b> <code>page</code>, <code>page_size</code>, <code>status</code> ('pending'|'processing'|'paid'|'failed'|'all'), <code>search</code>.", body_style))
    payout_sample = """{\n  "id": "po_301",\n  "payout_code": "PO-8012",\n  "provider": { "id": "prov_1", "name": "Michael Dubois", "email": "michael@example.com" },\n  "amount": 340.00,\n  "currency": "EUR",\n  "booking_code": "BK-9018",\n  "status": "paid",\n  "payout_method": "Bank Transfer (SEPA IBAN **** 8921)",\n  "requested_at": "2026-09-14T09:00:00Z",\n  "processed_at": "2026-09-16T12:30:00Z",\n  "created_at": "2026-09-14T09:00:00Z",\n  "failure_reason": null\n}"""
    story.append(Paragraph(payout_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("<b>GET /api/v1/admin/finance/payouts/:id</b> — Payout Audit Record", body_style))
    story.append(Spacer(1, 6))

    # 3.4 Refunds
    story.append(Paragraph("3.4 Customer Refunds API", h2_style))
    story.append(Paragraph("<b>GET /api/v1/admin/finance/refunds</b> — List Refunds", body_style))
    story.append(Paragraph("<b>Query Parameters:</b> <code>page</code>, <code>page_size</code>, <code>status</code> ('requested'|'under_review'|'approved'|'rejected'|'processing'|'completed'|'all'), <code>search</code>.", body_style))
    refund_sample = """{\n  "id": "ref_401",\n  "refund_code": "REF-5021",\n  "booking_code": "BK-8902",\n  "customer": { "id": "cust_3", "name": "David Guerin", "email": "david@example.com" },\n  "amount": 75.00,\n  "currency": "EUR",\n  "reason": "Provider arrived 2 hours late and incomplete task",\n  "status": "completed",\n  "requested_at": "2026-09-10T11:00:00Z",\n  "reviewed_at": "2026-09-11T14:20:00Z",\n  "processed_at": "2026-09-12T09:15:00Z",\n  "admin_notes": "Approved 50% partial refund after provider dispute review"\n}"""
    story.append(Paragraph(refund_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("<b>GET /api/v1/admin/finance/refunds/:id</b> — Refund Detail", body_style))
    story.append(Spacer(1, 6))

    # 3.5 Commission
    story.append(Paragraph("3.5 Platform Commission Configuration API", h2_style))
    story.append(Paragraph("<b>GET /api/v1/admin/finance/commission</b> — Fetch Current Commission Rates", body_style))
    comm_get_sample = """{\n  "default_commission_percentage": 15.0,\n  "category_commissions": [\n    { "category_id": "cat_1", "category_name": "Plumbing & Drainage", "commission_percentage": 18.0, "is_custom": true },\n    { "category_id": "cat_2", "category_name": "Home Cleaning", "commission_percentage": 15.0, "is_custom": false },\n    { "category_id": "cat_3", "category_name": "Electrical Diagnostics", "commission_percentage": 20.0, "is_custom": true }\n  ],\n  "updated_at": "2026-09-01T10:00:00Z",\n  "updated_by": "Super Admin"\n}"""
    story.append(Paragraph(comm_get_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    story.append(Paragraph("<b>PUT /api/v1/admin/finance/commission</b> — Update Commission Rates", body_style))
    comm_put_sample = """// Request Body Payload\n{\n  "default_commission_percentage": 16.0,\n  "category_commissions": [\n    { "category_id": "cat_1", "commission_percentage": 18.5 },\n    { "category_id": "cat_3", "commission_percentage": 20.0 }\n  ]\n}"""
    story.append(Paragraph(comm_put_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))
    story.append(Spacer(1, 6))

    # 3.6 Revenue Reports
    story.append(Paragraph("3.6 Revenue Reports & Aggregations API", h2_style))
    story.append(Paragraph("<b>GET /api/v1/admin/finance/revenue-reports</b> — Aggregated Financial Periods", body_style))
    story.append(Paragraph("<b>Query Parameters:</b> <code>period</code> ('daily'|'weekly'|'monthly'|'yearly', default: 'monthly'), <code>start_date</code> (ISO), <code>end_date</code> (ISO).", body_style))
    rev_sample = """{\n  "summary": {\n    "total_revenue": 48320.00,\n    "total_commission": 7248.00,\n    "total_payouts": 41072.00,\n    "total_refunds": 650.00,\n    "currency": "EUR"\n  },\n  "periods": [\n    {\n      "period": "2026-06",\n      "gross_booking_value": 11400.00,\n      "platform_commission": 1710.00,\n      "provider_payouts": 9690.00,\n      "refunds": 150.00,\n      "net_revenue": 1560.00,\n      "currency": "EUR"\n    },\n    {\n      "period": "2026-07",\n      "gross_booking_value": 12100.00,\n      "platform_commission": 1815.00,\n      "provider_payouts": 10285.00,\n      "refunds": 200.00,\n      "net_revenue": 1615.00,\n      "currency": "EUR"\n    }\n  ]\n}"""
    story.append(Paragraph(rev_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    # Page Break for Implementation Notes
    story.append(PageBreak())

    # Section 4: Status Enums & Business Rules
    story.append(Paragraph("4. Status Codes & Domain Enums", h1_style))
    
    enums_table_data = [
        [Paragraph("<b>Entity</b>", body_style), Paragraph("<b>Valid Status Values</b>", body_style), Paragraph("<b>State Transitions & Notes</b>", body_style)],
        [
            Paragraph("Transaction", body_style),
            Paragraph("<code>pending</code>, <code>completed</code>, <code>failed</code>, <code>refunded</code>, <code>held_in_escrow</code>", body_style),
            Paragraph("Transitions to <code>held_in_escrow</code> on customer checkout, <code>completed</code> when funds are captured/released.", body_style)
        ],
        [
            Paragraph("Escrow", body_style),
            Paragraph("<code>held</code>, <code>pending_release</code>, <code>released</code>, <code>refunded</code>, <code>disputed</code>", body_style),
            Paragraph("Auto-moves to <code>pending_release</code> upon mission completion. Disputed blocks release until complaint resolved.", body_style)
        ],
        [
            Paragraph("Payout", body_style),
            Paragraph("<code>pending</code>, <code>processing</code>, <code>paid</code>, <code>failed</code>", body_style),
            Paragraph("Tracks bank transfers to service providers. If <code>failed</code>, must include <code>failure_reason</code>.", body_style)
        ],
        [
            Paragraph("Refund", body_style),
            Paragraph("<code>requested</code>, <code>under_review</code>, <code>approved</code>, <code>rejected</code>, <code>processing</code>, <code>completed</code>", body_style),
            Paragraph("Admin review flow. On approval, triggers payment gateway refund reversal.", body_style)
        ],
    ]
    t_enums = Table(enums_table_data, colWidths=[1.2*inch, 2.5*inch, 3.3*inch])
    t_enums.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_enums)
    story.append(Spacer(1, 14))

    # Section 5: Authentication & HTTP Status Codes
    story.append(Paragraph("5. Authentication & HTTP Error Handling", h1_style))
    story.append(Paragraph(
        "Every endpoint requires a Bearer JWT Token in the <code>Authorization</code> header: <code>Authorization: Bearer &lt;access_token&gt;</code>.<br/>"
        "Errors must return standard HTTP status codes and a JSON error body:",
        body_style
    ))
    
    error_sample = """// Example Error Response Body\n{\n  "error": "Validation Error",\n  "message": "commission_percentage must be between 0 and 100",\n  "status_code": 400\n}"""
    story.append(Paragraph(error_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))

    http_codes = [
        [Paragraph("<b>Status Code</b>", body_style), Paragraph("<b>Meaning</b>", body_style), Paragraph("<b>Frontend Action</b>", body_style)],
        [Paragraph("<code>200 OK / 201 Created</code>", body_style), Paragraph("Request processed successfully.", body_style), Paragraph("Renders table/modal data and displays success toast.", body_style)],
        [Paragraph("<code>400 Bad Request</code>", body_style), Paragraph("Invalid payload fields or date format.", body_style), Paragraph("Displays inline field validation message.", body_style)],
        [Paragraph("<code>401 Unauthorized</code>", body_style), Paragraph("Token expired or missing.", body_style), Paragraph("Triggers silent token refresh or redirects to /login.", body_style)],
        [Paragraph("<code>403 Forbidden</code>", body_style), Paragraph("Admin user lacks financial clearance.", body_style), Paragraph("Displays access denied warning.", body_style)],
        [Paragraph("<code>404 Not Found</code>", body_style), Paragraph("Transaction / Payout / Refund ID does not exist.", body_style), Paragraph("Renders empty state with back button.", body_style)],
        [Paragraph("<code>500 Server Error</code>", body_style), Paragraph("Internal database or gateway exception.", body_style), Paragraph("Shows friendly error callout with retry button.", body_style)],
    ]
    t_codes = Table(http_codes, colWidths=[1.8*inch, 2.4*inch, 2.8*inch])
    t_codes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_codes)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully at: {pdf_filename}")

if __name__ == '__main__':
    build_pdf()
