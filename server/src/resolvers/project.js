import { combineResolvers } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';
import upperCaseFirst from 'upper-case-first';
import { isAuthenticated, isAdmin } from './authorization';

// ====== CREATE =====

// Create a new project

// ======= READ =======

// Return list of all projects
// Return list of all Projects by Scheme ID
// Return list of all Projects by Scheme Code (QK17, QL17 etc.)
// Return list containing a single project by its ID
// Return list containing a single project by its Pin Number
// Return list of all active projects
// Return list of all inactive projects
// Return list of all active projects by their Scheme ID
// Return list of all active projects by their Scheme code
// Return list of all inactive projects by their Scheme ID
// Return list of all inactive projects by their Scheme code
// Return list of all projects created by a certain user ID

// ====== UPDATE ======

// Update a project by its ID
// Update a project by its Pin number
// Set a project to inactive
// Set a project to active

// ====== DELETE ======

// Delete a project by its ID
// Delete a project by its Pin number

// ***********************************************************
// **       HELPER FUNCTION FOR UPDATE AND DELETE
// ***********************************************************

async function checkProjectAndSchemeExist(whereCriteria, { models }, args) {
  const project = await models.Project.findOne({
    where: whereCriteria,
  });

  if (!project) {
    throw new UserInputError(
      `No such project with the ${upperCaseFirst(
        Object.keys(whereCriteria)[0],
      )} specified.`,
    );
  }

  if (args.code) {
    const scheme = await models.Scheme.findOne({
      where: { code: args.code },
    });

    if (!scheme) {
      throw new UserInputError('No such scheme with ID specified.');
    }
  }

  return true;
}

// ***********************************************************
// **         DELETE PROJECT BY BOTH PIN AND ID
// ***********************************************************

async function deleteProject(criteriaObject, { models }) {
  const whereCriteria = {};

  if (Object.prototype.hasOwnProperty.call(criteriaObject, 'pin')) {
    whereCriteria.pin = criteriaObject.pin;
  } else {
    whereCriteria.id = criteriaObject.id;
  }

  if (await checkProjectAndSchemeExist(whereCriteria, { models })) {
    return await models.Project.destroy({ where: whereCriteria });
  }
  return false;
}

// ***********************************************************
// **         UPDATE PROJECT BY BOTH PIN AND ID
// ***********************************************************

async function updateProject(criteriaObject, { models }, args) {
  const whereCriteria = {};

  if (Object.prototype.hasOwnProperty.call(criteriaObject, 'pin')) {
    whereCriteria.pin = criteriaObject.pin;
  } else {
    whereCriteria.id = criteriaObject.id;
  }

  const project = await models.Project.findOne({
    where: whereCriteria,
  });

  if (!project) {
    throw new UserInputError(
      `No such project with the ${upperCaseFirst(
        Object.keys(whereCriteria)[0],
      )} specified.`,
    );
  }

  if (args.code) {
    const scheme = await models.Scheme.findOne({
      where: { code: args.code },
    });

    if (!scheme) {
      throw new UserInputError('No such scheme with ID specified.');
    }
  }

  const affectedRows = await models.Project.update(args, {
    where: whereCriteria,
    returning: true,
    plain: true,
  });

  return affectedRows[1];
}

// ***********************************************************
// **    TOGGLE PROJECT ACTIVE STATUS BY BOTH PIN AND ID
// ***********************************************************

async function toggleProjectActiveStatus(
  criteriaObject,
  { models },
  activeStatus,
) {
  const whereCriteria = {};

  if (Object.prototype.hasOwnProperty.call(criteriaObject, 'pin')) {
    whereCriteria.pin = criteriaObject.pin;
  } else {
    whereCriteria.id = criteriaObject.id;
  }

  const project = await models.Project.findOne({
    where: whereCriteria,
  });

  // Check to see if Project with given ID exists.
  if (!project) {
    throw new UserInputError(
      `No such project with ${upperCaseFirst(
        Object.keys(whereCriteria)[0],
      )} specified.`,
    );
  }

  // Check current active status of project
  if (project.active === activeStatus.active) {
    let activeInactive = '';

    switch (activeStatus.active) {
      case true:
        activeInactive = 'active';
        break;
      case false:
        activeInactive = 'inactive';
        break;
      default:
    }

    throw new UserInputError(
      `Project with specified ${upperCaseFirst(
        Object.keys(whereCriteria)[0],
      )} is already ${activeInactive}.`,
    );
  }

  const updated = await models.Project.update(
    { active: activeStatus.active },
    { where: whereCriteria },
  );

  if (!updated) {
    return false;
  }

  return true;
}

