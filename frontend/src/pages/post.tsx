import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Header, Loader, Segment } from "semantic-ui-react";
import { useGetPostQuery } from "../generated/graphql";
import { formatDate } from "../utils/formatDate";
import { NegativeMessage } from "../components/negative-message";
import { Actions } from "../components/actions";

type RowProps = {
  first: string | undefined;
  second: string | number | undefined;
  inline?: boolean;
};

const Row: React.FC<RowProps> = ({ first, second, inline }) => {
  if (inline) {
    return (
      <Segment>
        <Header>
          {first}
          <small style={{ marginLeft: "10px", fontWeight: "normal" }}>
            {second}
          </small>
        </Header>
      </Segment>
    );
  }

  return (
    <Segment>
      <Header content={first} />
      <p style={{ wordWrap: "break-word" }}>{second}</p>
    </Segment>
  );
};

type OtherProps = {};
type Props = OtherProps & RouteComponentProps<{ postId: string }>;

export const Post: React.FC<Props> = ({ match }) => {
  const { postId } = match.params;
  const { data, error } = useGetPostQuery({
    variables: { id: parseInt(postId) },
  });

  if (error) return <NegativeMessage errors={error} />;
  if (!data) return <Loader content="fetching post" active />;

  const { post, voteStatus } = data.post;

  return (
    <Segment.Group>
      <Row first="title" second={post.title} />
      <Row first="description" second={post.description} />
      <Row inline first="upvotes" second={post.upvotes} />
      <Row inline first="downvotes" second={post.downvotes} />
      <Row inline first="created at" second={formatDate(post.createdAt)} />
      <Row inline first="created by" second={post.creator.email} />
      <Actions
        postId={post.id}
        voteStatus={voteStatus}
        creatorEmail={post.creator.email}
      />
    </Segment.Group>
  );
};
