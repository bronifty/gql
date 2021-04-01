import React from "react";
import { Message } from "semantic-ui-react";
import { ApolloError } from "@apollo/client";

type OtherProps = { errors: ApolloError | undefined };

type Props = OtherProps;

export const NegativeMessage: React.FC<Props> = ({ errors }) => {
  if (!errors || !errors.graphQLErrors || !errors.graphQLErrors.length) {
    return null;
  }
  const { message } = errors.graphQLErrors[0];
  return (
    <Message negative>
      <Message.Header content={message} />
    </Message>
  );
};
