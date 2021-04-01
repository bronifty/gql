import React from "react";
import { Link } from "react-router-dom";
import { Segment, Label } from "semantic-ui-react";
import { GetPostsQuery } from "../generated/graphql";
import { formatDate } from "../utils/formatDate";

type OtherProps = { post: GetPostsQuery["posts"]["posts"][0] };
type Props = OtherProps;

export const PostComponent: React.FC<Props> = ({ post }) => {
  return (
    <Segment.Group style={{ marginBottom: "50px" }}>
      <Segment secondary content={formatDate(post.createdAt)} />
      <Segment>
        <h2>
          <Link className="ui black header" to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        <Label content={`${post.upvotes} upvotes`} />
        <Label content={`${post.downvotes} downvotes`} />
      </Segment>
      <Segment secondary>
        <i>{post.creator.email}</i>
      </Segment>
    </Segment.Group>
  );
};
