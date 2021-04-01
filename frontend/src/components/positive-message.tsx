import React from "react";
import { Message } from "semantic-ui-react";

type OtherProps = { message: string };

type Props = OtherProps;

export const PositiveMessage: React.FC<Props> = ({ message }) => {
  return (
    <Message color="green">
      <Message.Header content={message} />
    </Message>
  );
};
