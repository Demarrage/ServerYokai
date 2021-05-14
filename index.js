const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const configCors = {
  origin: "*",
  opitonStatusSuccess: "200",
};
// Configurar a conecxao com o banco de dados
const cx = mysql.createConnection({
  host: "localhost",
  user: "root",
  passaword: "",
  database: "comercialdb",
  port: "3306",
});
cx.connect((error, dados) => {
  if (error) {
    console.error(`Erro ao tentar executar o servidor -> ${erro.stack}`);
    return;
  }
  console.log(`Dados do servidor -> ${cx.threadId}`);
});
// rotas para o usuario
app.post("/usuario/cadastro", cors(configCors), (req, res) => {
  cx.query("insert into tbusuario set ?", [req.body], (error, result) => {
    if (error) {
      res.status(400).send({ output: `nao cadastrou -> ${error}` });
      return;
    }
    res.status(201).send({ output: result });
  });
});
app.get("/usuario/listar", cors(configCors), (req, res) => {
  cx.query("select * from tbusuario", (error, result) => {
    if (error) {
      res
        .status(400)
        .send({ output: `Não foi possivel listar os usuarios -> ${error}` });
      return;
    }
    res.status(200).send({ output: result });
  });
});
app.put("/usuario/alterarsenha/:id", cors(configCors), (req, res) => {
  cx.query(
    "update tbusuario set ? where idusuario=?",
    [req.body, req.params.id],
    (error, result) => {
      if (error) {
        res
          .status(400)
          .send({ output: `Não foi possivel alterar a senha -> ${error}` });
        return;
      }
      res.status(200).send({ output: result });
    }
  );
});
app.post("/usuario/login", cors(configCors), (req, res) => {
  const us = req.body.nomeusuario;
  const cf = req.body.cpf;
  const em = req.body.email;
  const sh = req.body.senha;
  cx.query(
    `select u.* from tbusuario u
    inner join tbcliente cl
    on u.idusuario = cl.idusuario
    inner join tbcontato co
    on cl.idcontato = co.idcontato
    where (u.nomeusuario=? or cl.cpf=? or co.email=?) and u.senha=?;`,
    [us, cf, em, sh],
    (error, result) => {
      if (error) {
        res
          .status(400)
          .send({ output: `Erro ao tentar efetuar login -> ${error}` });
        return;
      }
      res.status(200).send({ output: result });
    }
  );
});

app.listen(5005, () => console.log("Servidor online na porta 5005"));
