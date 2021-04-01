import React from "react";
import { Button, Segment, Table } from "semantic-ui-react";
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";
import { history } from "../history";
import { formatDate } from "../utils/formatDate";

type RowProps = {
  first: string | undefined;
  second: string | number | undefined;
};

const Row: React.FC<RowProps> = ({ first, second }) => {
  return (
    <Table.Row>
      <Table.Cell content={first} />
      <Table.Cell content={second} />
    </Table.Row>
  );
};

export const Me: React.FC = () => {
  const { data } = useMeQuery();
  const [logout, { loading, client }] = useLogoutMutation();

  const onClick = async () => {
    try {
      await logout({
        update: (cache, { data }) => {
          client.resetStore();
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null },
          });
        },
      });
      history.push("/");
    } catch (e) {}
  };

  return (
    <Segment>
      <Table>
        <Table.Body>
          <Row first="email" second={data?.me?.email} />
          <Row first="created at" second={formatDate(data?.me?.createdAt)} />
          <Row first="posts written" second={data?.me?.posts} />
          <Row first="upvotes received" second={data?.me?.upvotes} />
          <Row first="downvotes received" second={data?.me?.downvotes} />
        </Table.Body>
      </Table>
      <Button
        disabled={loading}
        loading={loading}
        content="logout"
        color="black"
        onClick={onClick}
      />
    </Segment>
  );
};
