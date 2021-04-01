import { Field, Form, Formik } from "formik";
import produce from "immer";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button, Loader, Segment } from "semantic-ui-react";
import { NegativeMessage } from "../components/negative-message";
import {
  GetPostsDocument,
  GetPostsQuery,
  GetPostsQueryVariables,
  useDeletePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
} from "../generated/graphql";
import { history } from "../history";

type Props = RouteComponentProps<{ postId: string }>;

interface FormFieldsType {
  title: string;
  description: string;
}

export const EditPost: React.FC<Props> = ({ match }) => {
  const { postId } = match.params;
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useGetPostQuery({
    variables: { id: parseInt(postId) },
  });

  const [
    updatePost,
    { error: updatePostError, loading: updatePostLoading },
  ] = useUpdatePostMutation();
  const [
    deletePost,
    { error: deletePostError, loading: deletePostLoading },
  ] = useDeletePostMutation();

  const loading = postLoading || deletePostLoading || updatePostLoading;
  if (loading) return <Loader active content="processing" />;

  const INITIAL_VALUES: FormFieldsType = {
    title: postData?.post.post.title || "",
    description: postData?.post.post.description || "",
  };

  const onSubmit = async (values: FormFieldsType) => {
    try {
      const { data } = await updatePost({
        variables: { data: values, id: parseInt(postId) },
      });
      history.push(`/post/${data?.updatePost.id}`);
    } catch (e) {}
  };

  const onClick = async () => {
    try {
      await deletePost({
        variables: { id: parseInt(postId) },
        update: (cache, { data }) => {
          const posts = cache.readQuery<GetPostsQuery, GetPostsQueryVariables>({
            query: GetPostsDocument,
            variables: { limit: 3 },
          });

          if (!posts) return;

          cache.writeQuery<GetPostsQuery, GetPostsQueryVariables>({
            query: GetPostsDocument,
            variables: { limit: 3 },
            data: produce(posts, (paginatedPosts) => {
              paginatedPosts.posts.posts = paginatedPosts.posts.posts.filter(
                ({ id }) => id !== data?.deletePost.id
              );
            }),
          });
        },
      });
      history.push("/posts");
    } catch (e) {}
  };

  return (
    <Segment>
      <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
        <Form className="ui form">
          <h1>edit post</h1>
          <NegativeMessage errors={updatePostError} />
          <NegativeMessage errors={deletePostError} />
          <NegativeMessage errors={postError} />
          <label htmlFor="title">title</label>
          <div className="field">
            <Field type="text" id="title" name="title" />
          </div>
          <div className="field">
            <label htmlFor="description">description</label>
            <Field
              as="textarea"
              rows={3}
              style={{ resize: "none" }}
              id="description"
              name="description"
            />
          </div>
          <Button type="submit" color="black" content="update post" />
          <Button
            onClick={onClick}
            type="button"
            color="black"
            content="delete post"
          />
        </Form>
      </Formik>
    </Segment>
  );
};
