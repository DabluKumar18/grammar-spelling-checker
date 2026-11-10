function escapeHTML(text) {
    return text.replace(/[&<>"']/g, function (char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[char];
    });
}

function highlightText(text, errors) {
    if (!errors.length) {
        return escapeHTML(text);
    }

    const sortedErrors = [...errors].sort(
        (a, b) => a.position - b.position
    );

    let output = "";
    let lastPosition = 0;

    sortedErrors.forEach(item => {
        const start = item.position;
        const end = start + item.error_length;

        if (start < lastPosition || start < 0 || end > text.length) {
            return;
        }

        output += escapeHTML(text.substring(lastPosition, start));

        const errorText = escapeHTML(text.substring(start, end));

        const errorClass = item.type === "misspelling"
            ? "spelling-error"
            : item.type === "grammar"
            ? "grammar-error"
            : "other-error";

        output += `<span class="${errorClass}">${errorText}</span>`;

        lastPosition = end;
    });

    output += escapeHTML(text.substring(lastPosition));

    return output;
}

document.getElementById("checkBtn").addEventListener("click", async function () {

    const text = document.getElementById("textInput").value;
    const result = document.getElementById("result");

    if (text.trim() === "") {
    result.innerHTML = "<p>Please enter some text!</p>";

    document.getElementById("highlightPreview").innerHTML = `
        <h3>Highlighted Text</h3>
        <p>Your highlighted text will appear here.</p>
    `;

    return;
}

    result.innerHTML = "<p>Checking your text...</p>";

    const checkBtn = document.getElementById("checkBtn");

    checkBtn.disabled = true;
    checkBtn.textContent = "Checking...";

    try {
        const response = await fetch("/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        const preview = document.getElementById("highlightPreview");

    const errors = Array.isArray(data.result) ? data.result : [];

    preview.innerHTML = `
    <h3>Highlighted Text</h3>
    <p>${highlightText(text, errors)}</p>
    `;

        result.innerHTML = "<h3>Correction Results</h3>";

const summary = document.createElement("div");

summary.className = "error-summary";

summary.innerHTML = `
    <div class="summary-card total-card">
        <h4>Total Errors</h4>
        <div class="count">${data.total_errors}</div>
    </div>

    <div class="summary-card spelling-card">
        <h4>Spelling</h4>
        <div class="count">${data.spelling_count}</div>
    </div>

    <div class="summary-card grammar-card">
        <h4>Grammar</h4>
        <div class="count">${data.grammar_count}</div>
    </div>

    <div class="summary-card other-card">
        <h4>Other</h4>
        <div class="count">${data.other_count}</div>
    </div>
`;

result.appendChild(summary);

        if (typeof data.result === "string") {

            const message = document.createElement("p");
            message.textContent = data.result;
            result.appendChild(message);

        } else {

            data.result.forEach((item, index) => {

                const div = document.createElement("div");

                const error = document.createElement("p");
                error.textContent =
                    `${index + 1}. ${item.type}: ${item.error}`;

                const explanation = document.createElement("p");
                explanation.textContent =
                    `Explanation: ${item.message}`;

                
                const suggestion = document.createElement("p");
                suggestion.textContent = "Suggestions: ";

                item.suggestions.forEach((word) => {

                    const suggestionBtn = document.createElement("button");

                    suggestionBtn.textContent = word;

                    suggestionBtn.addEventListener("click", function () {

                    const start = item.position;
                    const end = start + item.error_length;

                    const currentText = textInput.value;

                    textInput.value =
                        currentText.substring(0, start) +
                        word +
                        currentText.substring(end);

                    textInput.dispatchEvent(new Event("input"));

                    result.innerHTML =
                        "<p>Suggestion applied! Click Check Grammar again.</p>";
                });

                suggestion.appendChild(suggestionBtn);
});

                div.appendChild(error);
                div.appendChild(explanation);
                div.appendChild(suggestion);

                result.appendChild(div);
            });
        }

        if (data.corrected_text !== undefined) {
            const corrected = document.createElement("p");
            corrected.textContent =
                "Corrected Text: " + data.corrected_text;

            result.appendChild(corrected);
            const copyBtn = document.createElement("button");

            copyBtn.textContent = "Copy Corrected Text";

            copyBtn.addEventListener("click", async function () {
            await navigator.clipboard.writeText(data.corrected_text);
            copyBtn.textContent = "Copied!";
        });

          result.appendChild(copyBtn);
        }

    } catch (error) {
        result.innerHTML =
            "<p>Something went wrong. Please try again.</p>";

        console.error(error);
    } 
    finally {
    checkBtn.disabled = false;
    checkBtn.textContent = "Check Grammar";
}
});

document.getElementById("clearBtn").addEventListener("click", function () {

    const textInput = document.getElementById("textInput");
    const result = document.getElementById("result");

    // Clear input
    textInput.value = "";

    // Clear results
    result.innerHTML = `
        <h3>Correction Results</h3>
        <p>Your results will appear here.</p>
    `;

    document.getElementById("highlightPreview").innerHTML = `
    <h3>Highlighted Text</h3>
    <p>Your highlighted text will appear here.</p>
`;

    // Reset counters
    document.getElementById("wordCount").textContent = 0;
    document.getElementById("charCount").textContent = 0;
    document.getElementById("sentenceCount").textContent = 0;

});


const textInput = document.getElementById("textInput");

textInput.addEventListener("input", function () {

    const text = textInput.value.trim();

    // Word count
    const words = text === "" ? [] : text.split(/\s+/);

    // Character count
    const characters = textInput.value.length;

    // Sentence count
    const sentences = text === ""
        ? []
        : text.split(/[.!?]+/).filter(s => s.trim() !== "");

    document.getElementById("wordCount").textContent = words.length;

    document.getElementById("charCount").textContent = characters;

    document.getElementById("sentenceCount").textContent = sentences.length;

});
