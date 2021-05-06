import { GraphQLNonNull, GraphQLList, GraphQLFieldConfig } from 'graphql';
import actionType from '../models/actionType';

const actionTypeQuery: GraphQLFieldConfig<{}, unknown, any> = {
  type: new GraphQLNonNull(new GraphQLList(actionType)),
};

export default actionTypeQuery;
