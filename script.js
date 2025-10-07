const cardContainer = document.querySelector(".container");
const newGame = document.querySelector("#newGameBtn");
const timeOverUI = document.querySelector("#timeOverUI");
const movesElement = document.querySelector("#moves");
const timerElement = document.querySelector("#timer");
const flipSound = new Audio("flipSound.mp3");
const winSound = new Audio("winSound.mp3");
const failSound = new Audio("failSound.mp3");
const newGameSound = new Audio("newGameSound.mp3");
const timeOverSound = new Audio("gameOverSound.mp3");
let isWinner = false;
let card = null;
let moves = 0;
let count = 0;
let firstFlippedCard = null;
let secFlippedCard = null;
let shuffledImages = [
  "ballon.png",
  "cat.png",
  "car.png",
  "dog.png",
  "flower.png",
  "rabbit.png",
];
// console.log(shuffledImages);

function showCards() {
  for (let i = 0; i < 12; i++) {
    // console.log("inner", shuffledImages);
    // outer card div
    const card = document.createElement("div");
    card.classList.add("card");

    // card-inner
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    // card-front
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const img = document.createElement("img");

    img.src = shuffledImages[Math.floor(Math.random() * shuffledImages.length)];

    cardFront.appendChild(img);

    // card-back
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    const backLogo = document.createElement("img");
    backLogo.classList.add("backLogo");
    backLogo.src = "logo.png";
    cardBack.appendChild(backLogo);

    // assemble structure
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // finally append to board
    cardContainer.appendChild(card);
  }
}
showCards();

cardContainer.addEventListener("click", flipCard);
function flipCard(e) {
  // console.log(e.target.className);

  let image =
    e.target.className == "card-back"
      ? e.target.parentElement.children[0].children[0]
      : e.target.parentElement.parentElement.children[0].children[0];

  flipSound.volume = 1.0;
  flipSound.playbackRate = 1.1;

  card =
    e.target.className == "card-back"
      ? e.target.parentElement.parentElement
      : e.target.parentElement.parentElement.parentElement;
  // console.log(card);
  if (card.classList.contains("flipped")) {
    console.log("idhar aaya?");
    return; // No sound, no extra flip
  }
  console.log("chlna");
  card.classList.add("flipped");
  flipSound.play();

  if (moves % 2 == 0) {
    firstFlippedCard = image.src;
    moves++;
    movesElement.innerText = `Moves :  ${moves}`;
    return;
  }
  if (moves % 2 != 0) {
    secFlippedCard = image.src;
    moves++;
    movesElement.innerText = `Moves :  ${moves}`;
  }
  if (moves % 2 == 0) {
    cardContainer.removeEventListener("click", flipCard);
  }
  wonTheGame(firstFlippedCard, secFlippedCard);
}
const winScreen = document.querySelector(".winScreen");
const restartBtn = document.querySelector("#restartBtn");
function wonTheGame(card1Dtl, card2Dtl) {
  if (card1Dtl == card2Dtl) {
    console.log("aaya");
    setTimeout(() => {
      firstFlippedCard = null;
      secFlippedCard = null;
      isWinner = true;
      launchConfetti();
      winScreen.classList.remove("hidden");
      cardContainer.classList.add("displayNone");
      winSound.play();
    }, 1500);
  } else {
    failSound.play();
    setTimeout(() => {
      cardContainer.innerHTML = "";
      cardContainer.addEventListener("click", flipCard);
      card.classList.remove("flipped");
      showCards();
    }, 1700);
  }
}
restartBtn.addEventListener("click", () => {
  newGameSound.play();
  winScreen.classList.add("hidden");
  cardContainer.classList.remove("displayNone");
  cardContainer.innerHTML = "";
  cardContainer.addEventListener("click", flipCard);
  moves = 0;
  movesElement.innerText = `Moves :  ${moves}`;
  card.classList.remove("flipped");
  count = 0;
  timerElement.innerText = `Timer : 00:00`;
  intervalfunc();
  showCards();
});
function launchConfetti() {
  const x = window.innerWidth / 2; // screen center X
  const y = window.innerHeight / 2; // screen center Y

  for (let i = 0; i < 80; i++) {
    // 🔥 particles count increased
    const confetti = document.createElement("div");

    // style
    confetti.style.position = "absolute";
    confetti.style.width = Math.random() * 8 + 6 + "px"; // random size (6–14px)
    confetti.style.height = Math.random() * 4 + 4 + "px"; // strip shape
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = x + "px";
    confetti.style.top = y + "px";
    confetti.style.borderRadius = "2px";
    confetti.style.pointerEvents = "none";
    confetti.style.zIndex = "1000";

    document.body.appendChild(confetti);

    // random direction
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 300 + 100; // 🔥 more spread
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // longer animation
    confetti.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${
            Math.random() * 720
          }deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 2000 + Math.random() * 1500, // 🔥 2–3.5 seconds
        easing: "ease-out",
        fill: "forwards",
      }
    );

    setTimeout(() => confetti.remove(), 4000); // keep cleanup safe
  }
}
function intervalfunc() {
  let interval = setInterval(() => {
    count++;
    let minnutes = Math.floor(count / 60);
    let seconds = count % 60;
    let formattedTime =
      String(minnutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");
    timerElement.innerText = `Timer : ${formattedTime}`;
    if (formattedTime == "03:00") {
      timeOverSound.play();
      clearInterval(interval);
      timeOverUI.style.display = "flex";
      cardContainer.classList.add("displayNone");
    } else if (isWinner) {
      clearInterval(interval);
      isWinner = false;
    }
  }, 1000);
}
intervalfunc();
newGame.addEventListener("click", () => {
  newGameSound.play();
  location.reload();
});
