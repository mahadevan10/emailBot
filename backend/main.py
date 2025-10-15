from flask import Flask, request, jsonify
from flask_cors import CORS
from keyword_extracter import extract_keywords
from skill_matcher import match_keywords_with_resume
from email_drafter import draft_email_with_correction

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    email = data.get('email')
    job_desc = data.get('jobDesc')
    keywords = extract_keywords(job_desc)
    matched_skills = match_keywords_with_resume(keywords, 'resume.txt')
    email_body = draft_email_with_correction(job_desc, matched_skills, 'resume.txt')
    return jsonify({
        'message': 'Email drafted successfully',
        'email': email,
        'jobDesc': job_desc,
        'keywords': keywords,
        'matched_skills': matched_skills,
        'email_body': email_body
    })

if __name__ == '__main__':
    app.run(port=5000)