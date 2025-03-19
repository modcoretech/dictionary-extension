const readAloudButtons = document.querySelectorAll('.read-aloud');
const tryItButtons = document.querySelectorAll('.try-it');
let speechRate = 1;
let speechPitch = 1;

async function applySpeechSettings() {
  const options = await chrome.storage.local.get(['rate', 'pitch']);
  speechRate = options.rate || 1;
  speechPitch = options.pitch || 1;
}

applySpeechSettings();

readAloudButtons.forEach(button => {
  button.addEventListener('click', () => {
    const sectionNumber = button.getAttribute('data-section');
    const section = document.querySelectorAll('section')[sectionNumber - 1];
    const text = section.textContent.replace('Read Aloud', '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    window.speechSynthesis.speak(utterance);
  });
});

tryItButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');
    if (action === 'search') {
      window.open('search.html', '_blank');
    } else if (action === 'options') {
      window.open('options.html', '_blank');
    } else if (action === 'cache') {
      window.open('options.html', '_blank');
    } else if (action === 'filter') {
      window.open('search.html', '_blank');
    } else if (action === 'listen') {
      window.open('search.html', '_blank');
    } else if (action === 'context') {
      alert("Select a word on a webpage, right-click, and choose 'Look Up Word'.");
    } else if (action === 'popup'){
      alert("Select a word on a webpage, right-click, and choose 'Look Up Word'.");
    }

  });
});

const searchInput = document.getElementById('tutorialSearchInput');
const sections = document.querySelectorAll('section');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  sections.forEach(section => {
    const keywords = section.getAttribute('data-keywords').toLowerCase();
    if (keywords.includes(searchTerm)) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
});