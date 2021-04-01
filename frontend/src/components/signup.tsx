import { Field, Form, Formik } from "formik";
import React from "react";
import { Button, Segment } from "semantic-ui-react";
import { useSignupMutation } from "../generated/graphql";
import { NegativeMessage } from "./negative-message";
import { PositiveMessage } from "./positive-message";

interface FormFieldsType {
  signupEmail: string;
  signupPassword: string;
}

const INITIAL_VALUES: FormFieldsType = {
  signupEmail: "",
  signupPassword: "",
};

export const Signup: React.FC = () => {
  const [signup, { loading, error, data }] = useSignupMutation();

  const onSubmit = async (values: FormFieldsType) => {
    try {
      await signup({
        variables: {
          data: {
            email: values.signupEmail,
            password: values.signupPassword,
          },
        },
      });
    } catch (e) {}
  };

  return (
    <Segment>
      <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
        <Form className="ui form">
          <h1>signup</h1>
          {data && <PositiveMessage message={data.signup} />}
          <NegativeMessage errors={error} />
          <div className="field">
            <label htmlFor="signupEmail">email</label>
            <Field type="text" id="signupEmail" name="signupEmail" />
          </div>
          <div className="field">
            <label htmlFor="signupPassword">password</label>
            <Field type="password" id="signupPassword" name="signupPassword" />
          </div>
          <Button
            disabled={loading}
            loading={loading}
            type="submit"
            color="black"
            content="signup"
          />
        </Form>
      </Formik>
    </Segment>
  );
};
