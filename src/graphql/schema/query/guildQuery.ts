import { GraphQLNonNull, GraphQLList, GraphQLFieldConfig } from 'graphql';
import guild from '../models/guild';

const guildQuery: GraphQLFieldConfig<{}, unknown, any> = {
  type: new GraphQLNonNull(new GraphQLList(guild)),
};

export default guildQuery;
