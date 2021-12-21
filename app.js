require("dotenv").config();
const express = require("express");
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
const crypto = require("crypto");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
let path = require("path");
const { type, cookie } = require("express/lib/response");
const jwt = require("jsonwebtoken");

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
const PAGE_HOME_DIR = __dirname + "/view/home.html";
const PAGE_TO_GIVE_DIR = __dirname + "/view/to-give.html";
const PAGE_RECEIVE_LIST_DIR = __dirname + "/view/receive-list.html";
const PAGE_RECEIVE_DETALES_DIR = __dirname + "/view/receive-detales.html";
const PAGE_TO_RECEIVE_DIR = __dirname + "/view/to-receive.html";
const PAGE_THANK_SEND_DIR = __dirname + "/view/thank-send.html";
const PAGE_THANK_FORM_DIR = __dirname + "/view/thank-form.html";
const PAGE_ORDER_HISTORY_DIR = __dirname + "/view/my-requests.html";
const PAGE_MAKE_REQUESTS_DIR = __dirname + "/view/make-request.html";
const PAGE_MAKE_REQUESTS_MSG_DIR =
  __dirname + "/view/make-request-send-msg.html";
const PAGE_HELP_SEND_MSG_DIR = __dirname + "/view/help-send-msg.html";
const PAGE_MY_DONATION_DIR = __dirname + "/view/my-donations.html";
const MESSAGE = __dirname + "/db/thank-mensage.json";
const DONATIONS_DB = __dirname + "/db/donations.json";
const ORDER_DB = __dirname + "/db/order.json";
const ORDERS_DB = __dirname + "/db/orders.json";
const USERS_DB = __dirname + "/db/users.json";

