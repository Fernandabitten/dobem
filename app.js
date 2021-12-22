require("dotenv").config();
const express = require("express");
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
const fs = require("fs");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
let path = require("path");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("static"));
app.use(
  "/mystyle.css",
  express.static(path.join(__dirname, "/static/styles/mystyle.css"))
);
app.use("/static", express.static(path.join(__dirname, "static")));

const PAGE_INDEX_DIR = __dirname + "/view/index.html";
const PAGE_SIGN_IN_DIR = __dirname + "/view/sign-in.html";
const PAGE_SIGN_UP_DIR = __dirname + "/view/sign-up.html";
const PAGE_PRIVACY_POLICY_DIR = __dirname + "/view/privacy-policy.html";
const MESSAGE = __dirname + "/db/thank-mensage.json";


const tokenVerification = async (
  req,
  res,
  option1,
  option2,
  filePath1,
  filePath2,
  redirectedPath
) => {
  const { accessToken } = req.cookies;
  const toDoOption1 = option1;
  const toDoOption2 = option2;
  if (accessToken) {
    console.log("accessToken = true");
    await jwt.verify(accessToken, process.env.KEY, (err, payload) => {
      if (err) {
        res.redirect(301, "/error-page");
      } else if (
        payload.userType == "regularUser" ||
        payload.userType == "admin"
      ) {
        console.log("not error");
        if (toDoOption1 == "toHomePage") {
          res.redirect(301, "/home");
        } else if (toDoOption1 == "sendFile") {
          res.sendFile(filePath1);
        } else {
          res.redirect(301, "/error-page");
        }
      } else {
        res.redirect(301, "/error-page");
      }
    });
  } else {
    console.log("tokenVerification 'else'");
    if (toDoOption2 == "sendFile") {
      res.sendFile(filePath2);
    } else if (toDoOption2 == "redirect") {
      res.redirect(301, redirectedPath);
    } else {
      res.redirect(301, "/error-page");
    }
  }
};

let SESSIONS = [];

// -------- APIs -------------------//
app.get("/", (req, res) => {
  res.clearCookie("session_id");
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "toHomePage",
    "sendFile",
    "",
    PAGE_INDEX_DIR,
    "/"
  );
});

app.get("/sign-in", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "toHomePage",
    "sendFile",
    "",
    PAGE_SIGN_IN_DIR,
    "/"
  );
});

app.get("/sign-up", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "toHomePage",
    "sendFile",
    "",
    PAGE_SIGN_UP_DIR,
    "/"
  );
});

app.get("/privacy-policy", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "toHomePage",
    "sendFile",
    PAGE_PRIVACY_POLICY_DIR,
    PAGE_PRIVACY_POLICY_DIR,
    "/"
  );
});


app.get("/home", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/home.html",
    __dirname + "/view/home.html",
    "/"
  );
});

app.get("/to-give", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/to-give.html",
    __dirname + "/view/to-give.html",
    "/"
  );
});

app.get("/my-requests", (req, res) => {
  //res.sendFile(PAGE_ORDER_HISTORY_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/my-requests.html",
    __dirname + "/view/my-requests.html",
    "/"
  ); 
});

app.get("/my-donations", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/my-donations.html",
    __dirname + "/view/my-donations.html",
    "/"
  );
});

app.get("/make-request", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/make-request.html",
    __dirname + "/view/make-request.html",
    "/"
  );
});

app.get("/error-page", (req, res) => {
  res.clearCookie("accessToken");
  res.sendFile(__dirname + "/view/error-page.html");
});

app.get("/donation", async (req, res) => {
  const { cookies } = req;
  const { user_id } = cookies;

  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );

  const data = await getMyDonations(user_id);
  console.log(data);
  res.send(data);
});

