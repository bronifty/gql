import DataLoader from "dataloader";
import { User } from "../entities/user";

export const createPostCreatorLoader = (): DataLoader<number, User> => {
  return new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userMap: { [key: number]: User } = {};
    users.forEach((user) => (userMap[user.id] = user));
    const sortedUsers = userIds.map((userId) => userMap[userId]);
    return sortedUsers;
  });
};
