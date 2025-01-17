import type { Parser, ParserResult, Parsers } from '@brandingbrand/standard-parser';
import { parseFail, parseOk } from '@brandingbrand/standard-parser';
import { isFailure, isOk } from '@brandingbrand/standard-result';

/**
 * Given any number of parsers as params, iterates through them
 * sequentially until either all parsers have run successfully or
 * any parser fails. The `cursorEnd` value of the previous parser
 * is used as the `cursor` value for the subsequent parser.
 *
 * @param parsers - Any parser functions
 * @return A CombinatorResult
 */
export const many =
  <T = unknown>(...parsers: Parsers<T>): Parser<T[]> =>
  (args) => {
    const initialValue = (() => {
      if ('value' in args) {
        return Array.isArray(args.value) ? (args.value as T[]) : ([args.value] as T[]);
      }

      return [];
    })();

    const initialResult = parseOk({
      ...args,
      value: initialValue,
      cursorEnd: args.cursor ?? 0,
    });

    // eslint-disable-next-line unicorn/no-array-reduce -- Isolated Usage
    return parsers.reduce<ParserResult<T[]>>((aggregate, parser) => {
      if (isFailure(aggregate)) {
        return aggregate;
      }

      const parserResult: ParserResult<T> = parser({
        ...aggregate.ok,
        cursor: aggregate.ok.cursorEnd,
      });

      if (isOk(parserResult)) {
        return parseOk({
          cursor: args.cursor,
          cursorEnd: parserResult.ok.cursorEnd,
          input: aggregate.ok.input,
          value: [...aggregate.ok.value, parserResult.ok.value],
        });
      }

      return parseFail({
        input: args.input,
        cursor: args.cursor,
        fatal: parserResult.failure.fatal,
      });
    }, initialResult);
  };
