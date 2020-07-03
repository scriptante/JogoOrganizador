const productList = document.getElementById("ProjectList");
const searchInput = document.getElementById("searchInput");
const projectForm = document.getElementById("projectForm");
const inputTitle = document.getElementById("inputTitle");
const inputOwner = document.getElementById("inputOwner");
const inputUrl = document.getElementById("inputUrl");

function loadProjects(search) {
  fetch(`http://localhost:3333/projects${search}`)
    .then((response) => {
      response.json().then((data) => {
        if (data.length === 0) {
          ListWarning("Lista vazia");
        }
        Array.from(data, (project) => {
          productList.innerHTML = "";
          productList.appendChild(createLI(project));
        });
      });
    })
    .catch((err) => {
      ListWarning("Servidor inacessível", true);
    });
}

function ListWarning(message, havaRefreshButton = false) {
  productList.innerHTML = "";
  const li = document.createElement("li");
  const h2 = document.createElement("h2");
  h2.textContent = message;
  li.appendChild(h2);
  if (havaRefreshButton) {
    const refreshButton = document.createElement("button");
    refreshButton.addEventListener("click", () => {
      loadProjects("");
    });
    refreshButton.textContent = "Refresh";
    li.appendChild(refreshButton);
  }
  productList.appendChild(li);
}

function createLI(project) {
  const li = document.createElement("li");
  const pTitle = document.createElement("p");
  pTitle.textContent = `Titulo: ${project.title}`;
  li.appendChild(pTitle);
  const pOwner = document.createElement("p");
  pOwner.textContent = `Proprietario: ${project.owner}`;
  li.appendChild(pOwner);
  const aUrl = document.createElement("a");
  aUrl.textContent = `Url: ${project.url}`;
  aUrl.setAttribute("href", project.url);
  aUrl.setAttribute("target", "_blank");
  li.appendChild(aUrl);
  const br = document.createElement("br");
  li.appendChild(br);
  const deleteButtonId = document.createElement("button");
  deleteButtonId.textContent = "Remover";
  deleteButtonId.addEventListener("click", () => {
    deleteProjet(project.id);
    li.innerHTML = "";
  });
  li.appendChild(deleteButtonId);
  return li;
}

searchInput.addEventListener("input", () => {
  const { value } = searchInput;
  loadProjects(`?title=${value}`);
});

function deleteProjet(id) {
  fetch(`http://localhost:3333/projects/${id}`, { method: "DELETE" });
}

addEventListener("submit", (event) => {
  event.preventDefault();
  const title = inputTitle.value;
  const owner = inputOwner.value;
  const url = inputUrl.value;
  uploadProject(title, owner, url);
});

function uploadProject(title, owner, url) {
  fetch("http://localhost:3333/projects", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ title, owner, url }),
  }).then((res) => {
    res.json().then((data) => {
      productList.appendChild(createLI(data));
    });
  });
}

loadProjects("");
