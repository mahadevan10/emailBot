import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download NLTK data files (run once)
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')

def extract_keywords(text):
    # Tokenize and remove stopwords
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text)
    keywords = [word for word in words if word.isalpha() and word.lower() not in stop_words]
    return keywords