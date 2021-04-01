import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const link = createHttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
