// Quote data array
let quotes = [
        { text: "The only way to do great work is to love what you do.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal.", category: "Inspiration" },
        { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

// Function: Display a random quote
function showRandomQuote() {
        const quoteDisplay = document.getElementById("quoteDisplay");

        // Pick a random quote object
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        // Clear previous content
        quoteDisplay.innerHTML = "";

        // Create new DOM elements
        const quoteText = document.createElement("p");
        quoteText.textContent = `"${randomQuote.text}"`;

        const quoteCategory = document.createElement("small");
        quoteCategory.textContent = `Category: ${randomQuote.category}`;

        // Append to display
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
}

// Function: Add a new quote dynamically
function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        // Validate input
        if (newQuoteText === "" || newQuoteCategory === "") {
                alert("Please enter both a quote and a category.");
                return;
        }

        // Add new quote object to array
        const newQuote = {
                text: newQuoteText,
                category: newQuoteCategory
        };
        quotes.push(newQuote);

        // Clear inputs
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        alert("New quote added successfully!");
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);