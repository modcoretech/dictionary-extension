const params = new URLSearchParams(window.location.search);
const word = params.get('word');

document.getElementById('word').textContent = word;

async function fetchDefinitions(word) {
  const cachedDefinition = await getCachedDefinition(word);
  if (cachedDefinition) {
    displayDefinitions(cachedDefinition);
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    if (data && data[0] && data[0].meanings) {
      const formatted = formatDictionaryApi(data);
      cacheDefinition(word, formatted);
      displayDefinitions(formatted);
    } else {
      document.getElementById('definitions').textContent = "Definition not found.";
    }
  } catch (error) {
    console.error('Error fetching definition:', error);
    document.getElementById('definitions').textContent = "Error fetching definition.";
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
  const definitionsDiv = document.getElementById('definitions');
  definitionsDiv.innerHTML = '';

  if (data.phonetics && data.phonetics.length > 0) {
    const phoneticDiv = document.createElement('div');
    phoneticDiv.innerHTML = `<strong>Pronunciation:</strong> ${data.phonetics.map(p => p.text).join(', ')}`;
    definitionsDiv.appendChild(phoneticDiv);
  }

  data.meanings.forEach(meaning => {
    const partOfSpeechDiv = document.createElement('div');
    partOfSpeechDiv.innerHTML = `<strong>Part of Speech:</strong> ${meaning.partOfSpeech}`;
    definitionsDiv.appendChild(partOfSpeechDiv);

    meaning.definitions.forEach(def => {
      const definitionDiv = document.createElement('div');
      definitionDiv.className = 'definition';
      definitionDiv.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
      if (def.example) {
        definitionDiv.innerHTML += `<br><strong>Example:</strong> ${def.example}`;
      }
      if (def.synonyms && def.synonyms.length > 0) {
        definitionDiv.innerHTML += `<br><strong>Synonyms:</strong> ${def.synonyms.join(', ')}`;
      }
      if (def.antonyms && def.antonyms.length > 0) {
        definitionDiv.innerHTML += `<br><strong>Antonyms:</strong> ${def.antonyms.join(', ')}`;
      }
      definitionsDiv.appendChild(definitionDiv);
    });
  });
  if (data.etymology && data.etymology.length > 0) {
      document.getElementById("etymology").innerHTML = `<strong>Etymology:</strong> ${data.etymology.join(", ")}`;
  }
}

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

let speechRate = 1;
let speechPitch = 1;

document.getElementById('listenButton').addEventListener('click', () => {
  const wordToSpeak = document.getElementById('word').textContent;
  const utterance = new SpeechSynthesisUtterance(wordToSpeak);
  utterance.rate = speechRate;
  utterance.pitch = speechPitch;
  window.speechSynthesis.speak(utterance);
});

document.getElementById("clearButton").addEventListener("click", ()=>{
  clearCache();
  alert("Cache Cleared");
});

applyTheme();
applySpeechSettings();
applyTextSettings();
fetchDefinitions(word);