app.get("/orderUser", async (req, res) => {
  const { cookies } = req;
  const { user_id } = cookies;

  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );

  try {
    const data = await getMyRequests(user_id);
    console.log(data)
    res.send(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

app.get("/order", async (req, res) => {
  const { cookies } = req;
  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );

  const data = await getOrders();
  res.send(data);
});

app.get("/log-out", (req, res) => {
  const cookieReference = req.cookies.session_id;
  const session = SESSIONS.filter((e) => {
    return e.token !== cookieReference;
  });
  SESSIONS = session;
  res.clearCookie("session_id");
  //console.log("log out SESSIONS: ", SESSIONS);
});

app.get("/verify", (req, res) => {
  const cookieReference = req.cookies.session_id;
  const verify = () => {
    const exists = SESSIONS.some((e) => {
      if (e.token == cookieReference) {
        return true;
      } else {
        return false;
      }
    });
    return exists;
  };
  if (verify() === false) {
    res.send("/");
  }
});

app.post("/sign-in", async (req, res) => {

  try {
    const { username } = req.body;
    const { password } = req.body;

    const savedUser = await getUserLogin(username);
    console.log("informações de Login:", savedUser);

    if (savedUser) {

      const hash = await bcrypt.hash(password, savedUser.salt);

      if (savedUser.hash == hash) {

        const sessionToken = await bcrypt.hash(
          new Date().getTime() + username,
          savedUser.salt
        );

        SESSIONS.push({ token: sessionToken, username: username });

        res.cookie("session_id", sessionToken);
        res.cookie("user_id", savedUser.id);

        
        res.send("/home");

      } else {
        res.status(403).json({ msg: "Usuário ou senha incorretos" });
      }

    } else {
      res.status(404).json({ msg: "Usuário não encontrado" });
    }

  } catch (err) {
    res.status(500).json({ msg: "Erro interno, tente mais tarde" });
  }
});

app.post("/sign-up-verify", async (req, res) => {
  try {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 19);
    const newUser = req.body;
    let cpfParam = "";
    let usernameParam = "";
    let emailParam = "";
    let phoneParam = "";

    try {

      const users = await getUsersUniqueInformations();
      console.log(users)

      if (users.find((user) => user.cpf == newUser.cpf)) {
        cpfParam = "<h4>CPF já cadastrado.</h4>";
      }
      if (users.find((user) => user.username == newUser.username)) {
        usernameParam = "<h4>Nome de usuário já existe.</h4>";
      }
      if (users.find((user) => user.email == newUser.email)) {
        emailParam = "<h4>Email já cadastrado para outro usuário.</h4>";
      }
      if (
        users.find(
          (user) =>
            user.ddd + user.cell ==
            newUser.ddd + newUser.cell
        )
      ) {
        phoneParam =
          "<h4>Número de telefone já cadastrado para outro usuário.</h4>";
      }

      const errorContent = cpfParam + usernameParam + emailParam + phoneParam;

      if (errorContent != "") {
        res.status(409).json({ message: errorContent });
      } else {

        const saltRounds = 8;
        let salt = await bcrypt.genSalt(saltRounds);
        let hash = await bcrypt.hash(newUser.password, salt);

        const newUserJson = {
          ...newUser,
          hash: hash,
          salt: salt,
          creation: dateString,
        };

        await insertNewUser(newUserJson);
        res.status(201).json({ message: "NEW USER CREATED" });
      }
    } catch(e) {
      res
        .status(500)
        .json({
          message: "Ocorreu um erro no cadastro do usuário",
          error: e,
        });
    }

  } catch (e) {
    res.status(500).json({ message: "Ocorreu um erro no servidor", error: e });
  }
});

app.post("/register-order", async(req, res) => {
  const { cookies } = req;
  const { user_id } = cookies;

  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );

  try {
    const newOrder = req.body;
    console.log(typeof(newOrder.type))
    console.log(newOrder);

    await insertNewOrder(newOrder, user_id);

  } catch {

    res.status(500).json({ message: err.message });
  }
});

app.patch("/request-done", async (req, res) => {
  try {
    const requestId = req.body.data;
    const userId = req.cookies.user_id;
    console.log(userId);
    const selectedOrder = await confirmHelp(requestId);

    const phone = selectedOrder.ddd + selectedOrder.cell;
    const title = selectedOrder.title;
    const username = selectedOrder.username;
    res.status(200).json({ "phone": phone, "title": title, "username": username });


    completeOrder(userId, requestId);

  } catch (error) {
    res.status(500).json({ "message": "ERRO INTERNO" });
  }
});

