import { GraphQLObjectType } from 'graphql';
import feedQuery from './feedQuery';
import guildQuery from './guildQuery';
import actionTypeQuery from './actionTypeQuery';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    feed: feedQuery,
    guild: guildQuery,
    actionType: actionTypeQuery,
  },
});
