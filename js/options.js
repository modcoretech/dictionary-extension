const themeSelect = document.getElementById('themeSelect');
const rateInput = document.getElementById('rateInput');
const pitchInput = document.getElementById('pitchInput');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');
const dictionaryPreview = document.getElementById('dictionaryPreview');

// --- Defaults ---
const DEFAULT_OPTIONS = {
  theme: 'light',
  rate: 1.0,
  pitch: 1.0,
  fontSize: 16,
  fontFamily: 'Noto Serif, serif'
};

/**
 * Applies the selected theme to the body and updates the preview.
 * @param {string} theme - The theme name ('light', 'dark', 'sepia').
 */
function applyTheme(theme) {
  document.body.className = theme + '-theme';
}

/**
 * Updates the live preview panel based on current text appearance settings.
 */
function updatePreview() {
  const fontSize = parseInt(fontSizeInput.value) || DEFAULT_OPTIONS.fontSize;
  const fontFamily = fontFamilySelect.value || DEFAULT_OPTIONS.fontFamily;
  const theme = themeSelect.value || DEFAULT_OPTIONS.theme;
  
  // Apply visual settings to the preview element
  dictionaryPreview.style.fontSize = `${fontSize}px`;
  dictionaryPreview.style.fontFamily = fontFamily;
  
  // Apply theme to the whole page, which affects the preview via CSS variables
  applyTheme(theme); 
}

/**
 * Validates a number input against its min/max attributes.
 * @param {HTMLInputElement} inputElement - The input to validate.
 * @returns {number|null} The parsed and clamped value, or null if invalid.
 */
function validateNumberInput(inputElement) {
  const value = parseFloat(inputElement.value);
  const min = parseFloat(inputElement.min);
  const max = parseFloat(inputElement.max);

  if (isNaN(value)) {
    return null;
  }
  
  // Clamp the value to the defined range
  return Math.min(Math.max(value, min), max);
}


async function loadOptions() {
  // Use DEFAULT_OPTIONS as a fallback if nothing is stored
  const options = await chrome.storage.local.get(DEFAULT_OPTIONS);
  
  themeSelect.value = options.theme;
  rateInput.value = options.rate;
  pitchInput.value = options.pitch;
  fontSizeInput.value = options.fontSize;
  fontFamilySelect.value = options.fontFamily;
  
  updatePreview(); // Initialize UI and Preview
}

async function saveOptions() {
  const theme = themeSelect.value;
  
  // Robust validation and clamping for number inputs
  const rate = validateNumberInput(rateInput) || DEFAULT_OPTIONS.rate;
  const pitch = validateNumberInput(pitchInput) || DEFAULT_OPTIONS.pitch;
  const fontSize = Math.round(validateNumberInput(fontSizeInput)) || DEFAULT_OPTIONS.fontSize; // Font size must be an integer
  
  const fontFamily = fontFamilySelect.value;

  // Update inputs with validated, potentially clamped values for visual feedback
  rateInput.value = rate.toFixed(1); 
  pitchInput.value = pitch.toFixed(1);
  fontSizeInput.value = fontSize;
  
  // Save to storage
  await chrome.storage.local.set({ theme, rate, pitch, fontSize, fontFamily });
  
  // Final UI update
  updatePreview();
  
  alert('Options saved successfully! Your changes have been applied.');
}

async function resetOptions() {
  // Apply defaults to the UI
  themeSelect.value = DEFAULT_OPTIONS.theme;
  rateInput.value = DEFAULT_OPTIONS.rate;
  pitchInput.value = DEFAULT_OPTIONS.pitch;
  fontSizeInput.value = DEFAULT_OPTIONS.fontSize;
  fontFamilySelect.value = DEFAULT_OPTIONS.fontFamily;
  
  // Save defaults to storage
  await chrome.storage.local.set(DEFAULT_OPTIONS);
  
  // Final UI and Preview update
  updatePreview();
  
  alert('Options reset to defaults!');
}

// --- Event Listeners ---
loadOptions();
saveButton.addEventListener('click', saveOptions);
resetButton.addEventListener('click', resetOptions);

// Live update for preview as settings change
themeSelect.addEventListener('change', updatePreview);
fontSizeInput.addEventListener('input', updatePreview);
fontFamilySelect.addEventListener('change', updatePreview);
