const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const wordDiv = document.getElementById('word');
const phoneticsDiv = document.getElementById('phonetics');
const listenButton = document.getElementById('listenButton');
const definitionsDiv = document.getElementById('definitions');
const etymologyDiv = document.getElementById('etymology');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const partOfSpeechFilters = document.querySelectorAll('#partOfSpeechFilter input');

let speechRate = 1;
let speechPitch = 1;
let currentData = null; // Store the current data

async function fetchDefinitions(word) {
  loadingDiv.style.display = 'block';
  errorDiv.style.display = 'none';

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    if (data && data[0] && data[0].meanings) {
      const formatted = formatDictionaryApi(data);
      cacheDefinition(word, formatted);
      displayDefinitions(formatted);
      currentData = formatted; // Store the data
    } else {
      definitionsDiv.textContent = "Definition not found.";
      wordDiv.textContent = "";
      phoneticsDiv.innerHTML = "";
      etymologyDiv.innerHTML = "";
      listenButton.style.display = 'none';
      currentData = null;
    }
  } catch (error) {
    console.error('Error fetching definition:', error);
    definitionsDiv.textContent = "Error fetching definition.";
    wordDiv.textContent = "";
    phoneticsDiv.innerHTML = "";
    etymologyDiv.innerHTML = "";
    listenButton.style.display = 'none';
    errorDiv.style.display = 'block';
    currentData = null;
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function formatDictionaryApi(data) {
  const wordData = data[0];
  const formatted = {
    word: wordData.word,
    phonetics: wordData.phonetics,
    meanings: wordData.meanings.map(meaning => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.map(def => ({
        definition: def.definition,
        example: def.example,
        synonyms: def.synonyms,
        antonyms: def.antonyms
      }))
    })),
    etymology: wordData.origin
  };
  return formatted;
}

function displayDefinitions(data) {
  wordDiv.textContent = data.word;
  phoneticsDiv.innerHTML = data.phonetics && data.phonetics.length > 0 ? `<strong>Pronunciation:</strong> ${data.phonetics.map(p => p.text).join(', ')}` : '';
  definitionsDiv.innerHTML = '';
  data.meanings.forEach(meaning => {
    const partOfSpeechDiv = document.createElement('div');
    partOfSpeechDiv.innerHTML = `<strong>Part of Speech:</strong> ${meaning.partOfSpeech}`;
    definitionsDiv.appendChild(partOfSpeechDiv);
    meaning.definitions.forEach(def => {
      const definitionDiv = document.createElement('div');
      definitionDiv.className = 'definition';
      definitionDiv.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
      if (def.example) definitionDiv.innerHTML += `<br><strong>Example:</strong> ${def.example}`;
      if (def.synonyms && def.synonyms.length > 0) definitionDiv.innerHTML += `<br><strong>Synonyms:</strong> ${def.synonyms.join(', ')}`;
      if (def.antonyms && def.antonyms.length > 0) definitionDiv.innerHTML += `<br><strong>Antonyms:</strong> ${def.antonyms.join(', ')}`;
      definitionsDiv.appendChild(definitionDiv);
    });
  });
  etymologyDiv.innerHTML = data.etymology && data.etymology.length > 0 ? `<strong>Etymology:</strong> ${data.etymology.join(", ")}` : '';
  listenButton.style.display = 'block';
  applyFilters(data);
}

function applyFilters(data) {
  const selectedPartsOfSpeech = Array.from(partOfSpeechFilters)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  if (selectedPartsOfSpeech.length > 0) {
    const filteredMeanings = data.meanings.filter(meaning =>
      selectedPartsOfSpeech.includes(meaning.partOfSpeech)
    );
    data.meanings = filteredMeanings;
  }

  displayDefinitionsContent(data); // Re-display content after filters
}

function displayDefinitionsContent(data) {
  definitionsDiv.innerHTML = '';
  data.meanings.forEach(meaning => {
    const partOfSpeechDiv = document.createElement('div');
    partOfSpeechDiv.innerHTML = `<strong>Part of Speech:</strong> ${meaning.partOfSpeech}`;
    definitionsDiv.appendChild(partOfSpeechDiv);
    meaning.definitions.forEach(def => {
      const definitionDiv = document.createElement('div');
      definitionDiv.className = 'definition';
      definitionDiv.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
      if (def.example) definitionDiv.innerHTML += `<br><strong>Example:</strong> ${def.example}`;
      if (def.synonyms && def.synonyms.length > 0) definitionDiv.innerHTML += `<br><strong>Synonyms:</strong> ${def.synonyms.join(', ')}`;
      if (def.antonyms && def.antonyms.length > 0) definitionDiv.innerHTML += `<br><strong>Antonyms:</strong> ${def.antonyms.join(', ')}`;
      definitionsDiv.appendChild(definitionDiv);
    });
  });
}

listenButton.addEventListener('click', () => {
  const wordToSpeak = wordDiv.textContent;
  const utterance = new SpeechSynthesisUtterance(wordToSpeak);
  utterance.rate = speechRate;
  utterance.pitch = speechPitch;
  window.speechSynthesis.speak(utterance);
});

searchButton.addEventListener('click', () => {
  const word = searchInput.value;
  if (word) {
    fetchDefinitions(word);
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchButton.click();
  }
});

async function applyTheme() {
  const options = await chrome.storage.local.get('theme');
  const theme = options.theme || 'light';
  document.body.className = theme + '-theme';
}

async function applySpeechSettings() {
  const options = await chrome.storage.local.get(['rate', 'pitch']);
  speechRate = options.rate || 1;
  speechPitch = options.pitch || 1;
}

async function applyTextSettings() {
  const options = await chrome.storage.local.get(['fontSize', 'fontFamily']);
  const fontSize = options.fontSize || 16;
  const fontFamily = options.fontFamily || 'Noto Serif, serif';
  document.body.style.fontSize = fontSize + 'px';
  document.body.style.fontFamily = fontFamily;
}

applyTheme();
applySpeechSettings();
applyTextSettings();

partOfSpeechFilters.forEach(filter => {
  filter.addEventListener('change', () => {
    const word = wordDiv.textContent;
    if (word) {
      applyFilters(currentData);
    }
  });
});

document.querySelectorAll('.filter-header').forEach(header => {
  header.addEventListener('click', () => {
    const targetId = header.getAttribute('data-target');
    const target = document.getElementById(targetId);
    target.style.display = target.style.display === 'block' ? 'none' : 'block';
  });
});