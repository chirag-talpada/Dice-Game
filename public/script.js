const rollbtn = document.getElementById("rollbtn");
const holdbtn = document.getElementById("holdbtn");

const playerXzone = document.querySelector(".playerXzone");
const playerYzone = document.querySelector(".playerYzone");

const playerXcurrent = document.querySelector(".playerXzone .pointPart h2");
const playerYcurrent = document.querySelector(".playerYzone .pointPart h2");

const playerXscore = document.querySelector(".playerXzone .upperPart h1");
const playerYscore = document.querySelector(".playerYzone .upperPart h1");

const roomName = document.querySelector(".roomname");

const RollMp3 = new Audio("./sound/rolling.mp3");
const WinMp3 = new Audio("./sound/connected.mp3");
const OverMp3 = new Audio("./sound/gameOver.wav");

const DiceImg = document.querySelector(".dicediv");
let timer;

const dice_playerX_name = document.querySelector(".playerXzone .upperPart h2");
const dice_playerY_name = document.querySelector(".playerYzone .upperPart h2");

const userInfo = { admin: false, flag: 1 };
const userScore = { xScore: 0, xCurrent: 0, yScore: 0, yCurrent: 0 };

const btnOnOff = (bool) => {
  rollbtn.disabled = bool;
  holdbtn.disabled = bool;
};

let room,
  Name = null;
let socket = io();

handlingGame();

function handlingGame() {
  let user = {};

  while (!room) {
    room = prompt("Enter Room name: ", "room" + String(Date.now()).slice(-2));
  }

  while (!Name) {
    Name = prompt("Enter Your name: ", "xyz");
  }

  user.room = room;
  user.name = Name;

  socket.emit("join_room", user);

  socket.on("room_created", (name) => {
    dice_playerX_name.innerText = name;
    userInfo.admin = true;

    dice_playerY_name.innerText = "Waiting...";
    dice_playerY_name.classList.add("addBlink");

    roomName.innerText = `Room name : ${room}`;

    btnOnOff(true);
  });

  socket.on("joined", (user) => {
    dice_playerY_name.classList.remove("addBlink");

    dice_playerX_name.innerText = user.admin;
    dice_playerY_name.innerText = user.member;

    userInfo.xName = user.admin;
    userInfo.yName = user.member;

    playerXzone.style.backgroundColor = "#ffffff61";
    playerYzone.style.backgroundColor = "unset";

    roomName.innerText = `Room name : ${room}`;

    if (userInfo.admin) {
      btnOnOff(false);
      userInfo.flag = 1;
    } else {
      btnOnOff(true);
      userInfo.flag = 2;
    }
  });
}

function onRoll() {
  rollbtn.disabled = true;
  clearTimeout(timer);
  RollMp3.play();
  DiceImg.style.backgroundImage = "url('./img/rolling_dice.gif')";

  let num = getDiceNumber();

  sendDice(num, room);

  timer = setTimeout(function () {
    updateDice(num);
    let x = updateNumbers(num);
    if (!(x === "skip")) rollbtn.disabled = false;
  }, 1000);
}

function getDiceNumber() {
  let num = Math.trunc(Math.random() * 6) + 1;
  return num;
}

function updateDice(num) {
  switch (num) {
    case 1:
      DiceImg.style.backgroundImage = "url('./img/one.png')";
      break;
    case 2:
      DiceImg.style.backgroundImage = "url('./img/two.png')";
      break;
    case 3:
      DiceImg.style.backgroundImage = "url('./img/three.png')";
      break;
    case 4:
      DiceImg.style.backgroundImage = "url('./img/four.png')";
      break;
    case 5:
      DiceImg.style.backgroundImage = "url('./img/five.png')";
      break;
    case 6:
      DiceImg.style.backgroundImage = "url('./img/six.png')";
      break;
    default:
  }
}

function updateNumbers(num) {
  if (num === 1) {
    if (userInfo.flag === 1) {
      userScore.xCurrent = 0;
      playerXcurrent.innerText = userScore.xCurrent;
    } else if (userInfo.flag === 2) {
      userScore.yCurrent = 0;
      playerYcurrent.innerText = userScore.yCurrent;
    }
    switchUser();
    return "skip";
  }

  if (userInfo.flag === 1) {
    userScore.xCurrent += num;
    playerXcurrent.innerText = userScore.xCurrent;
  } else if (userInfo.flag == 2) {
    userScore.yCurrent += num;
    playerYcurrent.innerText = userScore.yCurrent;
  }
}

function sendDice(num, room) {
  socket.emit("senddice", { num, room, flag: userInfo.flag });
}

function rollanotherDice(num, flag) {
  RollMp3.play();
  DiceImg.style.backgroundImage = "url('./img/rolling_dice.gif')";
  timer = setTimeout(function () {
    updateDice(num);
    updateNumbersAnother(num, flag);
  }, 1000);
}

