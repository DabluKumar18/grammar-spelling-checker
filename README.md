# Grammar & Spelling Checker

A web-based Grammar and Spelling Checker built using Python Flask and Natural Language Processing (NLP). It detects grammar and spelling mistakes in English text and provides correction suggestions.

## Features

- Detects grammar and spelling mistakes
- Provides correction suggestions
- Allows users to apply suggested corrections
- Generates corrected text
- Displays error summary (Total, Grammar, Spelling, Other)
- Highlights mistakes by category
- Copy corrected text
- Clear text functionality
- Word, character, and sentence counters
- Responsive user interface

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **NLP Tool:** LanguageTool
- **Version Control:** Git and GitHub

## Project Structure

```text
Grammar-Spelling-Checker/
│
├── app.py
├── requirements.txt
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/DabluKumar18/grammar-spelling-checker.git
```

### 2. Open the project folder

```bash
cd grammar-spelling-checker
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

**Windows:**

```bash
venv\Scripts\activate
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Run the application

```bash
python app.py
```

### 7. Open in browser

```text
http://127.0.0.1:5000
```

## How It Works

1. Enter English text in the input box.
2. Click the Check Grammar button.
3. The application analyzes the text using LanguageTool.
4. Detected mistakes and correction suggestions are displayed.
5. Apply suggestions to generate corrected text.

## Author

**Dablu Kumar**

MCA Student | AI & Data Science

## License

This project is created for academic purposes.
