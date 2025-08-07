import type { Operator } from "kysely";

/**
 * Maps a kysely operator to a raw value.
 *
 * syntax - { <operator> : <value> }
 * example -  { "=" : "user@email.com" }
 */
export type OperatorCondition<Value> = {
  [Op in Operator]?: Value;
};

/**
 * Maps a key of type O to either a raw value for
 * equality operations or to an 'OperatorCondition'.
 *
 * syntax - { <column1>: <value>, <column2>: { <operator> : <value> } }
 * example - { country: "US", age: { ">=": 30 } }
 */
export type QueryExpression<O> = {
  [K in keyof O]?: O[K] | OperatorCondition<O[K]>;
};

/**
 * QueryObject<O> is a 'QueryField' with additional
 * properties for specifying the logical operation used.
 * It works similar to mongodb query language but for kysely/sql.
 *
 * https://www.mongodb.com/docs/manual/reference/operator/query/and/#mongodb-query-op.-and
 * https://www.mongodb.com/docs/manual/reference/operator/query/or/#mongodb-query-op.-or
 *
 * syntax - { $or: [ <QueryExpression1>, <QueryExpression2> ], $and: [ <QueryExpression1>, <QueryExpression2> ] }
 * example for a "Places" table - { $or: { location} }
 *
 */
export type QueryObject<O> = QueryExpression<O> & {
  $and?: QueryExpression<O>[];
  $or?: QueryExpression<O>[];
};

export type QueryOptions = {
  omitSensitive: boolean;
};
