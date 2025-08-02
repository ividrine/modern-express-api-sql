import type { Operator } from "kysely";

// Map a single column’s value type to either a raw value or a Kysely operator object
type FilterOperation<Value> = {
  [Op in Operator]?: Value;
};

export type QueryField<O> = {
  [K in keyof O]?: O[K] | FilterOperation<O[K]>;
};

export type QueryObject<O> = QueryField<O> & {
  $and?: QueryField<O>[];
  $or?: QueryField<O>[];
};

export type QueryOptions = {
  omitSensitive: boolean;
};