//----------------- FUNÇÕES DO BANCO ------------------
const getUserLogin = async (username) => {

  let data = null;

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    const result = await client.query("SELECT hash, salt, id FROM users WHERE username = $1", [username]);
    data = result.rows;

  } catch (error) {

    console.log(error);

  } finally {

    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

  return data[0];
}

const getOrders = async () => {

  let data = null;

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    const result = await client.query(`
      SELECT help_orders.id, categorie_id, status_id, title, description, users.username
      FROM help_orders
      INNER JOIN users ON help_orders.grantee_id = users.id
    `);
    data = result.rows;

  } catch (error) {

    console.log(error);

  } finally {

    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

  return data;
}

const confirmHelp = async (id) => {

  let data = null;

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    const result = await client.query(`
      SELECT help_orders.id, title, users.username, users.ddd, users.cell
      FROM help_orders INNER JOIN users ON help_orders.grantee_id = users.id
      WHERE help_orders.id = $1
    `, [id]);

    data = result.rows;

  } catch (error) {

    console.log(error);

  } finally {

    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

  return data[0];
}

const completeOrder = async (userId, orderId) => {

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    await client.query("BEGIN");
    await client.query(`
      UPDATE "help_orders" SET status_id = 2, giver_id = $1
      WHERE id = $2
    `, [userId, orderId]);

  } catch (error) {

    await client.query("ROLLBACK");
    console.log(error);

  } finally {

    await client.query("COMMIT");
    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }
}

const getMyDonations = async (userId) => {

  let data = null;

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    const result = await client.query(`
      SELECT help_orders.id, categorie_id as type, status_id, title, description, users.username
      FROM help_orders
      INNER JOIN users ON help_orders.grantee_id = users.id
      WHERE giver_id = $1
    `, [userId]);

    data = result.rows;

  } catch (error) {

    console.log(error);

  } finally {

    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

  return data;
}

const getMyRequests = async (userId) => {

  let data = null;

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    const result = await client.query(`
      SELECT title, categorie_id AS "type", status_id AS status_Order, users.username, description FROM help_orders
      INNER JOIN users ON grantee_id = users.id
      WHERE grantee_id = $1
    `, [userId]);

    data = result.rows;

  } catch (error) {

    console.log(error);

  } finally {

    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

  return data;
}

const getUsersUniqueInformations = async () => {

  let data = null;

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    const result = await client.query("SELECT username, cpf, email, ddd, cell FROM users");
    data = result.rows;

  } catch (error) {

    console.log(error);

  } finally {

    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

  return data;
}

const insertNewUser = async (userObject) => {

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    await client.query("BEGIN");
    await client.query(`
      INSERT INTO users (cpf, fullname, username, email, hash, cep, address, district, city, state, ddd, cell, creation, salt) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [userObject.cpf, userObject.fullName, userObject.username, userObject.email, userObject.hash, userObject.cep, userObject.address, userObject.district,
    userObject.city, userObject.state, userObject.ddd, userObject.cell, userObject.creation, userObject.salt]);

  } catch (error) {

    await client.query("ROLLBACK");
    console.log(error);

  } finally {

    await client.query("COMMIT");
    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }
}

const insertNewOrder = async (orderObject, userId) => {

  const client = new Client({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE,
    ssl: true
  });

  try {

    await client.connect();
    console.log("Conectado ao Banco");
    await client.query("BEGIN");
    await client.query(`
    INSERT INTO "help_orders" (title, description, categorie_id, grantee_id) VALUES
      ($1, $2, $3, $4)
    `, [orderObject.title,orderObject.description,orderObject.type,userId]);

  } catch (error) {

    await client.query("ROLLBACK");
    console.log(error);

  } finally {

    await client.query("COMMIT");
    await client.end();
    console.log("Desconectado ao Banco de Dados");

  }

}

app.listen(port);