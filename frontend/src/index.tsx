import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import { App } from "./app";
import { client } from "./client";

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
