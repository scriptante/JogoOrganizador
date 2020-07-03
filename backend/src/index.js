const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const projects = [];

function logRequests(req, res, next) {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  next();
}

function idValidate(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found." });
  }
  req.index = projectIndex;
  next();
}

app.use(logRequests);

app.get("/projects", (req, res) => {
  const { title } = req.query;
  const result = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;
  return res.json(result);
});

app.post("/projects", (req, res) => {
  const { title, owner, url } = req.body;
  const project = { id: uuid(), title, owner, url };
  projects.push(project);
  return res.json(project);
});

app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title, owner, url } = req.body;
  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found." });
  }
  const project = { id, title, owner, url };
  projects[projectIndex] = project;
  return res.json(project);
});

app.delete("/projects/:id", idValidate, (req, res) => {
  projects.splice(req.index, 1);
  return res.status(204).send();
});

app.listen(3333, () => {
  console.log("(☞ﾟヮﾟ)☞ Servido iniciado");
});
