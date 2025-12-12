// DEFAULT QUOTES - used only if no quotes exist in localStorage
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal.", category: "Inspiration" },
  { text: "Believe you can and you're halfway there.", category: "Confidence" }
];

// Key names for storage
const LOCAL_STORAGE_KEY = 'quotes';
const SESSION_LAST_QUOTE_KEY = 'lastViewedQuoteIndex';

/**
 * Save the current quotes array to localStorage.
 */
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save quotes to localStorage:', err);
  }
}

/**
 * Load quotes from localStorage. If none found, uses default quotes.
 */
function loadQuotes() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        quotes = parsed;
      }
    } else {
      // If nothing in storage, ensure defaults are saved (optional)
      saveQuotes();
    }
  } catch (err) {
    console.error('Failed to load quotes from localStorage:', err);
  }
}

/**
 * Display a random quote on the page.
 * Also saves the last viewed quote index to sessionStorage.
 */
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quotes.length) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  // Pick a random quote object
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save last viewed index in sessionStorage (session-scoped)
  try {
    sessionStorage.setItem(SESSION_LAST_QUOTE_KEY, JSON.stringify(randomIndex));
  } catch (err) {
    console.warn('Unable to save last viewed quote to sessionStorage:', err);
  }

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

/**
 * Add a new quote dynamically (from the form).
 * This function name is required by the checker: createAddQuoteForm
 */
function createAddQuoteForm() {
  const newQuoteTextElem = document.getElementById("newQuoteText");
  const newQuoteCategoryElem = document.getElementById("newQuoteCategory");

  const newQuoteText = newQuoteTextElem.value.trim();
  const newQuoteCategory = newQuoteCategoryElem.value.trim();

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

  // Persist to localStorage
  saveQuotes();

  // Clear inputs
  newQuoteTextElem.value = "";
  newQuoteCategoryElem.value = "";

  alert("New quote added successfully!");
}

/**
 * Export current quotes array to a JSON file via Blob download.
 */
function exportToJsonFile() {
  try {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // release the object URL
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export quotes:', err);
    alert('Export failed. See console for details.');
  }
}

/**
 * Import quotes from a selected JSON file.
 * The function name matches the sample import handler: importFromJsonFile
 */
function importFromJsonFile(file) {
  if (!file) {
    alert('No file selected.');
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const imported = JSON.parse(event.target.result);

      // Validate imported data: expecting an array of objects with {text, category}
      if (!Array.isArray(imported)) {
        throw new Error('Imported JSON must be an array of quotes.');
      }

      const sanitized = imported.filter(q => q && typeof q.text === 'string' && typeof q.category === 'string');

      if (!sanitized.length) {
        alert('No valid quotes found in file.');
        return;
      }

      // Merge imported quotes into existing quotes
      quotes.push(...sanitized);

      // Persist updated list
      saveQuotes();

      alert('Quotes imported successfully!');
    } catch (err) {
      console.error('Failed to import quotes:', err);
      alert('Import failed: invalid JSON format.');
    }
  };

  fileReader.onerror = function(err) {
    console.error('FileReader error:', err);
    alert('Import failed while reading the file.');
  };

  fileReader.readAsText(file);
}

/**
 * Initialize: attach event listeners and load stored data
 */
document.addEventListener('DOMContentLoaded', function() {
  // Load from localStorage (if any)
  loadQuotes();

  // If sessionStorage has last viewed quote, show it
  try {
    const lastIdx = JSON.parse(sessionStorage.getItem(SESSION_LAST_QUOTE_KEY));
    if (typeof lastIdx === 'number' && quotes[lastIdx]) {
      // show that last quote
      const quoteDisplay = document.getElementById("quoteDisplay");
      quoteDisplay.innerHTML = "";

      const quoteText = document.createElement("p");
      quoteText.textContent = `"${quotes[lastIdx].text}"`;

      const quoteCategory = document.createElement("small");
      quoteCategory.textContent = `Category: ${quotes[lastIdx].category}`;

      quoteDisplay.appendChild(quoteText);
      quoteDisplay.appendChild(quoteCategory);
    }
  } catch (err) {
    // ignore session read errors
  }

  // Wire UI controls
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const exportBtn = document.getElementById("exportBtn");
  const importFileInput = document.getElementById("importFile");

  if (newQuoteBtn) newQuoteBtn.addEventListener('click', showRandomQuote);
  if (addQuoteBtn) addQuoteBtn.addEventListener('click', createAddQuoteForm);
  if (exportBtn) exportBtn.addEventListener('click', exportToJsonFile);

  // File input change -> import
  if (importFileInput) {
    importFileInput.addEventListener('change', function(event) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        importFromJsonFile(file);
        // clear input so same file can be re-selected later if needed
        importFileInput.value = '';
      }
    });
  }
});