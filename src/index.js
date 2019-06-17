const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());

const {
  AuthMiddleware
} = require('./auth.middleware');

app.use(bodyParser.json());
const SECRET = "foo";

app.post("/login", async (req, res) => {
  const {
    login,
    password
  } = req.body;

  const token = jwt.sign({
      login,
      password,
      iat: Math.floor(Date.now() / 1000) - 30
    },
    SECRET
  );
  res.send({
    message: "ok",
    token
  });
});

app.get("/verify", async (req, res) => {
  const headers = req.headers.authorization;
  const token = headers.replace("Bearer ", "");

  if (token == "") {
    return res.send({
      message: "not auth"
    });
  }
  try {
    const obj = jwt.verify(token, SECRET);
    console.log(token);
    return res.send({
      status: "ok",
      payload: {
        ...obj
      }
    });
  } catch (err) {
    return res.send({
      message: "bad token"
    });
  }

  return res.send({
    message: "ok",
    ...obj
  });
});
app.get("/post/:id_post", AuthMiddleware, (req, res) => {


  const id_post = req.params.id_post;
  axios({
    url: `https://jsonplaceholder.typicode.com/posts/${id_post}`,
    method: "get"
  }).then(response => {

    return res.send({
      status: "ok",
      payload: {
        message: "post body",
        user: req.userm,
        response: response.data
      }
    });
  });


});
app.get("/post/", AuthMiddleware, (req, res) => {
  axios({
    url: "https://jsonplaceholder.typicode.com/posts/",
    method: "get"
  }).then(response => {

    return res.send({
      status: "ok",
      payload: {
        message: "post body",
        user: req.userm,
        response: response.data
      }
    })
  })
})
app.listen(3000, () => {
  console.log("start 3000");
});