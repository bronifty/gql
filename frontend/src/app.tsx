import React from "react";
import { Route, Router } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { Authenticated } from "./components/authenticated";
import { Navbar } from "./components/navbar";
import { Unauthenticated } from "./components/unauthenticated";
import { history } from "./history";
import { Auth } from "./pages/auth";
import { CreatePost } from "./pages/create-post";
import { EditPost } from "./pages/edit-post";
import { Home } from "./pages/home";
import { Me } from "./pages/me";
import { Post } from "./pages/post";
import { Posts } from "./pages/posts";
import { ResetPassword } from "./pages/reset-password";

export const App: React.FC = () => {
  return (
    <Router history={history}>
      <Container style={{ padding: "50px 0 100px 0" }}>
        <Navbar />
        <Route exact path="/" component={Home} />
        <Route exact path="/posts" component={Posts} />
        <Route exact path="/post/:postId" component={Post} />
        <Unauthenticated>
          <Route exact path="/enter" component={Auth} />
          <Route exact path="/resetpassword/:token" component={ResetPassword} />
        </Unauthenticated>
        <Authenticated>
          <Route exact path="/me" component={Me} />
          <Route exact path="/create-post" component={CreatePost} />
          <Route exact path="/edit-post/:postId" component={EditPost} />
        </Authenticated>
      </Container>
    </Router>
  );
};
