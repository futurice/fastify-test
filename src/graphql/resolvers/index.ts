import merge from 'lodash.merge';
import feedResolvers from './feedResolver';
import scalarResolvers from './scalars';

const mergedResolvers = merge({}, feedResolvers, scalarResolvers);

export default mergedResolvers;
