const themeSelect = document.getElementById('themeSelect');
const rateInput = document.getElementById('rateInput');
const pitchInput = document.getElementById('pitchInput');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');

async function loadOptions() {
  const options = await chrome.storage.local.get(['theme', 'rate', 'pitch', 'fontSize', 'fontFamily']);
  themeSelect.value = options.theme || 'light';
  rateInput.value = options.rate || 1;
  pitchInput.value = options.pitch || 1;
  fontSizeInput.value = options.fontSize || 16;
  fontFamilySelect.value = options.fontFamily || 'Noto Serif, serif';
  applyTheme(themeSelect.value);
}

async function saveOptions() {
  const theme = themeSelect.value;
  const rate = parseFloat(rateInput.value);
  const pitch = parseFloat(pitchInput.value);
  const fontSize = parseInt(fontSizeInput.value);
  const fontFamily = fontFamilySelect.value;
  await chrome.storage.local.set({ theme, rate, pitch, fontSize, fontFamily });
  alert('Options saved!');
}

async function resetOptions() {
  themeSelect.value = 'light';
  rateInput.value = 1;
  pitchInput.value = 1;
  fontSizeInput.value = 16;
  fontFamilySelect.value = 'Noto Serif, serif';
  await chrome.storage.local.set({ theme: 'light', rate: 1, pitch: 1, fontSize: 16, fontFamily: 'Noto Serif, serif' });
  alert('Options reset to defaults!');
  applyTheme('light');
}

function applyTheme(theme) {
  document.body.className = theme + '-theme';
}

loadOptions();
saveButton.addEventListener('click', saveOptions);
resetButton.addEventListener('click', resetOptions);

themeSelect.addEventListener('change', () => {
  applyTheme(themeSelect.value);
});