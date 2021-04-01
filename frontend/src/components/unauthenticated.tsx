import React from "react";
import { useMeQuery } from "../generated/graphql";

type OtherProps = { children: any };
type Props = OtherProps;

export const Unauthenticated: React.FC<Props> = ({ children }) => {
  const { loading, data } = useMeQuery();
  if (!loading && data && !data.me) {
    return children;
  }
  return <span />;
};
