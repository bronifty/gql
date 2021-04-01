import React from "react";
import { Link } from "react-router-dom";
import { Button, Segment } from "semantic-ui-react";
import {
  GetPostDocument,
  useMeQuery,
  useVoteMutation,
} from "../generated/graphql";

type OtherProps = {
  postId: number;
  voteStatus: number | null | undefined;
  creatorEmail: string;
};
type Props = OtherProps;

export const Actions: React.FC<Props> = ({
  postId,
  voteStatus,
  creatorEmail,
}) => {
  const { data: user } = useMeQuery();
  const [vote, { loading }] = useVoteMutation({
    refetchQueries: [{ query: GetPostDocument, variables: { id: postId } }],
  });

  if (!user || !user.me) return null;
  if (loading) return <Segment content="processing" />;

  const onClick = (voteStatus: number) => async () => {
    await vote({
      variables: { data: { voteStatus, postId: postId } },
    });
  };

  const upvoteButton = () => {
    if (voteStatus === 1)
      return <Button onClick={onClick(0)} color="black" content="upvoted" />;
    else return <Button onClick={onClick(1)} content="upvote" />;
  };

  const downvoteButton = () => {
    if (voteStatus === -1)
      return <Button onClick={onClick(0)} color="black" content="downvoted" />;
    else return <Button onClick={onClick(-1)} content="downvote" />;
  };

  return (
    <>
      <Segment>
        {upvoteButton()}
        <span> </span>
        {downvoteButton()}
      </Segment>
      {creatorEmail === user.me.email && (
        <Segment>
          <Link to={`/edit-post/${postId}`} className="ui black big button">
            Edit
          </Link>
        </Segment>
      )}
    </>
  );
};
