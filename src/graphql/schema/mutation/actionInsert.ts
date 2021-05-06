import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { GraphQLVoid } from 'graphql-scalars';
import { ActionTypes } from '../models/enums';

const input = new GraphQLInputObjectType({
  name: 'actionInsertInput',
  fields: {
    actionType: {
      type: new GraphQLNonNull(ActionTypes),
    },
    text: {
      type: GraphQLString,
    },
  },
});

const actionInsert: GraphQLFieldConfig<{}, unknown, any> = {
  type: GraphQLVoid,
  args: {
    input: {
      type: new GraphQLNonNull(input),
    },
  },
};

export default actionInsert;
