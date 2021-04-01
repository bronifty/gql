import validator from "validator";
import { PostInput } from "../resolvers/post";
import { UserInput } from "../resolvers/user";

export const validateUser = (data: UserInput) => {
  if (!validator.isEmail(data.email)) throw new Error("invalid email format");
  if (data.password.length < 5)
    throw new Error("password should be atleast 5 characters long");
};

export const validatePost = (data: PostInput) => {
  if (data.title.length < 5)
    throw new Error("title should be atleast 5 characters long");
  if (data.description.length < 5)
    throw new Error("description should be atleast 5 characters long");
  if (data.title.length > 50)
    throw new Error("title cannot be longer than 50 characters");
  if (data.description.length > 500)
    throw new Error("description cannot be longer than 500 characters");
};
