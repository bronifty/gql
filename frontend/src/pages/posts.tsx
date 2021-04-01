import React from "react";
import { Waypoint } from "react-waypoint";
import { Loader } from "semantic-ui-react";
import { PostComponent } from "../components/post-component";
import { GetPostsQuery, useGetPostsQuery } from "../generated/graphql";

export const Posts: React.FC = () => {
  const { data, fetchMore, networkStatus } = useGetPostsQuery({
    variables: { limit: 3 },
    notifyOnNetworkStatusChange: true,
  });

  const onEnter = async () => {
    try {
      const { posts } = data?.posts || { posts: [] };
      const offset = posts[posts.length - 1].id;
      await fetchMore({
        variables: { limit: 3, offset },
        updateQuery: (previousPosts, { fetchMoreResult }): GetPostsQuery => {
          if (!fetchMoreResult) return previousPosts;
          return {
            __typename: "Query",
            posts: {
              posts: [
                ...previousPosts.posts.posts,
                ...fetchMoreResult.posts.posts,
              ],
              hasMore: fetchMoreResult.posts.hasMore,
            },
          };
        },
      });
    } catch (e) {}
  };

  if (networkStatus === 1)
    return (
      <Loader
        size="massive"
        active
        inline="centered"
        content="fetching posts"
      />
    );

  return (
    <div>
      {data?.posts.posts.map((post) => (
        <PostComponent post={post} key={post.id} />
      ))}
      {networkStatus !== 3 && data?.posts.hasMore && (
        <Waypoint onEnter={onEnter} />
      )}
      {networkStatus === 3 && (
        <Loader active inline="centered" content="fetching more posts" />
      )}
    </div>
  );
};