function updateNumbersAnother(num, flag) {
  if (num === 1) {
    if (flag === 1) {
      userScore.xCurrent = 0;
      playerXcurrent.innerText = userScore.xCurrent;
    } else if (flag === 2) {
      userScore.yCurrent = 0;
      playerYcurrent.innerText = userScore.yCurrent;
    }
    return;
  }

  if (flag === 1) {
    userScore.xCurrent += num;
    playerXcurrent.innerText = userScore.xCurrent;
  } else if (flag == 2) {
    userScore.yCurrent += num;
    playerYcurrent.innerText = userScore.yCurrent;
  }
}

function holdScore() {
  updatePanels(1, 2);
  changePlayerTurn(userInfo.flag);
  sendHoldScore(userInfo.flag);

  if (userScore.xScore >= 10) {
    Winning(1);
  }

  if (userScore.yScore >= 10) {
    Winning(2);
  }
}

function updatePanels(a, b) {
  if (userInfo.flag === a) {
    userScore.xScore += Number(playerXcurrent.innerText);
    playerXscore.innerText = userScore.xScore;
    userScore.xCurrent = 0;
    playerXcurrent.innerText = userScore.xCurrent;
  } else if (userInfo.flag === b) {
    userScore.yScore += Number(playerYcurrent.innerText);
    playerYscore.innerText = userScore.yScore;
    userScore.yCurrent = 0;
    playerYcurrent.innerText = userScore.yCurrent;
  }
}

function sendHoldScore(flag) {
  socket.emit("sendhold", { flag, room });
}

function changePlayerTurn(flag) {
  if (flag === 1) {
    playerYzone.style.backgroundColor = "#ffffff61";
    playerXzone.style.backgroundColor = "unset";
  } else {
    playerXzone.style.backgroundColor = "#ffffff61";
    playerYzone.style.backgroundColor = "unset";
  }
  btnOnOff(true);
}

socket.on("senddice", (data) => {
  rollanotherDice(data.num, data.flag);
});

socket.on("sendhold", (data) => {
  changePlayerTurn(data.flag);
  updatePanels(2, 1);
  btnOnOff(false);
});

socket.on("switchUser", (data) => {
  changePlayerTurn(data.flag);
  btnOnOff(false);
});

function switchUser() {
  changePlayerTurn(userInfo.flag);
  socket.emit("switchUser", { flag: userInfo.flag, room });
  btnOnOff(true);
}

function Winning(flag) {
  let label = "🏆🎉🎊 Winner 🎊🎉🏆";
  let WinnerName;

  let WonBy;

  WinMp3.play();

  if (flag === 1) {
    WinnerName = userInfo.xName;
    WonBy = userScore.xScore - userScore.yScore;

    sendlosing(2, room);
  } else {
    WinnerName = userInfo.yName;
    WonBy = userScore.yScore - userScore.xScore;
    sendlosing(1, room);
  }

  let xLabel = userInfo.xName + " : " + userScore.xScore;
  let yLabel = userInfo.yName + " : " + userScore.yScore;

  let winMsg = `You won by ${WonBy} Score`;

  document.querySelector(".model h1").innerText = label;
  document.querySelector(".model h3").innerText = `😍 ${WinnerName} 😍`;
  document.querySelector(".model .xlabel").innerText = xLabel;
  document.querySelector(".model .ylabel").innerText = yLabel;
  document.querySelector(".model .winMsg").innerText = winMsg;

  openModel();
}

function sendlosing(flag, room) {
  socket.emit("lost_game", { flag, room });
}

function losing(flag) {
  let label = "😣😒😭 Game Over 😢🙁🤯";
  let losserName;

  let LostBy;

  OverMp3.play();

  if (flag === 1) {
    losserName = userInfo.xName;
    LostBy = userScore.yScore - userScore.xScore;
  } else {
    losserName = userInfo.yName;
    LostBy = userScore.xScore - userScore.yScore;
  }

  let xLabel = userInfo.xName + " : " + userScore.xScore;
  let yLabel = userInfo.yName + " : " + userScore.yScore;

  let winMsg = `You lost by ${LostBy} Score`;

  document.querySelector(".model h1").innerText = label;
  document.querySelector(".model h3").innerText = `😭 ${losserName} 😭`;
  document.querySelector(".model .xlabel").innerText = xLabel;
  document.querySelector(".model .ylabel").innerText = yLabel;
  document.querySelector(".model .winMsg").innerText = winMsg;

  openModel();
}

socket.on("lost_game", (data) => {
  losing(data.flag);
});

socket.on("user_left", () => {
  document.querySelector(".leftmodel").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
});

socket.on("full", () => {
  document.querySelector(".leftmodel h1").innerText = "Room is Full 🛑❌";
  document.querySelector(".leftmodel").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
});

function openModel() {
  document.querySelector(".result").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
}

function restartGame() {
  window.location.reload();
}

document.querySelector(".dicediv").addEventListener("click", function () {
  if (roomName.classList.contains("hidden")) {
    roomName.classList.remove("hidden");
  } else {
    roomName.classList.add("hidden");
  }
});
