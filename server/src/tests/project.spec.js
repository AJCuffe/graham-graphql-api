/* eslint-disable no-undef */
import { expect } from 'chai';
import * as projectApi from './api';

describe('projects', () => {
  describe('projectById(id: ID!): Project', () => {
    it('returns a project when project can be found', async () => {
      const expectedResult = {
        data: {
          projectById: {
            pin: 563595,
            name: 'Package E',
            active: true,
          },
        },
      };

      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await projectApi.signIn({
        login: 'AJCuffe',
        password: 'adamcuffe',
      });

      const result = await projectApi.projectById({ id: '1' }, token);
      expect(result.data).to.eql(expectedResult);
    });
  });
});
