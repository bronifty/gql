import React from "react";
import { Grid, Segment } from "semantic-ui-react";

export const Home: React.FC = () => {
  return (
    <Grid textAlign="center">
      <Grid.Row>
        <Segment padded compact>
          <h1 style={{ fontSize: "50px" }}>G Q L</h1>
        </Segment>
      </Grid.Row>
    </Grid>
  );
};
