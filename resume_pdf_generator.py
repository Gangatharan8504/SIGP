import os
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def create_resume_pdf(data=None, output_path="Gangatharan_M_Resume.pdf"):
    if data is None:
        data = {
            "name": "GANGATHARAN M",
            "phone": "7666578504",
            "email": "gangatharan8504@gmail.com",
            "location": "Namakkal, Tamil Nadu, India",
            "links": [
                {"label": "GitHub", "url": "https://github.com"},
                {"label": "LeetCode", "url": "https://leetcode.com"},
                {"label": "LinkedIn", "url": "https://linkedin.com"},
            ],
            "objective": (
                "Recent B.Tech Information Technology student with a strong foundation in Java and web development "
                "technologies (HTML, CSS, JavaScript, MySQL). Hands-on experience gained through academic projects, "
                "a full-stack development internship, and continuous learning through online certifications. "
                "Eager to start my career as a Software Engineer, contribute to real-world projects, and grow my "
                "technical skills in a dynamic team environment."
            ),
            "education": [
                {
                    "degree": "B.Tech, Information Technology",
                    "year": "Expected 2027",
                    "college": "V.S.B Engineering College, Karur, Tamil Nadu (Affiliated to Anna University)",
                    "score": "CGPA: 7.48"
                }
            ],
            "projects": [
                {
                    "title": "E-Waste Management System",
                    "type": "Full-Stack Project",
                    "tech": "MongoDB, Express.js, React.js, Node.js",
                    "bullets": [
                        "Developed a full-stack e-waste management web application for pickup request scheduling and tracking.",
                        "Built responsive user interfaces using React.js and RESTful APIs with Express.js and Node.js.",
                        "Implemented secure user authentication, admin dashboard, and, real-time request status management.",
                        "Integrated email notifications and MongoDB for efficient data storage and management."
                    ]
                }
            ],
            "internships": [
                {
                    "company": "Astonish Infotech",
                    "duration": "Duration: 1 Month",
                    "role": "Full Stack Development Intern",
                    "bullets": [
                        "Learned and practiced full-stack web development concepts, including front-end and back-end integration.",
                        "Worked on building and testing web application features as part of a guided learning project.",
                        "Gained practical exposure to the software development workflow, debugging, and team collaboration."
                    ]
                }
            ],
            "skills": [
                "Programming Languages: Java",
                "Web Technologies: HTML, CSS",
                "Database: MySQL"
            ],
            "certifications": [
                "Programming in Java (Elite Certification) — NPTEL, April 2025",
                "Web Application Development — Glorious Web Technology, January 2026",
                "Infosys Springboard – Virtual Internship 6.0, June 2026"
            ],
            "soft_skills": [
                "Problem-Solving & Analytical Thinking",
                "Teamwork & Collaboration",
                "Adaptability & Quick Learning"
            ],
            "languages": "Tamil, English"
        }

    buffer = io.BytesIO() if output_path is None else output_path
    
    # Document Setup with standard 0.5 inch (36 pt) margins
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=32
    )

    usable_width = 612 - 72 # 540 pt
    styles = getSampleStyleSheet()

    # Custom Typography Styles matching the template
    name_style = ParagraphStyle(
        'ResumeName',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=20,
        alignment=TA_CENTER,
        textColor=colors.black,
        spaceAfter=3
    )

    contact_style = ParagraphStyle(
        'ResumeContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.black,
        spaceAfter=2
    )

    links_style = ParagraphStyle(
        'ResumeLinks',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.black,
        spaceAfter=8
    )

    section_title_style = ParagraphStyle(
        'ResumeSectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        alignment=TA_LEFT,
        textColor=colors.black,
        spaceBefore=5,
        spaceAfter=1
    )

    body_style = ParagraphStyle(
        'ResumeBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_JUSTIFY,
        textColor=colors.black
    )

    left_bold_style = ParagraphStyle(
        'ResumeLeftBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
        textColor=colors.black
    )

    right_italic_style = ParagraphStyle(
        'ResumeRightItalic',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        alignment=TA_RIGHT,
        textColor=colors.black
    )

    sub_italic_style = ParagraphStyle(
        'ResumeSubItalic',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=colors.black
    )

    sub_regular_style = ParagraphStyle(
        'ResumeSubRegular',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=colors.black
    )

    bullet_style = ParagraphStyle(
        'ResumeBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=colors.black,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=1.5
    )

    story = []

    # 1. Header: Name
    story.append(Paragraph(data.get("name", "GANGATHARAN M").upper(), name_style))

    # 2. Contact details
    phone = data.get("phone", "7666578504")
    email = data.get("email", "gangatharan8504@gmail.com")
    location = data.get("location", "Namakkal, Tamil Nadu, India")
    
    # Clean text icons
    contact_text = f"&#9742; {phone} &nbsp;&nbsp;&nbsp;&nbsp; &#9993; {email} &nbsp;&nbsp;&nbsp;&nbsp; &#9906; {location}"
    story.append(Paragraph(contact_text, contact_style))

    # 3. Links Line
    links_list = data.get("links", [])
    if links_list:
        link_strs = []
        for l in links_list:
            lbl = l.get("label", "")
            url = l.get("url", "")
            if url:
                link_strs.append(f'<a href="{url}"><u>{lbl}</u></a>')
            else:
                link_strs.append(f"<u>{lbl}</u>")
        links_line = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".join(link_strs)
        story.append(Paragraph(links_line, links_style))
    else:
        story.append(Spacer(1, 4))

    # Helper for Section Title + Solid Underline Rule
    def add_section_header(title):
        story.append(Paragraph(title.upper(), section_title_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceBefore=1, spaceAfter=4))

    # 4. CAREER OBJECTIVE
    if data.get("objective"):
        add_section_header("CAREER OBJECTIVE")
        story.append(Paragraph(data["objective"], body_style))
        story.append(Spacer(1, 4))

    # 5. EDUCATION
    if data.get("education"):
        add_section_header("EDUCATION")
        for edu in data["education"]:
            # Table for Left Degree / Right Year
            row1 = [
                Paragraph(f"<b>{edu.get('degree', '')}</b>", left_bold_style),
                Paragraph(f"{edu.get('year', '')}", right_italic_style)
            ]
            t = Table([row1], colWidths=[usable_width * 0.72, usable_width * 0.28])
            t.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(t)
            
            if edu.get("college"):
                story.append(Paragraph(f"<i>{edu.get('college')}</i>", sub_italic_style))
            if edu.get("score"):
                story.append(Paragraph(f"<b>{edu.get('score')}</b>" if "CGPA" in edu.get('score') else edu.get('score'), sub_regular_style))
            story.append(Spacer(1, 4))

    # 6. PROJECTS
    if data.get("projects"):
        add_section_header("PROJECTS")
        for proj in data["projects"]:
            row1 = [
                Paragraph(f"<b>{proj.get('title', '')}</b>", left_bold_style),
                Paragraph(f"{proj.get('type', '')}", right_italic_style)
            ]
            t = Table([row1], colWidths=[usable_width * 0.72, usable_width * 0.28])
            t.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(t)
            
            if proj.get("tech"):
                story.append(Paragraph(f"<i>Tech Stack: {proj.get('tech')}</i>", sub_italic_style))
                story.append(Spacer(1, 2))
                
            for b in proj.get("bullets", []):
                story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", bullet_style))
            story.append(Spacer(1, 4))

    # 7. INTERNSHIP
    if data.get("internships"):
        add_section_header("INTERNSHIP")
        for intern in data["internships"]:
            row1 = [
                Paragraph(f"<b>{intern.get('company', '')}</b>", left_bold_style),
                Paragraph(f"{intern.get('duration', '')}", right_italic_style)
            ]
            t = Table([row1], colWidths=[usable_width * 0.72, usable_width * 0.28])
            t.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(t)
            
            if intern.get("role"):
                story.append(Paragraph(f"<i>{intern.get('role')}</i>", sub_italic_style))
                story.append(Spacer(1, 2))
                
            for b in intern.get("bullets", []):
                story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", bullet_style))
            story.append(Spacer(1, 4))

    # 8. TECHNICAL SKILLS
    if data.get("skills"):
        add_section_header("TECHNICAL SKILLS")
        for sk in data["skills"]:
            story.append(Paragraph(f"&bull;&nbsp;&nbsp;{sk}", bullet_style))
        story.append(Spacer(1, 4))

    # 9. CERTIFICATIONS
    if data.get("certifications"):
        add_section_header("CERTIFICATIONS")
        for cert in data["certifications"]:
            story.append(Paragraph(f"&bull;&nbsp;&nbsp;{cert}", bullet_style))
        story.append(Spacer(1, 4))

    # 10. SOFT SKILLS
    if data.get("soft_skills"):
        add_section_header("SOFT SKILLS")
        for ss in data["soft_skills"]:
            story.append(Paragraph(f"&bull;&nbsp;&nbsp;{ss}", bullet_style))
        story.append(Spacer(1, 4))

    # 11. LANGUAGES KNOWN
    if data.get("languages"):
        add_section_header("LANGUAGES KNOWN")
        story.append(Paragraph(data["languages"], body_style))

    doc.build(story)
    
    if output_path is None:
        buffer.seek(0)
        return buffer.getvalue()
    return output_path

if __name__ == "__main__":
    import sys
    import json
    
    output_target = "c:/Users/ganga/Downloads/SGIP/Gangatharan_M_Resume_Standard.pdf"
    custom_data = None

    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        try:
            with open(sys.argv[1], "r", encoding="utf-8") as f:
                custom_data = json.load(f)
        except Exception as e:
            print("Error loading JSON:", e)

    if len(sys.argv) > 2:
        output_target = sys.argv[2]

    create_resume_pdf(data=custom_data, output_path=output_target)
    print("Standard Resume PDF generated successfully!")
