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
  console.log(mainWindow);

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

      case "VLU":
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

    // Change cursor
    mainWindow.style.cursor = "crosshair";
  });

  document.getElementById("addTriangle").addEventListener("click", () => {
    placingSign = true;

    // Change cursor
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

  mainWindow.addEventListener("click", (e) => {
    if (placingCone) {
      placeElement(e, "assets/image/icon/traffic-cone.png");
    } else if (placingSign) {
      placeElement(e, "assets/image/icon/warning.png");
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
