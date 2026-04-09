const counterElement = document.getElementById("counter");
const sourceLineElement = document.getElementById("sourceLine");

let counterValue = 0;
const startedAtMs = Date.now();

const formatElapsedAsMinuteSecond = (elapsedMs) => {
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  const minuteString = String(minutes).padStart(2, "0");
  const secondString = String(seconds).padStart(2, "0");
  return `${minuteString}:${secondString}`;
};

const renderSourceLine = () => {
  const elapsed = Date.now() - startedAtMs;
  const minuteSecondString = formatElapsedAsMinuteSecond(elapsed);

  sourceLineElement.textContent =
    `Počet krádeží identity za posledních ${minuteSecondString} minut na základě Security.org`;
};

const incrementCounter = () => {
  counterValue += 1;
  counterElement.textContent = String(counterValue);
};

setInterval(() => {
  incrementCounter();
}, 5000);

setInterval(() => {
  renderSourceLine();
}, 1000);

renderSourceLine();
