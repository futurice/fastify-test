import { GraphQLEnumType } from 'graphql';

export const Sort = new GraphQLEnumType({
  name: 'Sort',
  description: 'Feed sorting method',
  values: {
    NEWEST: { value: 0 },
    HOT: { value: 1 },
    BEST: { value: 2 },
  },
});

export const ActionTypes = new GraphQLEnumType({
  name: 'ActionTypes',
  values: {
    SIMA: { value: 0 },
    IMAGE: { value: 1 },
    TEXT: { value: 2 },
  },
});
