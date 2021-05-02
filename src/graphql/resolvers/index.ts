import merge from 'lodash.merge';
import feedResolvers from './feedResolver';
import guildResolvers from './guildResolver';
import actionTypeResolvers from './actionTypeResolver';
import scalarResolvers from './scalars';

const mergedResolvers = merge(
  {},
  feedResolvers,
  guildResolvers,
  actionTypeResolvers,
  scalarResolvers,
);

export default mergedResolvers;
