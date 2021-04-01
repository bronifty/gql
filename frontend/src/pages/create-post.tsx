import { Field, Form, Formik } from "formik";
import React from "react";
import { Button, Segment } from "semantic-ui-react";
import { NegativeMessage } from "../components/negative-message";
import { GetPostsDocument, useCreatePostMutation } from "../generated/graphql";
import { history } from "../history";

interface FormFieldsType {
  title: string;
  description: string;
}

export const CreatePost: React.FC = () => {
  const [createPost, { error, loading }] = useCreatePostMutation({
    refetchQueries: [{ query: GetPostsDocument, variables: { limit: 3 } }],
  });

  const INITIAL_VALUES: FormFieldsType = {
    title: "",
    description: "",
  };

  const onSubmit = async (values: FormFieldsType) => {
    try {
      const { data } = await createPost({
        variables: { data: values },
      });
      history.push(`/post/${data?.createPost.id}`);
    } catch (e) {}
  };

  return (
    <Segment>
      <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
        <Form className="ui form">
          <h1>create post</h1>
          <NegativeMessage errors={error} />
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
          <Button
            disabled={loading}
            loading={loading}
            type="submit"
            color="black"
            content="create post"
          />
        </Form>
      </Formik>
    </Segment>
  );
};
