const NB_CASES = 8;
var coups = [];
var sens = 0;
const model = [];
const pieces = {
  PION: "pion",
  TOUR: "tour",
  ROI: "roi",
  REINE: "reine",
  FOU: "fou",
  CAVALIER: "cavalier",
};

function table() {
  return document.getElementById("plateau");
}

function piece(pion, team) {
  const image = document.createElement("img");
  image.src = `resources/${pion}-${team}.png`;
  image.classList.add("w-full", "h-full");
  return image;
}

function isIn(element, liste) {
  return liste.filter((el) => el == element).length == 1;
}

function back() {
  if (sens == 0) {
    table().style.transform = "rotate(180deg)";
    sens = 1;
  } else {
    table().style.transform = "rotate(0deg)";
    sens = 0;
  }
}

function getImageChildren(element, reverse = false) {
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child.nodeName === "IMG") {
      child.style.width = "50px";
      child.style.height = "50px";
      if (reverse) {
        child.style.transform = "rotate(180deg)";
      }
      return child;
    }
  }
}

function removeContent(element) {
  const team = element.getAttribute("equipe");
  console.log(team);
  if (team != "empty") {
    const clone = getImageChildren(element.children[0], team == "noirs");
    const arrive = document.getElementById("pieces-" + team);
    arrive.appendChild(clone);
    element.setAttribute("equipe", null);
    let child = element.lastElementChild;
    while (child) {
      element.removeChild(child);
      child = element.lastElementChild;
    }
  }
}

function swapFondIfNeeded(e1, e2) {
  const fond1 = e1.getAttribute("fond");
  const fond2 = e2.getAttribute("fond");
  if (fond1 != fond2) {
    e1.setAttribute("fond", fond2);
    e1.classList.remove(fond1);
    e1.classList.add(fond2);
    e2.setAttribute("fond", fond1);
    e2.classList.remove(fond2);
    e2.classList.add(fond1);
  }
}

function swap(a, b) {
  const teamA = a.getAttribute("equipe");
  const teamB = b.getAttribute("equipe");
  if (teamA == "empty") {
    alert(
      "Ce coup ne peut pas être joué :\nOn ne peut pas jouer en avançant une pièce vide"
    );
  } else if (teamA != "empty" && teamB != "empty" && teamA == teamB) {
    alert("Ce coup ne peut pas être joué");
  } else {
    let dummy = document.createElement("span");
    a.before(dummy);
    b.before(a);
    swapFondIfNeeded(a, b);
    if (a != b) {
      removeContent(b);
    }
    dummy.replaceWith(b);
    back();
  }
}

function initPlateau() {
  for (i = 0; i < NB_CASES; i++) {
    const tr = document.createElement("tr");
    const ligne = [];
    for (j = 0; j < NB_CASES; j++) {
      const case_plateau = { x: i, y: j };
      const td = document.createElement("td");
      const content = document.createElement("div");
      const title = document.createElement("span");
      title.classList.add("tooltip");
      content.classList.add("flex", "flex-col", "h-[70px]", "w-[70px]");
      td.appendChild(content);
      td.id = `case_${i}_${j}`;
      td.setAttribute(
        "equipe",
        isIn(case_plateau.x, [0, 1])
          ? "noirs"
          : isIn(case_plateau.x, [6, 7])
          ? "blancs"
          : "empty"
      );
      let whiteFond = (i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0);
      let fond = whiteFond ? "bg-yellow-400/20" : "bg-black/20";
      td.setAttribute("fond", fond);
      let fore =
        td.getAttribute("equipe") == "blancs" ? "text-black" : "text-white";
      if (td.getAttribute("equipe") == "blancs") {
        title.classList.add("bg-white", "w-full");
      }
      if (td.getAttribute("equipe") == "noirs") {
        title.classList.add("bg-black", "w-full");
      }
      td.classList.add(
        "border-2",
        "border-black",
        "h-[70px]",
        "w-[70px]",
        "text-center",
        "hover:bg-cyan-600",
        "drop-shadow-2xl",
        fond,
        fore
      );
      ligne.push(td);
      let pieceToPlace = null;
      if (isIn(case_plateau.x, [1, 6])) {
        pieceToPlace = pieces.PION;
      } else if (isIn(case_plateau.x, [0, 7]) && isIn(case_plateau.y, [1, 6])) {
        pieceToPlace = pieces.CAVALIER;
      } else if (isIn(case_plateau.x, [0, 7]) && isIn(case_plateau.y, [0, 7])) {
        pieceToPlace = pieces.TOUR;
      } else if (isIn(case_plateau.x, [0, 7]) && isIn(case_plateau.y, [2, 5])) {
        pieceToPlace = pieces.FOU;
      } else if (isIn(case_plateau.x, [0, 7]) && case_plateau.y == 3) {
        pieceToPlace = pieces.REINE;
      } else if (isIn(case_plateau.x, [0, 7]) && case_plateau.y == 4) {
        pieceToPlace = pieces.ROI;
      }
      td.addEventListener("click", function () {
        const place = this.id.split("case_")[1].split("_");
        const [x, y] = place;
        coups.push([x, y]);
        if (coups.length == 2) {
          let [src, dest] = coups;
          swap(model[src[0]][src[1]], model[dest[0]][dest[1]]);
          coups = [];
        }
      });
      if (pieceToPlace) {
        title.textContent = pieceToPlace.toLowerCase();
        let team = td.getAttribute("equipe");
        if (team == "blancs") {
          content.appendChild(piece(pieceToPlace, team));
          content.appendChild(title);
          title.classList.add("absolute", "z-5", "bottom-[0px]", "left-0");
        } else {
          content.appendChild(title);
          title.classList.add(
            "rotate-180",
            "absolute",
            "z-5",
            "top-[0px]",
            "left-0"
          );
          content.appendChild(piece(pieceToPlace, team));
        }
      }

      tr.appendChild(td);
    }
    model.push(ligne);
    table().appendChild(tr);
  }
}

window.onload = function () {
  initPlateau();
};