const tokenVerification = async (
  req,
  res,
  option1,
  option2,
  filePath1,
  filePath2,
  redirectedPath
) => {
  //console.log("tokenVerification")
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
  /*const { cookies } = req;
  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id    
  );
 res.sendFile(PAGE_INDEX_DIR)*/

  //res.sendFile(PAGE_INDEX_DIR);
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
  //res.sendFile(PAGE_SIGN_IN_DIR);
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
  //res.sendFile(PAGE_SIGN_UP_DIR);
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
 //res.sendFile(PAGE_PRIVACY_POLICY_DIR);
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
  //res.sendFile(PAGE_HOME_DIR);
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
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/to-give", (req, res) => {
  //res.sendFile(PAGE_TO_GIVE_DIR);
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
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/receive-list", (req, res) => {
  //res.sendFile(P PAGE_RECEIVE_LIST_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/treceive-list.html",
    __dirname + "/view/receive-list.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/receive-detales", (req, res) => {
  //res.sendFile(PAGE_RECEIVE_DETALES_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/receive-detales.html",
    __dirname + "/view/receive-detales.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/to-receive", (req, res) => {
  // res.sendFile(PAGE_TO_RECEIVE_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/to-receive.html",
    __dirname + "/view/to-receive.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/thank-send", (req, res) => {
  //res.sendFile(PAGE_THANK_SEND_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/thank-send.html",
    __dirname + "/view/thank-send.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/thank-form", (req, res) => {
  //res.sendFile(PAGE_THANK_FORM_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/thank-form.html",
    __dirname + "/view/thank-form.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
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
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/help-send-msg", (req, res) => {
  //res.sendFile(PAGE_HELP_SEND_MSG_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/help-send-msg.html",
    __dirname + "/view/help-send-msg.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/my-donations", (req, res) => {
  //res.sendFile(PAGE_DONATION_HISTORY_DIR);
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
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/make-request", (req, res) => {
  //res.sendFile(PAGE_MAKE_REQUESTS_DIR);
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
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/make-request-send-msg", (req, res) => {
  //res.sendFile(PAGE_MAKE_REQUESTS_MSG_DIR);
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/make-request-send-msg.html",
    __dirname + "/view/make-request-send-msg.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/cause", (req, res) => {
  //insert param :cause
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/cause.html",
    __dirname + "/view/cause.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/cause/detail", (req, res) => {
  //insert param :cause and :id '/cause/:cause/detail/:id
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/detail.html",
    __dirname + "/view/detail.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/thank-you", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/thank-you.html",
    __dirname + "/view/thank-you.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/request-confirmation", (req, res) => {
  const requisition = req;
  const response = res;
  tokenVerification(
    requisition,
    response,
    "sendFile",
    "sendFile",
    __dirname + "/view/request-confirmation.html",
    __dirname + "/view/request-confirmation.html",
    "/"
  ); //change "option2" to redirect and "filePath2" to ""
});

app.get("/error-page", (req, res) => {
  res.clearCookie("accessToken");
  res.sendFile(__dirname + "/view/error-page.html");
});

app.get("/receive-list", (req, res) => {
  //res.sendFile(PAGE_GIVE_LIST_DIR);
  /*const requisition = req;
  const response = res;
  tokenVerification(requisition, response, "sendFile", "sendFile", __dirname+"/view/request-receive-list.html", __dirname+"/view/request-receive-list.html", "/")//change "option2" to redirect and "filePath2" to ""*/
  const { cookies } = req;

  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );
  res.sendFile(PAGE_GIVE_LIST_DIR);
});

app.get("/donation", (req, res) => {
  const { cookies } = req;

  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );
  res.sendFile(DONATIONS_DB);
});

app.get("/orderUser", (req, res) => {
  const { cookies } = req;
  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );
  readFile(ORDERS_DB)
    .then((ordersDB) => {
      res.send(
        ordersDB.filter(order => order.username == session.username) 
      );
      return
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.get("/order", (req, res) => {
  const { cookies } = req;
  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );
  res.sendFile(ORDERS_DB);
  /*console.log(session.username + " " + "session")*/

   /*readFile(ORDERS_DB)
   .then((ordersDB) => {
      res.send(
        ordersDB.filter(order => order.username == session.username) 
        /*ordersDB.map((order) => {
          if (order.username === session.username) {
            // console.log(order.title + " " + "deu match")
            console.log(order.title + " " + order.username);
            const orderUser = order.title + order.description + order.username;
            console.log(orderUser)
            return order;
          }
        })*/  

     /* );
      return
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });*/
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

/*app.get("/info", (req, res) => {
  try {
      res.status(200).json({"message": "Usuário encontrado", "data": "&ltnome do usuário&gt"})
  } catch (e) {
      res.status(500).json({"message": "Ocorreu um erro no servidor", "error": e});
  };
});*/

app.post("/sign-in", async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    readFile(USERS_DB).then(async (usersDB) => {
      const savedUser = usersDB.find((element) => element.username == username);

      if (savedUser) {
        const hash = await bcrypt.hash(password, savedUser.salt);

        if (savedUser.hash == hash) {
          const sessionToken = await bcrypt.hash(
            new Date().getTime() + username,
            savedUser.salt
          );
          SESSIONS.push({ token: sessionToken, username: username });
          //console.log("log in SESSIONS: ", SESSIONS);
          res.cookie("session_id", sessionToken);

          if (savedUser.userType === "regularUser") {
            res.send("/home"); /*colocar a logica de usuario logado*/
          } else {
            res.send("/home");
          }
        } else {
          res.status(403).json({ msg: "Usuário ou senha incorretos" });
        }
      } else {
        res.status(404).json({ msg: "Usuário não encontrado" });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro interno, tente mais tarde" });
  }
});

app.post("/sign-up-verify", (req, res) => {
  try {
    const newUser = req.body;
    let cpfParam = "";
    let usernameParam = "";
    let emailParam = "";
    let phoneParam = "";
    readFile("./db/users.json", "[]")
      .then(async (users) => {
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
              user.phoneDDD + user.phoneNumber ==
              newUser.phoneDDD + newUser.phoneNumber
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
            userType: "regularUser",
            creationTimestamp: new Date().getTime(),
            deletionTimestamp: "",
            " usertype": "user",
          };

          users.push(newUserJson);

          fs.writeFile("./db/users.json", JSON.stringify(users), (err) => {
            if (err)
              res
                .status(500)
                .json({
                  message: "Ocorreu um erro na criação do usuário",
                  error: err,
                });
          });
          res.status(201).json({ message: "NEW USER CREATED" });
        }
      })
      .catch((e) => {
        res
          .status(500)
          .json({
            message: "Ocorreu um erro no cadastro do usuário",
            error: e,
          });
      });
  } catch (e) {
    res.status(500).json({ message: "Ocorreu um erro no servidor", error: e });
  }
});

app.post("/register-order", (req, res) => {
  const { cookies } = req;
  const session = SESSIONS.find(
    (element) => element.token == cookies.session_id
  );
  readFile(ORDERS_DB)
    .then((ordersDB) => {
      const newOrder = req.body;
      if (validateOrder(newOrder)) {
        newOrder["id"] = Date.now().toString();
        newOrder["username"] = session.username;
        newOrder["statusOrder"] = true;
        ordersDB.push(newOrder);

        saveFile(ORDERS_DB, ordersDB).then((result) => res.send("OK"));
      } else {
        res.status(403).json({ msg: "Pedido inválido" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.post("/send-message", (req, res) => {
  readFile(MESSAGE)
    .then((mensagesDB) => {
      const newMessage = req.body;
      if (validateMessage(newMessage)) {
        newMessage["id"] = Date.now().toString();
        mensagesDB.push(newMessage);
        saveFile(MESSAGE, mensagesDB).then((result) => res.send("OK"));
      } else {
        res.status(403).json({ msg: "Email inválido" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// ------ FUNCOES UTEIS -------------//
const validateUser = (user, usersDB) => {
  let isValid = true;
  isValid = user.username && user.password && user.fullname;
  isValid = !usersDB.some((element) => element.username == user.username);
  return isValid;
};

const validateMessage = (form) => {
  let isValid = true;
  isValid = form.name && form.textarea;
  return isValid;
};

const validateOrder = (order) => {
  let isValid = true;
  isValid = order.type && order.title && order.telephone && order.description;
  return isValid;
};

const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const saveFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    const dataText = JSON.stringify(data);
    fs.writeFile(fileName, dataText, (err) => {
      if (err) {
        reject(err);
      }
      resolve("JSON salvo");
    });
  });
};

app.listen(port);