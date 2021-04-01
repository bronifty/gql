import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import { NegativeMessage } from "../components/negative-message";
import { PositiveMessage } from "../components/positive-message";
import { useChangePasswordMutation } from "../generated/graphql";

type Props = RouteComponentProps<{ token: string }>;

export const ResetPassword: React.FC<Props> = ({ match }) => {
  const [password, setPassword] = useState("");
  const [
    changePasswordMutation,
    { loading, error, data },
  ] = useChangePasswordMutation();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setPassword(e.target.value);
  const onSubmit: React.FormEventHandler = async (e) => {
    try {
      e.preventDefault();
      const { token } = match.params;
      await changePasswordMutation({ variables: { password, token } });
    } catch (e) {}
  };

  return (
    <Segment clearing>
      <Form onSubmit={onSubmit}>
        <h1>reset password</h1>
        <NegativeMessage errors={error} />
        {data && <PositiveMessage message={data.changePassword} />}
        <Form.Input
          label="new password"
          onChange={onChange}
          value={password}
          type="password"
        />
        <Button
          disabled={loading}
          loading={loading}
          type="submit"
          floated="right"
          color="black"
          content="reset password"
        />
      </Form>
    </Segment>
  );
};
