import { Field, Form, Formik } from "formik";
import React from "react";
import { Button, Segment } from "semantic-ui-react";
import {
  MeDocument,
  MeQuery,
  MeQueryVariables,
  useLoginMutation,
} from "../generated/graphql";
import { history } from "../history";
import { NegativeMessage } from "./negative-message";

interface FormFieldsType {
  loginEmail: string;
  loginPassword: string;
}

const INITIAL_VALUES: FormFieldsType = {
  loginEmail: "",
  loginPassword: "",
};

export const Login: React.FC = () => {
  const [login, { error, loading, client }] = useLoginMutation();

  const onSubmit = async (values: FormFieldsType) => {
    try {
      await login({
        variables: {
          data: {
            email: values.loginEmail,
            password: values.loginPassword,
          },
        },
        update: (cache, { data }) => {
          client.resetStore();
          cache.writeQuery<MeQuery, MeQueryVariables>({
            query: MeDocument,
            data: { me: data!.login },
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
          <h1>login</h1>
          <NegativeMessage errors={error} />
          <div className="field">
            <label htmlFor="loginEmail">email</label>
            <Field type="text" id="loginEmail" name="loginEmail" />
          </div>
          <div className="field">
            <label htmlFor="loginPassword">password</label>
            <Field type="password" id="loginPassword" name="loginPassword" />
          </div>
          <Button
            disabled={loading}
            loading={loading}
            type="submit"
            color="black"
            content="login"
          />
        </Form>
      </Formik>
    </Segment>
  );
};
