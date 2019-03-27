/* eslint-disable import/prefer-default-export */
// Batching with DataLoader to reduce number of requests to GraphQL API for DB queries
// Return all users where the user ID is included within the keys variable
export const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: keys,
    },
  });

  return keys.map(key => users.find(user => user.id === key));
};
