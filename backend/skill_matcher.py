def load_resume_skills(resume_path):
    with open(resume_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Extract skills section
    skills_section = ""
    lines = content.splitlines()
    for i, line in enumerate(lines):
        if line.strip().lower() == "skills":
            # Get the next line after "Skills"
            if i + 1 < len(lines):
                skills_section = lines[i + 1]
            break
    # Fallback: extract all words after "Skills"
    if not skills_section:
        try:
            skills_section = content.split("Skills")[1].split("Certifications")[0]
        except IndexError:
            skills_section = ""
    # Split skills by | and strip whitespace
    skills = [skill.strip().lower() for skill in skills_section.split('|') if skill.strip()]
    return set(skills)

def match_keywords_with_resume(keywords, resume_path):
    resume_skills = load_resume_skills(resume_path)
    matched = [kw for kw in keywords if kw.lower() in resume_skills]
    return matched