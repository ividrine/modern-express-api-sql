import {
  ReferenceExpression,
  WhereInterface,
  SelectQueryBuilder,
  DeleteQueryBuilder,
  UpdateQueryBuilder,
  ComparisonOperatorExpression,
  OperandExpression,
  SqlBool,
  ExpressionBuilder
} from "kysely";

import { QueryField, QueryObject } from "../types/queries";

const isOp = (value: unknown): boolean => {
  return (
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
};

const buildExpression = <DB, TB extends keyof DB, O>(
  arr: QueryField<O>[],
  eb: ExpressionBuilder<DB, TB>
) => {
  return arr.reduce(
    (acc, exp) => [
      ...acc,
      ...Object.keys(exp).reduce((acc1, key) => {
        const value = exp[key as keyof O];
        if (value === "undefined") return acc1;

        if (!isOp(value)) {
          return [
            ...acc1,
            ...[eb(key as ReferenceExpression<DB, TB>, "=", value)]
          ];
        } else {
          return [
            ...acc1,
            ...Object.entries(value as QueryField<O>).reduce(
              (acc2, [op, v]) => {
                return [
                  ...acc2,
                  ...[
                    eb(
                      key as ReferenceExpression<DB, TB>,
                      op as ComparisonOperatorExpression,
                      v
                    )
                  ]
                ];
              },
              acc1
            )
          ];
        }
      }, acc)
    ],
    [] as OperandExpression<SqlBool>[]
  );
};

// Overload for select builders
function filter<DB, TB extends keyof DB, O>(
  qb: WhereInterface<DB, TB>,
  query: QueryObject<O>
): SelectQueryBuilder<DB, TB, O>;

// Overload for update builders
function filter<DB, UT extends keyof DB, TB extends keyof DB, O>(
  qb: WhereInterface<DB, TB>,
  query: QueryObject<O>
): UpdateQueryBuilder<DB, UT, TB, O>;

// Overload for delete builders
function filter<DB, TB extends keyof DB, O, DR>(
  qb: WhereInterface<DB, TB>,
  query: QueryObject<O>
): DeleteQueryBuilder<DB, TB, DR>;

function filter<DB, TB extends keyof DB, O>(
  qb: WhereInterface<DB, TB>,
  query: QueryObject<O> = {}
) {
  const $or = query?.$or as QueryField<O>[];
  const $and = query?.$and as QueryField<O>[];

  qb = Object.keys(query).reduce((acc, key) => {
    const value = query[key as keyof O];
    if (key == "$and" || key == "$or" || value === "undefined") return acc;
    if (!isOp(value)) {
      return acc.where(key as ReferenceExpression<DB, TB>, "=", value);
    } else {
      return Object.entries(value as QueryField<O>).reduce(
        (_acc, [op, v]) =>
          _acc.where(
            key as ReferenceExpression<DB, TB>,
            op as ComparisonOperatorExpression,
            v
          ),
        acc
      );
    }
  }, qb);

  if ($or?.length) {
    qb = qb.where((eb) => eb.or(buildExpression($or, eb)));
  }

  if ($and?.length) {
    qb = qb.where((eb) => eb.and(buildExpression($and, eb)));
  }

  return qb;
}

export default filter;
