export function getRandomPrompts(prompts, count = 4) {
  const copy = [...prompts];
  const result = [];

  while (result.length < count && copy.length > 0) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }

  return result;
}