function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

getRoad = (roads) => {
  randomInt = getRandomInt(roads.length);
  return roads[randomInt];
};

const roads = [
  {
    image: "assets/image/roads/straight.jpg",
    map: {
      trucks: [{ x: 200, y: 150 }],
      cones: [{ x: 300, y: 200 }],
      triangles: [{ x: 100, y: 100 }],
    },
  },
  {
    image: "assets/image/roads/highway.png",
    map: {
      trucks: [{ x: 200, y: 150 }],
      cones: [{ x: 300, y: 200 }],
      triangles: [{ x: 100, y: 100 }],
    },
  },
  {
    image: "assets/image/roads/roundabout.png",
    map: {
      trucks: [{ x: 200, y: 150 }],
      cones: [{ x: 300, y: 200 }],
      triangles: [{ x: 100, y: 100 }],
    },
  },
  {
    image: "assets/image/roads/turn.jpg",
    map: {
      trucks: [{ x: 200, y: 150 }],
      cones: [{ x: 300, y: 200 }],
      triangles: [{ x: 100, y: 100 }],
    },
  },
];

window.addEventListener("load", () => {
  const mainWindow = document.getElementById("mainWindow");
  const body = document.querySelector("body");
  const road = getRoad(roads);
  let placingDistance = false;
  let pointA = null;

  mainWindow.innerHTML += `<img class='road' src='${road.image}' alt='road image'/>`;
  const trucks = document.querySelectorAll(".trucks");

  trucks.forEach((truck) => {
    truck.addEventListener("dragstart", (e) => {
      const name = truck.dataset.name;

      // Create ghost tag
      const ghost = document.createElement("div");
      ghost.classList.add("tag");
      ghost.textContent = name;

      document.body.appendChild(ghost);

      // Use it as drag image
      e.dataTransfer.setDragImage(ghost, 30, 30);

      // Store truck name
      e.dataTransfer.setData("truckName", name);

      // Clean up after drag starts
      setTimeout(() => ghost.remove(), 0);
    });
  });

  document.querySelectorAll("img").forEach((img) => {
    img.setAttribute("draggable", "false");
  });

  mainWindow.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  mainWindow.addEventListener("drop", (e) => {
    e.preventDefault();

    const name = e.dataTransfer.getData("truckName");

    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.textContent = name;

    tag.style.left = `${e.x - 30}px`;
    tag.style.top = `${e.y - 30}px`;

    switch (name) {
      case "VSAV":
        tag.style.backgroundColor = "green";
        break;

      case "VLCDG":
        tag.style.backgroundColor = "blue";
        break;

      case "VSR":
        tag.style.backgroundColor = "black";
        break;

      case "VPR":
        tag.style.backgroundColor = "red";
        break;

      default:
        tag.style.backgroundColor = "black";
        break;
    }

    body.appendChild(tag);
  });

  let placingCone = false;
  let placingSign = false;

  document.getElementById("addCone").addEventListener("click", () => {
    placingCone = true;
    mainWindow.style.cursor = "crosshair";
  });

  document.getElementById("addTriangle").addEventListener("click", () => {
    placingSign = true;
    mainWindow.style.cursor = "crosshair";
  });

  document.getElementById("addDist").addEventListener("click", () => {
    placingDistance = true;
    pointA = null;
    mainWindow.style.cursor = "crosshair";
  });

  const placeElement = (e, srcString) => {
    const cone = document.createElement("img");
    cone.src = srcString;

    cone.style.position = "absolute";
    cone.style.left = `${e.x - 15}px`;
    cone.style.top = `${e.y - 15}px`;
    cone.style.width = "30px";
    cone.style.height = "auto";

    body.appendChild(cone);
  };

  function createArrow(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Line
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.left = `${p1.x}px`;
    line.style.top = `${p1.y}px`;
    line.style.width = `${length}px`;
    line.style.height = "2px";
    line.style.background = "black";
    line.style.transformOrigin = "0 0";
    line.style.transform = `rotate(${angle}deg)`;

    body.appendChild(line);

    // Arrow head
    const arrow = document.createElement("div");
    arrow.style.position = "absolute";
    arrow.style.left = `${p2.x}px`;
    arrow.style.top = `${p2.y}px`;
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.border = "5px solid black";
    arrow.style.transform = `translate(-50%, -50%)`;

    body.appendChild(arrow);

    // Input field (middle of line)
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "distance";

    input.style.position = "absolute";
    input.style.left = `${(p1.x + p2.x) / 2}px`;
    input.style.top = `${(p1.y + p2.y) / 2}px`;
    input.style.transform = "translate(-50%, -50%)";
    input.style.width = "60px";
    input.style.backgroundColor = "white";
    input.style.textAlign = "center";

    body.appendChild(input);
  }

  mainWindow.addEventListener("click", (e) => {
    if (placingCone) {
      placeElement(e, "assets/image/icon/traffic-cone.png");
    } else if (placingSign) {
      placeElement(e, "assets/image/icon/warning.png");
    } else if (placingDistance) {
      const x = e.x;
      const y = e.y;

      const firtArrowHead = document.createElement("div");
      firtArrowHead.style.position = "absolute";
      firtArrowHead.style.left = `${x}px`;
      firtArrowHead.style.top = `${y}px`;
      firtArrowHead.style.width = "0";
      firtArrowHead.style.height = "0";
      firtArrowHead.style.border = "5px solid black";
      firtArrowHead.style.transform = `translate(-50%, -50%)`;

      body.appendChild(firtArrowHead);

      // First click → store point A
      if (!pointA) {
        pointA = { x, y };
        return;
      }

      // Second click → create arrow
      createArrow(pointA, { x, y });

      // Reset
      placingDistance = false;
      pointA = null;
      mainWindow.style.cursor = "default";
    }
  });

  mainWindow.addEventListener("contextmenu", (e) => {
    if (placingCone) {
      e.preventDefault();
      placingCone = false;
      mainWindow.style.cursor = "default";
    } else if (placingSign) {
      e.preventDefault();
      placingSign = false;
      mainWindow.style.cursor = "default";
    }
  });

  function showPopup() {
    const popup = document.getElementById("timeUpPopup");
    popup.style.opacity = 1;
    popup.style.pointerEvents = "all";
  }

  let duration = 60; // seconds
  let timerInterval;

  function startTimer(seconds) {
    duration = seconds;
    updateDisplay();

    timerInterval = setInterval(() => {
      duration--;

      updateDisplay();

      if (duration <= 0) {
        clearInterval(timerInterval);
        showPopup();
      }
    }, 1000);
  }

  function updateDisplay() {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const formatted =
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}`;

    document.getElementById("timer").textContent = formatted;
  }

  startTimer(90);

  function isClose(pos1, pos2, tolerance = 50) {
    return (
      Math.abs(pos1.x - pos2.x) < tolerance &&
      Math.abs(pos1.y - pos2.y) < tolerance
    );
  }

  // const correct = road.map.trucks[0];
  // const placed = { x: element.offsetLeft, y: element.offsetTop };

  // if (isClose(placed, correct)) {
  //   console.log("Correct placement ✅");
  // } else {
  //   console.log("Wrong placement ❌");
  // }
});
