const express = require("express");
const bodyParser = require("body-parser");
const graphlHttp = require("express-graphql");
const mongoose = require("mongoose");

const app = express();

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

app.get("/", (req, res, next) => {
  res.send("hello");
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-xzyc5.gcp.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
