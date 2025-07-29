import type {
  Operator,
  ComparisonOperator,
  ComparisonOperatorExpression
} from "kysely";

// 1) Map a single column’s value type to either a raw value or a Kysely operator object
type ComparisonOperators<Value> = {
  [Op in Operator]?: Value;
};

export type QueryObject<O> = {
  [K in keyof O]?: O[K] | ComparisonOperators<O[K]>;
} & {
  $and?: QueryObject<O>[];
  $or?: QueryObject<O>[];
};
