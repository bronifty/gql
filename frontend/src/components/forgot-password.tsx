import React, { useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { NegativeMessage } from "../components/negative-message";
import { PositiveMessage } from "../components/positive-message";
import { useGetResetPasswordLinkMutation } from "../generated/graphql";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [
    getResetPasswordLink,
    { error, data, loading },
  ] = useGetResetPasswordLinkMutation();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setEmail(e.target.value);
  const onSubmit: React.FormEventHandler = async (e) => {
    try {
      e.preventDefault();
      await getResetPasswordLink({ variables: { email } });
    } catch (e) {}
  };

  return (
    <Segment>
      <Form onSubmit={onSubmit}>
        <h1>forgot password</h1>
        <NegativeMessage errors={error} />
        {data && <PositiveMessage message={data.getResetPasswordLink} />}
        <Form.Input
          label="email"
          onChange={onChange}
          value={email}
          type="text"
          id="fp-email"
        />
        <Button
          disabled={loading}
          loading={loading}
          type="submit"
          color="black"
          content="forgot password"
        />
      </Form>
    </Segment>
  );
};
