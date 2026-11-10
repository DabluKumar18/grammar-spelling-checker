
from flask import Flask, render_template, request, jsonify
import language_tool_python

app = Flask(__name__)

tool = language_tool_python.LanguageTool('en-US')
tool.disabled_rules = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/check", methods=["POST"])
def check_grammar():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"result": "Please enter some text!"})

    matches = tool.check(text)

    grammar_count = 0
    spelling_count = 0
    other_count = 0

    for match in matches:
        issue_type = match.rule_issue_type

        if issue_type == "grammar":
            grammar_count += 1
        elif issue_type == "misspelling":
            spelling_count += 1
        else:
            other_count += 1

    corrected_text = language_tool_python.utils.correct(text, matches)

    if not matches:
        return jsonify({
            "result": "No grammar or spelling mistakes found!",
            "corrected_text": corrected_text,
            "total_errors": 0,
            "grammar_count": 0,
            "spelling_count": 0,
            "other_count": 0
        })

    corrections = []

    for match in matches:
        error_word = text[
            match.offset:match.offset + match.error_length
        ]

        corrections.append({
            "error": error_word,
            "message": match.message,
            "type": match.rule_issue_type,
            "suggestions": match.replacements[:3],
            "position": match.offset,
            "error_length": match.error_length
        })

    return jsonify({
        "result": corrections,
        "corrected_text": corrected_text,
        "total_errors": len(matches),
        "grammar_count": grammar_count,
        "spelling_count": spelling_count,
        "other_count": other_count
    })

if __name__ == "__main__":
    app.run(debug=True)
