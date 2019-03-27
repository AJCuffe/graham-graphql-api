import {ForbiddenError} from 'apollo-server'
import {skip} from 'graphql-resolvers'

// Validation function to check if user is authenticated
export const isAuthenticated = (parent, args, {me}) => (me ? skip : new ForbiddenError('Not authenticated as user.'))

// Validation function to check if current user is the message owner
export const isMessageOwner = async (parent, {id}, {models, me}) => {
  const message = await models.Message.find({id}, {raw: true})
  if (message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.')
  }
  return skip
}
// Validation function to check if current user has administrative priveleges
export const isAdmin = (parent, args, {me: {role}}) =>
  role === 'ADMIN' ? skip : new ForbiddenError('Not authorised as admin.')
