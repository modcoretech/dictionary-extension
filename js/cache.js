const CACHE_KEY = 'dictionaryCache';

async function getCachedDefinition(word) {
  const cache = await chrome.storage.local.get(CACHE_KEY);
  if (cache[CACHE_KEY] && cache[CACHE_KEY][word]) {
    return cache[CACHE_KEY][word];
  }
  return null;
}

async function cacheDefinition(word, definition) {
  const cache = await chrome.storage.local.get(CACHE_KEY);
  const newCache = cache[CACHE_KEY] || {};
  newCache[word] = definition;
  await chrome.storage.local.set({ [CACHE_KEY]: newCache });
}

async function clearCache() {
  await chrome.storage.local.remove(CACHE_KEY);
}