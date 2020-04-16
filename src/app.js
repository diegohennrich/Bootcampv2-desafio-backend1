const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idIsValid(request, response, next) {
  const { params } = request;
  const { id } = params;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid ID." });

  if (!repositories.find(i => i.id === id))
    return response.status(400).json({ error: "Repository not found." });

  return next();
}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { body } = request;
  const { title, url, techs } = body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", idIsValid, (request, response) => {
  const { body, params } = request;
  const { id } = params;
  const { title, url, techs } = body;

  const index = repositories.findIndex(i => i.id === id);

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  // estou fazendo dessa forma, pois se substituir todo o objeto pelo novo ele irá alterar os likes.

  response.json(repositories[index]);
});

app.delete("/repositories/:id", idIsValid, (request, response) => {
  const { params } = request;
  const { id } = params;

  const index = repositories.findIndex(i => i.id === id);

  repositories.splice(index, 1);

  response.status(204).json();
});

app.post("/repositories/:id/like", idIsValid, (request, response) => {
  const { params } = request;
  const { id } = params;

  const index = repositories.findIndex(i => i.id === id);

  repositories[index].likes = repositories[index].likes + 1;

  response.json(repositories[index]);
});

module.exports = app;
