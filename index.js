const express = require("express");

const server = express();

server.use(express.json());

const myProjects = [];

//verifica se o projeto com o determinado ID existe
function checkIdExists(request, response, next) {
  const { id } = request.params;
  const project = myProjects.find(p => p.id == id);

  if (!project) {
    response.status(400).json({ message: "Project not found" });
  }

  return next();
}

//mostra o log de quantas requisições foram feitas
function logRequests(request, response, next) {
  console.count("Number of requisitions");
  return next();
}

server.use(logRequests);

//Rota para cadastrar um novo projeto
server.post("/projects", (request, response) => {
  const { id, title } = request.body;

  const project = {
    id: id,
    title: title,
    tasks: []
  };

  myProjects.push(project);

  response.json(project);
});

//Rota para listar todos projetos
server.get("/projects", (request, response) => {
  response.json(myProjects);
});

//Rota para alterar o título do projeto com base no ID
server.put("/projects/:id", checkIdExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = myProjects.find(p => p.id == id);
  project.title = title;

  response.json(project);
});

//Rota para deletar um projeto com base no ID
server.delete("/projects/:id", checkIdExists, (request, response) => {
  const { id } = request.params;

  const projectIndex = myProjects.findIndex(p => (p.id = id));

  myProjects.splice(projectIndex, 1);

  response.send();
});

//Rota para adicionar novas tarefas no projeto com base no ID
server.post("/projects/:id/tasks", checkIdExists, (request, response) => {
  const { id } = request.params;
  const titleTask = request.body;

  const project = myProjects.find(p => (p.id = id));

  project.tasks.push(titleTask);

  response.json(project);
});

server.listen(3000);
