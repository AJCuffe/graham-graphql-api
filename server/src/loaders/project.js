/* eslint-disable import/prefer-default-export */
export const batchProjects = async (keys, models) => {
  const projects = await models.Project.findAll({
    where: {
      schemeId: keys,
    },
  });

  const mapped = keys.map(key =>
    projects.find(project => project.schemeId === key),
  );

  return mapped;
};