export default {
  Query: {
    projects: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => await models.Project.findAll(),
    ),
    projectsBySchemeId: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        const projects = await models.Project.findAll({
          where: { schemeId: id },
        });
        if (!projects) {
          throw new UserInputError(
            'There are no projects allocated to the Scheme ID specified.',
          );
        } else {
          return projects;
        }
      },
    ),
    projectsBySchemeCode: combineResolvers(
      isAuthenticated,
      async (parent, { code }, { models }) => {
        const scheme = await models.Scheme.findOne({ where: { code } });
        if (!scheme) {
          throw new UserInputError(
            'There is no such scheme with the code provided.',
          );
        } else {
          return await models.Project.findAll({
            where: { schemeId: scheme.id },
          });
        }
      },
    ),
    projectById: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        const project = await models.Project.findOne({ where: { id } });
        if (!project) {
          throw new UserInputError(
            'There is no such project with the ID specified.',
          );
        } else {
          return project;
        }
      },
    ),
    projectByPin: combineResolvers(
      isAuthenticated,
      async (parent, { pin }, { models }) => {
        const project = await models.Project.findOne({ where: { pin } });
        if (!project) {
          throw new UserInputError(
            'There is no such project with the Pin specified.',
          );
        } else {
          return project;
        }
      },
    ),
    activeProjects: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) =>
        await models.Project.findAll({ where: { active: true } }),
    ),
    inactiveProjects: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) =>
        await models.Project.findAll({ where: { active: false } }),
    ),
    activeProjectsBySchemeId: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        // Check to see if scheme with that ID exists
        const scheme = await models.Scheme.findOne({ where: { id } });
        if (!scheme) {
          throw new UserInputError('Invalid Scheme ID entered.');
        } else {
          return await models.Project.findAll({
            where: {
              schemeId: id,
              active: true,
            },
          });
        }
      },
    ),
    activeProjectsBySchemeCode: combineResolvers(
      isAuthenticated,
      async (parent, { code }, { models }) => {
        // Check to see if scheme with that Code exists
        const scheme = await models.Scheme.findOne({ where: { code } });
        if (!scheme) {
          throw new UserInputError(
            'There is no such scheme with the code provided.',
          );
        } else {
          return await models.Project.findAll({
            where: { schemeId: scheme.id, active: true },
          });
        }
      },
    ),
    inactiveProjectsBySchemeId: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) => {
        // Check to see if a Scheme with the given ID exists
        const scheme = await models.Scheme.findOne({ where: { id } });
        if (!scheme) {
          throw new UserInputError(
            'There is no such scheme with the ID provided.',
          );
        } else {
          return await models.Project.findAll({
            where: {
              schemeId: id,
              active: false,
            },
          });
        }
      },
    ),
    inactiveProjectsBySchemeCode: combineResolvers(
      isAuthenticated,
      async (parent, { code }, { models }) => {
        const scheme = await models.Scheme.findOne({ where: { code } });
        if (!scheme) {
          throw new UserInputError(
            'There is no such scheme with the code provided.',
          );
        } else {
          return await models.Project.findAll({
            where: { schemeId: scheme.id, active: false },
          });
        }
      },
    ),
    projectsCreatedByUserID: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) => {
        // Check to see if the User ID is valid
        const user = await models.User.findOne({ where: { id } });
        if (!user) {
          throw new UserInputError('No such user with that ID.');
        } else {
          return await models.Project.findAll({
            where: {
              userId: id,
            },
          });
        }
      },
    ),
  },
  Mutation: {
    createProject: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { pin, name, schemeCode, active = true },
        { models, me },
      ) => {
        const schemePackage = await models.Scheme.findOne({
          where: { code: schemeCode },
        });

        if (!schemePackage) {
          throw new UserInputError('No scheme found with that scheme code.');
        } else {
          // Create the project
          const newProject = await models.Project.create({
            pin,
            name,
            active,
            userId: me.id,
            schemeId: schemePackage.id,
          });
          return newProject;
        }
      },
    ),
    updateProjectById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) => {
        return await updateProject({ id: args.id }, { models }, args);
      },
    ),
    updateProjectByPin: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models }) => {
        return await updateProject({ pin: args.pin }, { models }, args);
      },
    ),
    toggleActiveStatusById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id, active }, { models }) => {
        if (await toggleProjectActiveStatus({ id }, { models }, { active })) {
          return true;
        }
        return false;
      },
    ),
    toggleActiveStatusByPin: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { pin, active }, { models }) => {
        if (await toggleProjectActiveStatus({ pin }, { models }, { active })) {
          return true;
        }
        return false;
      },
    ),
    deleteProjectById: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) => {
        const deleted = await deleteProject({ id }, { models });
        if (!deleted) {
          return false;
        }
        return true;
      },
    ),
    deleteProjectByPin: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { pin }, { models }) => {
        const deleted = await deleteProject({ pin }, { models });
        if (!deleted) {
          return false;
        }
        return true;
      },
    ),
  },
  Project: {
    createdBy: async (project, args, { models }) => {
      return await models.User.findOne({
        where: {
          id: project.userId,
        },
      });
    },
  },
};
