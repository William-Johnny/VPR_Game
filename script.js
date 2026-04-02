function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

getRoad = (roads) => {
  randomInt = getRandomInt(roads.length);
  return roads[randomInt];
};

function isClose(pos1, pos2, tolerance = 50) {
  return (
    Math.abs(pos1.x - pos2.x) < tolerance &&
    Math.abs(pos1.y - pos2.y) < tolerance
  );
}

const roads = [
  {
    image: "assets/image/roads/straight.jpg",
    map: {
      trucks: [
        {
          VLCDG: { x: 538, y: 128 },
          VSAV: { x: 538, y: 250 },
          VSR: { x: 536, y: 576 },
          VPR: { x: 537, y: 708 },
        },
      ],
      cones: [{ x: 501, y: 676 }],
      triangles: [
        { x: 587, y: 856 },
        { x: 408, y: 20 },
      ],
    },
  },
  {
    image: "assets/image/roads/highway.png",
    map: {
      trucks: [
        {
          VLCDG: { x: 725, y: 200 },
          VSAV: { x: 725, y: 300 },
          VSR: { x: 725, y: 515 },
          VPR: { x: 725, y: 650 },
        },
      ],
      cones: [{ x: 700, y: 600 }],
      triangles: [{ x: 765, y: 800 }],
    },
  },
  {
    image: "assets/image/roads/roundabout.png",
    map: {
      trucks: [
        {
          VLCDG: { x: 555, y: 663 },
          VSAV: { x: 553, y: 624 },
          VSR: { x: 410, y: 487 },
          VPR: { x: 530, y: 315 },
        },
      ],
      cones: [{ x: 317, y: 467 }],
      triangles: [
        { x: 169, y: 512 },
        { x: 728, y: 713 },
      ],
    },
  },
  {
    image: "assets/image/roads/turn.jpg",
    map: {
      trucks: [
        {
          VLCDG: { x: 846, y: 468 },
          VSAV: { x: 843, y: 379 },
          VSR: { x: 712, y: 168 },
          VPR: { x: 350, y: 375 },
        },
      ],
      cones: [{ x: 325, y: 353 }],
      triangles: [
        { x: 450, y: 829 },
        { x: 1010, y: 524 },
      ],
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
  const overlay = document.createElement("div");

  // display points
  // displayMapPoints(road);
  // displayTruckDebugPoints(road);

  const trucks = document.querySelectorAll(".trucks");

  const displayContextMenu = (e) => {
    selectedElement = e.target;

    const menu = document.getElementById("contextMenu");

    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = "block";
  };

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

    const rect = mainWindow.getBoundingClientRect();

    console.log(rect.left);

    const x = e.clientX - rect.left + 160;
    const y = e.clientY - rect.top;

    tag.style.position = "absolute";
    tag.style.left = `${x - 30}px`;
    tag.style.top = `${y - 30}px`;
    console.log(e.target);

    console.log(`truck => x: ${Math.round(x)}, y: ${Math.round(y - 30)}`);

    const correctPlacement = road.map.trucks[0][name];

    const placed = { x: x - 30, y: y - 30 };

    console.log(correctPlacement);

    if (isClose(placed, correctPlacement)) {
      console.log("Correct placement ✅");
    } else {
      console.log("Wrong placement ❌");
    }

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

    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      displayContextMenu(e);
    });

    mainWindow.appendChild(tag);
  });

  let placingCone = false;
  let placingSign = false;

  document.getElementById("addCone").addEventListener("click", () => {
    placingCone = true;
    placingSign = false;
    placingDistance = false;
    mainWindow.style.cursor = "crosshair";
  });

  document.getElementById("addTriangle").addEventListener("click", () => {
    placingSign = true;
    placingCone = false;
    placingDistance = false;
    mainWindow.style.cursor = "crosshair";
  });

  document.getElementById("addDist").addEventListener("click", () => {
    placingDistance = true;
    placingSign = false;
    placingCone = false;
    pointA = null;
    mainWindow.style.cursor = "crosshair";
  });

  const placeElement = (e, srcString, name) => {
    const cone = document.createElement("img");
    cone.src = srcString;

    cone.style.position = "absolute";
    cone.style.left = `${e.x - 15}px`;
    cone.style.top = `${e.y - 15}px`;
    cone.style.width = "30px";
    cone.style.height = "auto";
    cone.className = name;

    cone.addEventListener("click", (e) => {
      displayContextMenu(e);
    });

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
    //if (e.target !== mainWindow) return;

    if (placingCone) {
      const correctPlacement = road.map.cones[0];

      const placed = { x: e.x, y: e.y };

      console.log(`x: ${e.x}, y: ${e.y}`);

      if (isClose(placed, correctPlacement)) {
        console.log("Correct placement ✅");
      } else {
        console.log("Wrong placement ❌");
      }
      placeElement(e, "assets/image/icon/traffic-cone.png", "cone");
    } else if (placingSign) {
      const firstCorrectPlacement = road.map.triangles[0];
      const secondCorrectPlacement = road.map.triangles[1];

      const placed = { x: e.x, y: e.y };

      console.log(`x: ${e.x}, y: ${e.y}`);

      if (
        isClose(placed, firstCorrectPlacement) ||
        isClose(placed, secondCorrectPlacement)
      ) {
        console.log("Correct placement ✅");
      } else {
        console.log("Wrong placement ❌");
      }
      placeElement(e, "assets/image/icon/warning.png", "triangle");
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
    const menu = document.getElementById("contextMenu");

    if (!menu.contains(e.target)) {
      menu.style.display = "none";
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

  startTimer(100000);

  let selectedElement = null;
  const test = document.querySelector(".tag");

  document.getElementById("deleteBtn").addEventListener("click", () => {
    if (selectedElement) {
      selectedElement.remove();
      selectedElement = null;
    }

    document.getElementById("contextMenu").style.display = "none";
  });

  // function createPoint(pos, color) {
  //   const div = document.createElement("div");
  //   div.classList.add("map-point");

  //   div.style.left = `${pos.x}px`;
  //   div.style.top = `${pos.y}px`;
  //   div.style.backgroundColor = color;

  //   return div;
  // }

  // function createDebugPoint(x, y, name) {
  //   const point = document.createElement("div");
  //   point.classList.add("debug-point");

  //   point.style.position = "absolute";
  //   point.style.left = `${x}px`;
  //   point.style.top = `${y}px`;
  //   point.style.transform = "translate(-50%, -50%)";

  //   point.textContent = name;

  //   return point;
  // }

  // function displayTruckDebugPoints(road) {
  //   const trucks = road.map.trucks[0]; // your structure

  //   Object.entries(trucks).forEach(([name, pos]) => {
  //     const point = createDebugPoint(pos.x, pos.y, name);
  //     mainWindow.appendChild(point);
  //   });
  // }

  // function displayMapPoints(road) {
  //   // // Trucks (blue)
  //   // road.map.trucks.forEach((p) => {
  //   //   const point = createPoint(p, "blue");
  //   //   overlay.appendChild(point);
  //   // });

  //   // Cones (orange)
  //   road.map.cones.forEach((p) => {
  //     const point = createPoint(p, "orange");
  //     overlay.appendChild(point);
  //   });

  //   // Triangles (yellow)
  //   road.map.triangles.forEach((p) => {
  //     const point = createPoint(p, "yellow");
  //     overlay.appendChild(point);
  //   });
  // }
});
