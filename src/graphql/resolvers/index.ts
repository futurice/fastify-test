import merge from 'lodash.merge';
import feedResolvers from './feedResolver';
import guildResolvers from './guildResolver';
import actionResolvers from './actionResolver';
import actionTypeResolvers from './actionTypeResolver';
import scalarResolvers from './scalars';

const mergedResolvers = merge(
  {},
  feedResolvers,
  guildResolvers,
  actionResolvers,
  actionTypeResolvers,
  scalarResolvers,
);

export default mergedResolvers;
