import React from "react";
import { Grid } from "semantic-ui-react";
import { ForgotPassword } from "../components/forgot-password";
import { Login } from "../components/login";
import { Signup } from "../components/signup";

export const Auth: React.FC = () => {
  return (
    <div>
      <Grid.Row>
        <Grid stackable columns={2}>
          <Grid.Column>
            <Signup />
          </Grid.Column>
          <Grid.Column>
            <Login />
          </Grid.Column>
        </Grid>
      </Grid.Row>
      <br />
      <br />
      <Grid.Row>
        <Grid stackable columns={1}>
          <Grid.Column>
            <ForgotPassword />
          </Grid.Column>
        </Grid>
      </Grid.Row>
    </div>
  );
};
