import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def read_resume(resume_path):
    with open(resume_path, "r", encoding="utf-8") as f:
        return f.read()

def draft_email_with_correction(job_desc, matched_skills, resume_path):
    resume_text = read_resume(resume_path)
    llm = ChatOpenAI(api_key=OPENAI_API_KEY, model="gpt-5")

    # Step 1: Draft the email
    draft_prompt = ChatPromptTemplate.from_template(
        "Write a professional job application email in 100 words.\n"
        "Subject: Application for the job\n"
        "Job Description: {job_desc}\n"
        "My relevant skills: {skills}\n"
        "Include a clear subject and a concise body explaining why I am a good fit.\n"
        "At the end add my name: Mahadevan Biju Menon and my Github: github.com/mahadevan10 | linkedin: linkedin.com/in/mahadevanmn10 | phone number: +91 8848570115 | Portfolio: https://mahadevan10.github.io/portfolio/"
    )
    draft_chain = LLMChain(llm=llm, prompt=draft_prompt)
    draft_email = draft_chain.run({"job_desc": job_desc, "skills": ", ".join(matched_skills)})

    # Step 2: Correct the draft using resume
    correction_prompt = ChatPromptTemplate.from_template(
        "Here is my resume:\n{resume}\n\nHere is an email draft:\n{draft}\n\n"
        "Check the draft for any information that does not match my resume. "
        "Correct any mistakes so that the email only contains accurate information from my resume."
    )
    correction_chain = LLMChain(llm=llm, prompt=correction_prompt)
    corrected_email = correction_chain.run({"resume": resume_text, "draft": draft_email})

    return corrected_email