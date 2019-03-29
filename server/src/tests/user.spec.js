/* eslint-disable no-undef */
import { expect } from 'chai';
import * as userApi from './api';

describe('users', () => {
  describe('user(id: ID!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'AJCuffe',
            email: 'adamcuffe27@icloud.com',
            role: 'ADMIN',
          },
        },
      };

      const result = await userApi.user({ id: '1' });
      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await userApi.user({ id: '42' });

      expect(result.data).to.eql(expectedResult);
    });
  });
});

describe('deleteUser(id: ID!): Boolean!', () => {
  it('returns an error because only admins can delete a user', async () => {
    const {
      data: {
        data: {
          signIn: { token },
        },
      },
    } = await userApi.signIn({
      login: 'ddavids',
      password: 'ddavids',
    });

    const {
      data: { errors },
    } = await userApi.deleteUser({ id: '1' }, token);

    expect(errors[0].message).to.eql('Not authorised as admin.');
  });
});
