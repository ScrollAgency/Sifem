
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Lesion
 * 
 */
export type Lesion = {
  id: number
  name_fr: string | null
  name_en: string | null
  category_fr: string | null
  category_en: string | null
  image_fr: string | null
  video_fr: string | null
  macro_category_fr: string | null
  multi_step: boolean | null
  next_step: string | null
  previous_step: string | null
  image_en: string | null
  video_en: string | null
  image_trauma: string | null
  face: string | null
  has_options: boolean
}

/**
 * Model Option
 * 
 */
export type Option = {
  id: number
  created_at: Date
  name_fr: string | null
  name_en: string | null
  lesion_id: number | null
  image_trauma: string | null
  face: string | null
}

/**
 * Model Submission
 * 
 */
export type Submission = {
  id: number
  created_at: Date
  updated_at: Date | null
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Lesions
 * const lesions = await prisma.lesion.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Lesions
   * const lesions = await prisma.lesion.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>;

  $transaction<R>(fn: (prisma: Prisma.TransactionClient) => Promise<R>, options?: {maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel}): Promise<R>;

      /**
   * `prisma.lesion`: Exposes CRUD operations for the **Lesion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lesions
    * const lesions = await prisma.lesion.findMany()
    * ```
    */
  get lesion(): Prisma.LesionDelegate<GlobalReject>;

  /**
   * `prisma.option`: Exposes CRUD operations for the **Option** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Options
    * const options = await prisma.option.findMany()
    * ```
    */
  get option(): Prisma.OptionDelegate<GlobalReject>;

  /**
   * `prisma.submission`: Exposes CRUD operations for the **Submission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Submissions
    * const submissions = await prisma.submission.findMany()
    * ```
    */
  get submission(): Prisma.SubmissionDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.8.1
   * Query Engine version: d6e67a83f971b175a593ccc12e15c4a757f93ffe
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Lesion: 'Lesion',
    Option: 'Option',
    Submission: 'Submission'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LesionCountOutputType
   */


  export type LesionCountOutputType = {
    options: number
  }

  export type LesionCountOutputTypeSelect = {
    options?: boolean
  }

  export type LesionCountOutputTypeGetPayload<S extends boolean | null | undefined | LesionCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? LesionCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (LesionCountOutputTypeArgs)
    ? LesionCountOutputType 
    : S extends { select: any } & (LesionCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof LesionCountOutputType ? LesionCountOutputType[P] : never
  } 
      : LesionCountOutputType




  // Custom InputTypes

  /**
   * LesionCountOutputType without action
   */
  export type LesionCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the LesionCountOutputType
     * 
    **/
    select?: LesionCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model Lesion
   */


  export type AggregateLesion = {
    _count: LesionCountAggregateOutputType | null
    _avg: LesionAvgAggregateOutputType | null
    _sum: LesionSumAggregateOutputType | null
    _min: LesionMinAggregateOutputType | null
    _max: LesionMaxAggregateOutputType | null
  }

  export type LesionAvgAggregateOutputType = {
    id: number | null
  }

  export type LesionSumAggregateOutputType = {
    id: number | null
  }

  export type LesionMinAggregateOutputType = {
    id: number | null
    name_fr: string | null
    name_en: string | null
    category_fr: string | null
    category_en: string | null
    image_fr: string | null
    video_fr: string | null
    macro_category_fr: string | null
    multi_step: boolean | null
    next_step: string | null
    previous_step: string | null
    image_en: string | null
    video_en: string | null
    image_trauma: string | null
    face: string | null
    has_options: boolean | null
  }

  export type LesionMaxAggregateOutputType = {
    id: number | null
    name_fr: string | null
    name_en: string | null
    category_fr: string | null
    category_en: string | null
    image_fr: string | null
    video_fr: string | null
    macro_category_fr: string | null
    multi_step: boolean | null
    next_step: string | null
    previous_step: string | null
    image_en: string | null
    video_en: string | null
    image_trauma: string | null
    face: string | null
    has_options: boolean | null
  }

  export type LesionCountAggregateOutputType = {
    id: number
    name_fr: number
    name_en: number
    category_fr: number
    category_en: number
    image_fr: number
    video_fr: number
    macro_category_fr: number
    multi_step: number
    next_step: number
    previous_step: number
    image_en: number
    video_en: number
    image_trauma: number
    face: number
    has_options: number
    _all: number
  }


  export type LesionAvgAggregateInputType = {
    id?: true
  }

  export type LesionSumAggregateInputType = {
    id?: true
  }

  export type LesionMinAggregateInputType = {
    id?: true
    name_fr?: true
    name_en?: true
    category_fr?: true
    category_en?: true
    image_fr?: true
    video_fr?: true
    macro_category_fr?: true
    multi_step?: true
    next_step?: true
    previous_step?: true
    image_en?: true
    video_en?: true
    image_trauma?: true
    face?: true
    has_options?: true
  }

  export type LesionMaxAggregateInputType = {
    id?: true
    name_fr?: true
    name_en?: true
    category_fr?: true
    category_en?: true
    image_fr?: true
    video_fr?: true
    macro_category_fr?: true
    multi_step?: true
    next_step?: true
    previous_step?: true
    image_en?: true
    video_en?: true
    image_trauma?: true
    face?: true
    has_options?: true
  }

  export type LesionCountAggregateInputType = {
    id?: true
    name_fr?: true
    name_en?: true
    category_fr?: true
    category_en?: true
    image_fr?: true
    video_fr?: true
    macro_category_fr?: true
    multi_step?: true
    next_step?: true
    previous_step?: true
    image_en?: true
    video_en?: true
    image_trauma?: true
    face?: true
    has_options?: true
    _all?: true
  }

  export type LesionAggregateArgs = {
    /**
     * Filter which Lesion to aggregate.
     * 
    **/
    where?: LesionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lesions to fetch.
     * 
    **/
    orderBy?: Enumerable<LesionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: LesionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lesions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lesions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lesions
    **/
    _count?: true | LesionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LesionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LesionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LesionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LesionMaxAggregateInputType
  }

  export type GetLesionAggregateType<T extends LesionAggregateArgs> = {
        [P in keyof T & keyof AggregateLesion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesion[P]>
      : GetScalarType<T[P], AggregateLesion[P]>
  }




  export type LesionGroupByArgs = {
    where?: LesionWhereInput
    orderBy?: Enumerable<LesionOrderByWithAggregationInput>
    by: Array<LesionScalarFieldEnum>
    having?: LesionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LesionCountAggregateInputType | true
    _avg?: LesionAvgAggregateInputType
    _sum?: LesionSumAggregateInputType
    _min?: LesionMinAggregateInputType
    _max?: LesionMaxAggregateInputType
  }


  export type LesionGroupByOutputType = {
    id: number
    name_fr: string | null
    name_en: string | null
    category_fr: string | null
    category_en: string | null
    image_fr: string | null
    video_fr: string | null
    macro_category_fr: string | null
    multi_step: boolean | null
    next_step: string | null
    previous_step: string | null
    image_en: string | null
    video_en: string | null
    image_trauma: string | null
    face: string | null
    has_options: boolean
    _count: LesionCountAggregateOutputType | null
    _avg: LesionAvgAggregateOutputType | null
    _sum: LesionSumAggregateOutputType | null
    _min: LesionMinAggregateOutputType | null
    _max: LesionMaxAggregateOutputType | null
  }

  type GetLesionGroupByPayload<T extends LesionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<LesionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LesionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LesionGroupByOutputType[P]>
            : GetScalarType<T[P], LesionGroupByOutputType[P]>
        }
      >
    >


  export type LesionSelect = {
    id?: boolean
    name_fr?: boolean
    name_en?: boolean
    category_fr?: boolean
    category_en?: boolean
    image_fr?: boolean
    video_fr?: boolean
    macro_category_fr?: boolean
    multi_step?: boolean
    next_step?: boolean
    previous_step?: boolean
    image_en?: boolean
    video_en?: boolean
    image_trauma?: boolean
    face?: boolean
    has_options?: boolean
    options?: boolean | Lesion$optionsArgs
    _count?: boolean | LesionCountOutputTypeArgs
  }


  export type LesionInclude = {
    options?: boolean | Lesion$optionsArgs
    _count?: boolean | LesionCountOutputTypeArgs
  } 

  export type LesionGetPayload<S extends boolean | null | undefined | LesionArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Lesion :
    S extends undefined ? never :
    S extends { include: any } & (LesionArgs | LesionFindManyArgs)
    ? Lesion  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'options' ? Array < OptionGetPayload<S['include'][P]>>  :
        P extends '_count' ? LesionCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (LesionArgs | LesionFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'options' ? Array < OptionGetPayload<S['select'][P]>>  :
        P extends '_count' ? LesionCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Lesion ? Lesion[P] : never
  } 
      : Lesion


  type LesionCountArgs = Merge<
    Omit<LesionFindManyArgs, 'select' | 'include'> & {
      select?: LesionCountAggregateInputType | true
    }
  >

  export interface LesionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Lesion that matches the filter.
     * @param {LesionFindUniqueArgs} args - Arguments to find a Lesion
     * @example
     * // Get one Lesion
     * const lesion = await prisma.lesion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends LesionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, LesionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Lesion'> extends True ? Prisma__LesionClient<LesionGetPayload<T>> : Prisma__LesionClient<LesionGetPayload<T> | null, null>

    /**
     * Find one Lesion that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {LesionFindUniqueOrThrowArgs} args - Arguments to find a Lesion
     * @example
     * // Get one Lesion
     * const lesion = await prisma.lesion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends LesionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, LesionFindUniqueOrThrowArgs>
    ): Prisma__LesionClient<LesionGetPayload<T>>

    /**
     * Find the first Lesion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionFindFirstArgs} args - Arguments to find a Lesion
     * @example
     * // Get one Lesion
     * const lesion = await prisma.lesion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends LesionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, LesionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Lesion'> extends True ? Prisma__LesionClient<LesionGetPayload<T>> : Prisma__LesionClient<LesionGetPayload<T> | null, null>

    /**
     * Find the first Lesion that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionFindFirstOrThrowArgs} args - Arguments to find a Lesion
     * @example
     * // Get one Lesion
     * const lesion = await prisma.lesion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends LesionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LesionFindFirstOrThrowArgs>
    ): Prisma__LesionClient<LesionGetPayload<T>>

    /**
     * Find zero or more Lesions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lesions
     * const lesions = await prisma.lesion.findMany()
     * 
     * // Get first 10 Lesions
     * const lesions = await prisma.lesion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lesionWithIdOnly = await prisma.lesion.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends LesionFindManyArgs>(
      args?: SelectSubset<T, LesionFindManyArgs>
    ): PrismaPromise<Array<LesionGetPayload<T>>>

    /**
     * Create a Lesion.
     * @param {LesionCreateArgs} args - Arguments to create a Lesion.
     * @example
     * // Create one Lesion
     * const Lesion = await prisma.lesion.create({
     *   data: {
     *     // ... data to create a Lesion
     *   }
     * })
     * 
    **/
    create<T extends LesionCreateArgs>(
      args: SelectSubset<T, LesionCreateArgs>
    ): Prisma__LesionClient<LesionGetPayload<T>>

    /**
     * Create many Lesions.
     *     @param {LesionCreateManyArgs} args - Arguments to create many Lesions.
     *     @example
     *     // Create many Lesions
     *     const lesion = await prisma.lesion.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends LesionCreateManyArgs>(
      args?: SelectSubset<T, LesionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Lesion.
     * @param {LesionDeleteArgs} args - Arguments to delete one Lesion.
     * @example
     * // Delete one Lesion
     * const Lesion = await prisma.lesion.delete({
     *   where: {
     *     // ... filter to delete one Lesion
     *   }
     * })
     * 
    **/
    delete<T extends LesionDeleteArgs>(
      args: SelectSubset<T, LesionDeleteArgs>
    ): Prisma__LesionClient<LesionGetPayload<T>>

    /**
     * Update one Lesion.
     * @param {LesionUpdateArgs} args - Arguments to update one Lesion.
     * @example
     * // Update one Lesion
     * const lesion = await prisma.lesion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends LesionUpdateArgs>(
      args: SelectSubset<T, LesionUpdateArgs>
    ): Prisma__LesionClient<LesionGetPayload<T>>

    /**
     * Delete zero or more Lesions.
     * @param {LesionDeleteManyArgs} args - Arguments to filter Lesions to delete.
     * @example
     * // Delete a few Lesions
     * const { count } = await prisma.lesion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends LesionDeleteManyArgs>(
      args?: SelectSubset<T, LesionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lesions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lesions
     * const lesion = await prisma.lesion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends LesionUpdateManyArgs>(
      args: SelectSubset<T, LesionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Lesion.
     * @param {LesionUpsertArgs} args - Arguments to update or create a Lesion.
     * @example
     * // Update or create a Lesion
     * const lesion = await prisma.lesion.upsert({
     *   create: {
     *     // ... data to create a Lesion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesion we want to update
     *   }
     * })
    **/
    upsert<T extends LesionUpsertArgs>(
      args: SelectSubset<T, LesionUpsertArgs>
    ): Prisma__LesionClient<LesionGetPayload<T>>

    /**
     * Count the number of Lesions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionCountArgs} args - Arguments to filter Lesions to count.
     * @example
     * // Count the number of Lesions
     * const count = await prisma.lesion.count({
     *   where: {
     *     // ... the filter for the Lesions we want to count
     *   }
     * })
    **/
    count<T extends LesionCountArgs>(
      args?: Subset<T, LesionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LesionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LesionAggregateArgs>(args: Subset<T, LesionAggregateArgs>): PrismaPromise<GetLesionAggregateType<T>>

    /**
     * Group by Lesion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LesionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LesionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LesionGroupByArgs['orderBy'] }
        : { orderBy?: LesionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LesionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLesionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Lesion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__LesionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    options<T extends Lesion$optionsArgs= {}>(args?: Subset<T, Lesion$optionsArgs>): PrismaPromise<Array<OptionGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Lesion base type for findUnique actions
   */
  export type LesionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * Filter, which Lesion to fetch.
     * 
    **/
    where: LesionWhereUniqueInput
  }

  /**
   * Lesion findUnique
   */
  export interface LesionFindUniqueArgs extends LesionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Lesion findUniqueOrThrow
   */
  export type LesionFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * Filter, which Lesion to fetch.
     * 
    **/
    where: LesionWhereUniqueInput
  }


  /**
   * Lesion base type for findFirst actions
   */
  export type LesionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * Filter, which Lesion to fetch.
     * 
    **/
    where?: LesionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lesions to fetch.
     * 
    **/
    orderBy?: Enumerable<LesionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lesions.
     * 
    **/
    cursor?: LesionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lesions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lesions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lesions.
     * 
    **/
    distinct?: Enumerable<LesionScalarFieldEnum>
  }

  /**
   * Lesion findFirst
   */
  export interface LesionFindFirstArgs extends LesionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Lesion findFirstOrThrow
   */
  export type LesionFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * Filter, which Lesion to fetch.
     * 
    **/
    where?: LesionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lesions to fetch.
     * 
    **/
    orderBy?: Enumerable<LesionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lesions.
     * 
    **/
    cursor?: LesionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lesions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lesions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lesions.
     * 
    **/
    distinct?: Enumerable<LesionScalarFieldEnum>
  }


  /**
   * Lesion findMany
   */
  export type LesionFindManyArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * Filter, which Lesions to fetch.
     * 
    **/
    where?: LesionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lesions to fetch.
     * 
    **/
    orderBy?: Enumerable<LesionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lesions.
     * 
    **/
    cursor?: LesionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lesions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lesions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<LesionScalarFieldEnum>
  }


  /**
   * Lesion create
   */
  export type LesionCreateArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * The data needed to create a Lesion.
     * 
    **/
    data: XOR<LesionCreateInput, LesionUncheckedCreateInput>
  }


  /**
   * Lesion createMany
   */
  export type LesionCreateManyArgs = {
    /**
     * The data used to create many Lesions.
     * 
    **/
    data: Enumerable<LesionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Lesion update
   */
  export type LesionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * The data needed to update a Lesion.
     * 
    **/
    data: XOR<LesionUpdateInput, LesionUncheckedUpdateInput>
    /**
     * Choose, which Lesion to update.
     * 
    **/
    where: LesionWhereUniqueInput
  }


  /**
   * Lesion updateMany
   */
  export type LesionUpdateManyArgs = {
    /**
     * The data used to update Lesions.
     * 
    **/
    data: XOR<LesionUpdateManyMutationInput, LesionUncheckedUpdateManyInput>
    /**
     * Filter which Lesions to update
     * 
    **/
    where?: LesionWhereInput
  }


  /**
   * Lesion upsert
   */
  export type LesionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * The filter to search for the Lesion to update in case it exists.
     * 
    **/
    where: LesionWhereUniqueInput
    /**
     * In case the Lesion found by the `where` argument doesn't exist, create a new Lesion with this data.
     * 
    **/
    create: XOR<LesionCreateInput, LesionUncheckedCreateInput>
    /**
     * In case the Lesion was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<LesionUpdateInput, LesionUncheckedUpdateInput>
  }


  /**
   * Lesion delete
   */
  export type LesionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
    /**
     * Filter which Lesion to delete.
     * 
    **/
    where: LesionWhereUniqueInput
  }


  /**
   * Lesion deleteMany
   */
  export type LesionDeleteManyArgs = {
    /**
     * Filter which Lesions to delete
     * 
    **/
    where?: LesionWhereInput
  }


  /**
   * Lesion.options
   */
  export type Lesion$optionsArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    where?: OptionWhereInput
    orderBy?: Enumerable<OptionOrderByWithRelationInput>
    cursor?: OptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<OptionScalarFieldEnum>
  }


  /**
   * Lesion without action
   */
  export type LesionArgs = {
    /**
     * Select specific fields to fetch from the Lesion
     * 
    **/
    select?: LesionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: LesionInclude | null
  }



  /**
   * Model Option
   */


  export type AggregateOption = {
    _count: OptionCountAggregateOutputType | null
    _avg: OptionAvgAggregateOutputType | null
    _sum: OptionSumAggregateOutputType | null
    _min: OptionMinAggregateOutputType | null
    _max: OptionMaxAggregateOutputType | null
  }

  export type OptionAvgAggregateOutputType = {
    id: number | null
    lesion_id: number | null
  }

  export type OptionSumAggregateOutputType = {
    id: number | null
    lesion_id: number | null
  }

  export type OptionMinAggregateOutputType = {
    id: number | null
    created_at: Date | null
    name_fr: string | null
    name_en: string | null
    lesion_id: number | null
    image_trauma: string | null
    face: string | null
  }

  export type OptionMaxAggregateOutputType = {
    id: number | null
    created_at: Date | null
    name_fr: string | null
    name_en: string | null
    lesion_id: number | null
    image_trauma: string | null
    face: string | null
  }

  export type OptionCountAggregateOutputType = {
    id: number
    created_at: number
    name_fr: number
    name_en: number
    lesion_id: number
    image_trauma: number
    face: number
    _all: number
  }


  export type OptionAvgAggregateInputType = {
    id?: true
    lesion_id?: true
  }

  export type OptionSumAggregateInputType = {
    id?: true
    lesion_id?: true
  }

  export type OptionMinAggregateInputType = {
    id?: true
    created_at?: true
    name_fr?: true
    name_en?: true
    lesion_id?: true
    image_trauma?: true
    face?: true
  }

  export type OptionMaxAggregateInputType = {
    id?: true
    created_at?: true
    name_fr?: true
    name_en?: true
    lesion_id?: true
    image_trauma?: true
    face?: true
  }

  export type OptionCountAggregateInputType = {
    id?: true
    created_at?: true
    name_fr?: true
    name_en?: true
    lesion_id?: true
    image_trauma?: true
    face?: true
    _all?: true
  }

  export type OptionAggregateArgs = {
    /**
     * Filter which Option to aggregate.
     * 
    **/
    where?: OptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Options to fetch.
     * 
    **/
    orderBy?: Enumerable<OptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: OptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Options from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Options.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Options
    **/
    _count?: true | OptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OptionMaxAggregateInputType
  }

  export type GetOptionAggregateType<T extends OptionAggregateArgs> = {
        [P in keyof T & keyof AggregateOption]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOption[P]>
      : GetScalarType<T[P], AggregateOption[P]>
  }




  export type OptionGroupByArgs = {
    where?: OptionWhereInput
    orderBy?: Enumerable<OptionOrderByWithAggregationInput>
    by: Array<OptionScalarFieldEnum>
    having?: OptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OptionCountAggregateInputType | true
    _avg?: OptionAvgAggregateInputType
    _sum?: OptionSumAggregateInputType
    _min?: OptionMinAggregateInputType
    _max?: OptionMaxAggregateInputType
  }


  export type OptionGroupByOutputType = {
    id: number
    created_at: Date
    name_fr: string | null
    name_en: string | null
    lesion_id: number | null
    image_trauma: string | null
    face: string | null
    _count: OptionCountAggregateOutputType | null
    _avg: OptionAvgAggregateOutputType | null
    _sum: OptionSumAggregateOutputType | null
    _min: OptionMinAggregateOutputType | null
    _max: OptionMaxAggregateOutputType | null
  }

  type GetOptionGroupByPayload<T extends OptionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<OptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OptionGroupByOutputType[P]>
            : GetScalarType<T[P], OptionGroupByOutputType[P]>
        }
      >
    >


  export type OptionSelect = {
    id?: boolean
    created_at?: boolean
    name_fr?: boolean
    name_en?: boolean
    lesion_id?: boolean
    image_trauma?: boolean
    face?: boolean
    lesion?: boolean | LesionArgs
  }


  export type OptionInclude = {
    lesion?: boolean | LesionArgs
  } 

  export type OptionGetPayload<S extends boolean | null | undefined | OptionArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Option :
    S extends undefined ? never :
    S extends { include: any } & (OptionArgs | OptionFindManyArgs)
    ? Option  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'lesion' ? LesionGetPayload<S['include'][P]> | null :  never
  } 
    : S extends { select: any } & (OptionArgs | OptionFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'lesion' ? LesionGetPayload<S['select'][P]> | null :  P extends keyof Option ? Option[P] : never
  } 
      : Option


  type OptionCountArgs = Merge<
    Omit<OptionFindManyArgs, 'select' | 'include'> & {
      select?: OptionCountAggregateInputType | true
    }
  >

  export interface OptionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Option that matches the filter.
     * @param {OptionFindUniqueArgs} args - Arguments to find a Option
     * @example
     * // Get one Option
     * const option = await prisma.option.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends OptionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, OptionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Option'> extends True ? Prisma__OptionClient<OptionGetPayload<T>> : Prisma__OptionClient<OptionGetPayload<T> | null, null>

    /**
     * Find one Option that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {OptionFindUniqueOrThrowArgs} args - Arguments to find a Option
     * @example
     * // Get one Option
     * const option = await prisma.option.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends OptionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, OptionFindUniqueOrThrowArgs>
    ): Prisma__OptionClient<OptionGetPayload<T>>

    /**
     * Find the first Option that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionFindFirstArgs} args - Arguments to find a Option
     * @example
     * // Get one Option
     * const option = await prisma.option.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends OptionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, OptionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Option'> extends True ? Prisma__OptionClient<OptionGetPayload<T>> : Prisma__OptionClient<OptionGetPayload<T> | null, null>

    /**
     * Find the first Option that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionFindFirstOrThrowArgs} args - Arguments to find a Option
     * @example
     * // Get one Option
     * const option = await prisma.option.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends OptionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, OptionFindFirstOrThrowArgs>
    ): Prisma__OptionClient<OptionGetPayload<T>>

    /**
     * Find zero or more Options that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Options
     * const options = await prisma.option.findMany()
     * 
     * // Get first 10 Options
     * const options = await prisma.option.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const optionWithIdOnly = await prisma.option.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends OptionFindManyArgs>(
      args?: SelectSubset<T, OptionFindManyArgs>
    ): PrismaPromise<Array<OptionGetPayload<T>>>

    /**
     * Create a Option.
     * @param {OptionCreateArgs} args - Arguments to create a Option.
     * @example
     * // Create one Option
     * const Option = await prisma.option.create({
     *   data: {
     *     // ... data to create a Option
     *   }
     * })
     * 
    **/
    create<T extends OptionCreateArgs>(
      args: SelectSubset<T, OptionCreateArgs>
    ): Prisma__OptionClient<OptionGetPayload<T>>

    /**
     * Create many Options.
     *     @param {OptionCreateManyArgs} args - Arguments to create many Options.
     *     @example
     *     // Create many Options
     *     const option = await prisma.option.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends OptionCreateManyArgs>(
      args?: SelectSubset<T, OptionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Option.
     * @param {OptionDeleteArgs} args - Arguments to delete one Option.
     * @example
     * // Delete one Option
     * const Option = await prisma.option.delete({
     *   where: {
     *     // ... filter to delete one Option
     *   }
     * })
     * 
    **/
    delete<T extends OptionDeleteArgs>(
      args: SelectSubset<T, OptionDeleteArgs>
    ): Prisma__OptionClient<OptionGetPayload<T>>

    /**
     * Update one Option.
     * @param {OptionUpdateArgs} args - Arguments to update one Option.
     * @example
     * // Update one Option
     * const option = await prisma.option.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends OptionUpdateArgs>(
      args: SelectSubset<T, OptionUpdateArgs>
    ): Prisma__OptionClient<OptionGetPayload<T>>

    /**
     * Delete zero or more Options.
     * @param {OptionDeleteManyArgs} args - Arguments to filter Options to delete.
     * @example
     * // Delete a few Options
     * const { count } = await prisma.option.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends OptionDeleteManyArgs>(
      args?: SelectSubset<T, OptionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Options.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Options
     * const option = await prisma.option.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends OptionUpdateManyArgs>(
      args: SelectSubset<T, OptionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Option.
     * @param {OptionUpsertArgs} args - Arguments to update or create a Option.
     * @example
     * // Update or create a Option
     * const option = await prisma.option.upsert({
     *   create: {
     *     // ... data to create a Option
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Option we want to update
     *   }
     * })
    **/
    upsert<T extends OptionUpsertArgs>(
      args: SelectSubset<T, OptionUpsertArgs>
    ): Prisma__OptionClient<OptionGetPayload<T>>

    /**
     * Count the number of Options.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionCountArgs} args - Arguments to filter Options to count.
     * @example
     * // Count the number of Options
     * const count = await prisma.option.count({
     *   where: {
     *     // ... the filter for the Options we want to count
     *   }
     * })
    **/
    count<T extends OptionCountArgs>(
      args?: Subset<T, OptionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Option.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OptionAggregateArgs>(args: Subset<T, OptionAggregateArgs>): PrismaPromise<GetOptionAggregateType<T>>

    /**
     * Group by Option.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OptionGroupByArgs['orderBy'] }
        : { orderBy?: OptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOptionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Option.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__OptionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    lesion<T extends LesionArgs= {}>(args?: Subset<T, LesionArgs>): Prisma__LesionClient<LesionGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Option base type for findUnique actions
   */
  export type OptionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * Filter, which Option to fetch.
     * 
    **/
    where: OptionWhereUniqueInput
  }

  /**
   * Option findUnique
   */
  export interface OptionFindUniqueArgs extends OptionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Option findUniqueOrThrow
   */
  export type OptionFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * Filter, which Option to fetch.
     * 
    **/
    where: OptionWhereUniqueInput
  }


  /**
   * Option base type for findFirst actions
   */
  export type OptionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * Filter, which Option to fetch.
     * 
    **/
    where?: OptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Options to fetch.
     * 
    **/
    orderBy?: Enumerable<OptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Options.
     * 
    **/
    cursor?: OptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Options from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Options.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Options.
     * 
    **/
    distinct?: Enumerable<OptionScalarFieldEnum>
  }

  /**
   * Option findFirst
   */
  export interface OptionFindFirstArgs extends OptionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Option findFirstOrThrow
   */
  export type OptionFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * Filter, which Option to fetch.
     * 
    **/
    where?: OptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Options to fetch.
     * 
    **/
    orderBy?: Enumerable<OptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Options.
     * 
    **/
    cursor?: OptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Options from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Options.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Options.
     * 
    **/
    distinct?: Enumerable<OptionScalarFieldEnum>
  }


  /**
   * Option findMany
   */
  export type OptionFindManyArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * Filter, which Options to fetch.
     * 
    **/
    where?: OptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Options to fetch.
     * 
    **/
    orderBy?: Enumerable<OptionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Options.
     * 
    **/
    cursor?: OptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Options from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Options.
     * 
    **/
    skip?: number
    distinct?: Enumerable<OptionScalarFieldEnum>
  }


  /**
   * Option create
   */
  export type OptionCreateArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * The data needed to create a Option.
     * 
    **/
    data: XOR<OptionCreateInput, OptionUncheckedCreateInput>
  }


  /**
   * Option createMany
   */
  export type OptionCreateManyArgs = {
    /**
     * The data used to create many Options.
     * 
    **/
    data: Enumerable<OptionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Option update
   */
  export type OptionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * The data needed to update a Option.
     * 
    **/
    data: XOR<OptionUpdateInput, OptionUncheckedUpdateInput>
    /**
     * Choose, which Option to update.
     * 
    **/
    where: OptionWhereUniqueInput
  }


  /**
   * Option updateMany
   */
  export type OptionUpdateManyArgs = {
    /**
     * The data used to update Options.
     * 
    **/
    data: XOR<OptionUpdateManyMutationInput, OptionUncheckedUpdateManyInput>
    /**
     * Filter which Options to update
     * 
    **/
    where?: OptionWhereInput
  }


  /**
   * Option upsert
   */
  export type OptionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * The filter to search for the Option to update in case it exists.
     * 
    **/
    where: OptionWhereUniqueInput
    /**
     * In case the Option found by the `where` argument doesn't exist, create a new Option with this data.
     * 
    **/
    create: XOR<OptionCreateInput, OptionUncheckedCreateInput>
    /**
     * In case the Option was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<OptionUpdateInput, OptionUncheckedUpdateInput>
  }


  /**
   * Option delete
   */
  export type OptionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
    /**
     * Filter which Option to delete.
     * 
    **/
    where: OptionWhereUniqueInput
  }


  /**
   * Option deleteMany
   */
  export type OptionDeleteManyArgs = {
    /**
     * Filter which Options to delete
     * 
    **/
    where?: OptionWhereInput
  }


  /**
   * Option without action
   */
  export type OptionArgs = {
    /**
     * Select specific fields to fetch from the Option
     * 
    **/
    select?: OptionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: OptionInclude | null
  }



  /**
   * Model Submission
   */


  export type AggregateSubmission = {
    _count: SubmissionCountAggregateOutputType | null
    _avg: SubmissionAvgAggregateOutputType | null
    _sum: SubmissionSumAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  export type SubmissionAvgAggregateOutputType = {
    id: number | null
  }

  export type SubmissionSumAggregateOutputType = {
    id: number | null
  }

  export type SubmissionMinAggregateOutputType = {
    id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubmissionMaxAggregateOutputType = {
    id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type SubmissionCountAggregateOutputType = {
    id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type SubmissionAvgAggregateInputType = {
    id?: true
  }

  export type SubmissionSumAggregateInputType = {
    id?: true
  }

  export type SubmissionMinAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
  }

  export type SubmissionMaxAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
  }

  export type SubmissionCountAggregateInputType = {
    id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type SubmissionAggregateArgs = {
    /**
     * Filter which Submission to aggregate.
     * 
    **/
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     * 
    **/
    orderBy?: Enumerable<SubmissionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Submissions
    **/
    _count?: true | SubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubmissionMaxAggregateInputType
  }

  export type GetSubmissionAggregateType<T extends SubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubmission[P]>
      : GetScalarType<T[P], AggregateSubmission[P]>
  }




  export type SubmissionGroupByArgs = {
    where?: SubmissionWhereInput
    orderBy?: Enumerable<SubmissionOrderByWithAggregationInput>
    by: Array<SubmissionScalarFieldEnum>
    having?: SubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubmissionCountAggregateInputType | true
    _avg?: SubmissionAvgAggregateInputType
    _sum?: SubmissionSumAggregateInputType
    _min?: SubmissionMinAggregateInputType
    _max?: SubmissionMaxAggregateInputType
  }


  export type SubmissionGroupByOutputType = {
    id: number
    created_at: Date
    updated_at: Date | null
    _count: SubmissionCountAggregateOutputType | null
    _avg: SubmissionAvgAggregateOutputType | null
    _sum: SubmissionSumAggregateOutputType | null
    _min: SubmissionMinAggregateOutputType | null
    _max: SubmissionMaxAggregateOutputType | null
  }

  type GetSubmissionGroupByPayload<T extends SubmissionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<SubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SubmissionGroupByOutputType[P]>
        }
      >
    >


  export type SubmissionSelect = {
    id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type SubmissionGetPayload<S extends boolean | null | undefined | SubmissionArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Submission :
    S extends undefined ? never :
    S extends { include: any } & (SubmissionArgs | SubmissionFindManyArgs)
    ? Submission 
    : S extends { select: any } & (SubmissionArgs | SubmissionFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Submission ? Submission[P] : never
  } 
      : Submission


  type SubmissionCountArgs = Merge<
    Omit<SubmissionFindManyArgs, 'select' | 'include'> & {
      select?: SubmissionCountAggregateInputType | true
    }
  >

  export interface SubmissionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Submission that matches the filter.
     * @param {SubmissionFindUniqueArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SubmissionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, SubmissionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Submission'> extends True ? Prisma__SubmissionClient<SubmissionGetPayload<T>> : Prisma__SubmissionClient<SubmissionGetPayload<T> | null, null>

    /**
     * Find one Submission that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SubmissionFindUniqueOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SubmissionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, SubmissionFindUniqueOrThrowArgs>
    ): Prisma__SubmissionClient<SubmissionGetPayload<T>>

    /**
     * Find the first Submission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindFirstArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SubmissionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, SubmissionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Submission'> extends True ? Prisma__SubmissionClient<SubmissionGetPayload<T>> : Prisma__SubmissionClient<SubmissionGetPayload<T> | null, null>

    /**
     * Find the first Submission that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindFirstOrThrowArgs} args - Arguments to find a Submission
     * @example
     * // Get one Submission
     * const submission = await prisma.submission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SubmissionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SubmissionFindFirstOrThrowArgs>
    ): Prisma__SubmissionClient<SubmissionGetPayload<T>>

    /**
     * Find zero or more Submissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Submissions
     * const submissions = await prisma.submission.findMany()
     * 
     * // Get first 10 Submissions
     * const submissions = await prisma.submission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const submissionWithIdOnly = await prisma.submission.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SubmissionFindManyArgs>(
      args?: SelectSubset<T, SubmissionFindManyArgs>
    ): PrismaPromise<Array<SubmissionGetPayload<T>>>

    /**
     * Create a Submission.
     * @param {SubmissionCreateArgs} args - Arguments to create a Submission.
     * @example
     * // Create one Submission
     * const Submission = await prisma.submission.create({
     *   data: {
     *     // ... data to create a Submission
     *   }
     * })
     * 
    **/
    create<T extends SubmissionCreateArgs>(
      args: SelectSubset<T, SubmissionCreateArgs>
    ): Prisma__SubmissionClient<SubmissionGetPayload<T>>

    /**
     * Create many Submissions.
     *     @param {SubmissionCreateManyArgs} args - Arguments to create many Submissions.
     *     @example
     *     // Create many Submissions
     *     const submission = await prisma.submission.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends SubmissionCreateManyArgs>(
      args?: SelectSubset<T, SubmissionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Submission.
     * @param {SubmissionDeleteArgs} args - Arguments to delete one Submission.
     * @example
     * // Delete one Submission
     * const Submission = await prisma.submission.delete({
     *   where: {
     *     // ... filter to delete one Submission
     *   }
     * })
     * 
    **/
    delete<T extends SubmissionDeleteArgs>(
      args: SelectSubset<T, SubmissionDeleteArgs>
    ): Prisma__SubmissionClient<SubmissionGetPayload<T>>

    /**
     * Update one Submission.
     * @param {SubmissionUpdateArgs} args - Arguments to update one Submission.
     * @example
     * // Update one Submission
     * const submission = await prisma.submission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SubmissionUpdateArgs>(
      args: SelectSubset<T, SubmissionUpdateArgs>
    ): Prisma__SubmissionClient<SubmissionGetPayload<T>>

    /**
     * Delete zero or more Submissions.
     * @param {SubmissionDeleteManyArgs} args - Arguments to filter Submissions to delete.
     * @example
     * // Delete a few Submissions
     * const { count } = await prisma.submission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SubmissionDeleteManyArgs>(
      args?: SelectSubset<T, SubmissionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Submissions
     * const submission = await prisma.submission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SubmissionUpdateManyArgs>(
      args: SelectSubset<T, SubmissionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Submission.
     * @param {SubmissionUpsertArgs} args - Arguments to update or create a Submission.
     * @example
     * // Update or create a Submission
     * const submission = await prisma.submission.upsert({
     *   create: {
     *     // ... data to create a Submission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Submission we want to update
     *   }
     * })
    **/
    upsert<T extends SubmissionUpsertArgs>(
      args: SelectSubset<T, SubmissionUpsertArgs>
    ): Prisma__SubmissionClient<SubmissionGetPayload<T>>

    /**
     * Count the number of Submissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionCountArgs} args - Arguments to filter Submissions to count.
     * @example
     * // Count the number of Submissions
     * const count = await prisma.submission.count({
     *   where: {
     *     // ... the filter for the Submissions we want to count
     *   }
     * })
    **/
    count<T extends SubmissionCountArgs>(
      args?: Subset<T, SubmissionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubmissionAggregateArgs>(args: Subset<T, SubmissionAggregateArgs>): PrismaPromise<GetSubmissionAggregateType<T>>

    /**
     * Group by Submission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubmissionGroupByArgs['orderBy'] }
        : { orderBy?: SubmissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Submission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SubmissionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Submission base type for findUnique actions
   */
  export type SubmissionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * Filter, which Submission to fetch.
     * 
    **/
    where: SubmissionWhereUniqueInput
  }

  /**
   * Submission findUnique
   */
  export interface SubmissionFindUniqueArgs extends SubmissionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Submission findUniqueOrThrow
   */
  export type SubmissionFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * Filter, which Submission to fetch.
     * 
    **/
    where: SubmissionWhereUniqueInput
  }


  /**
   * Submission base type for findFirst actions
   */
  export type SubmissionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * Filter, which Submission to fetch.
     * 
    **/
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     * 
    **/
    orderBy?: Enumerable<SubmissionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Submissions.
     * 
    **/
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     * 
    **/
    distinct?: Enumerable<SubmissionScalarFieldEnum>
  }

  /**
   * Submission findFirst
   */
  export interface SubmissionFindFirstArgs extends SubmissionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Submission findFirstOrThrow
   */
  export type SubmissionFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * Filter, which Submission to fetch.
     * 
    **/
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     * 
    **/
    orderBy?: Enumerable<SubmissionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Submissions.
     * 
    **/
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Submissions.
     * 
    **/
    distinct?: Enumerable<SubmissionScalarFieldEnum>
  }


  /**
   * Submission findMany
   */
  export type SubmissionFindManyArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * Filter, which Submissions to fetch.
     * 
    **/
    where?: SubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Submissions to fetch.
     * 
    **/
    orderBy?: Enumerable<SubmissionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Submissions.
     * 
    **/
    cursor?: SubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Submissions from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Submissions.
     * 
    **/
    skip?: number
    distinct?: Enumerable<SubmissionScalarFieldEnum>
  }


  /**
   * Submission create
   */
  export type SubmissionCreateArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * The data needed to create a Submission.
     * 
    **/
    data: XOR<SubmissionCreateInput, SubmissionUncheckedCreateInput>
  }


  /**
   * Submission createMany
   */
  export type SubmissionCreateManyArgs = {
    /**
     * The data used to create many Submissions.
     * 
    **/
    data: Enumerable<SubmissionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Submission update
   */
  export type SubmissionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * The data needed to update a Submission.
     * 
    **/
    data: XOR<SubmissionUpdateInput, SubmissionUncheckedUpdateInput>
    /**
     * Choose, which Submission to update.
     * 
    **/
    where: SubmissionWhereUniqueInput
  }


  /**
   * Submission updateMany
   */
  export type SubmissionUpdateManyArgs = {
    /**
     * The data used to update Submissions.
     * 
    **/
    data: XOR<SubmissionUpdateManyMutationInput, SubmissionUncheckedUpdateManyInput>
    /**
     * Filter which Submissions to update
     * 
    **/
    where?: SubmissionWhereInput
  }


  /**
   * Submission upsert
   */
  export type SubmissionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * The filter to search for the Submission to update in case it exists.
     * 
    **/
    where: SubmissionWhereUniqueInput
    /**
     * In case the Submission found by the `where` argument doesn't exist, create a new Submission with this data.
     * 
    **/
    create: XOR<SubmissionCreateInput, SubmissionUncheckedCreateInput>
    /**
     * In case the Submission was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<SubmissionUpdateInput, SubmissionUncheckedUpdateInput>
  }


  /**
   * Submission delete
   */
  export type SubmissionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
    /**
     * Filter which Submission to delete.
     * 
    **/
    where: SubmissionWhereUniqueInput
  }


  /**
   * Submission deleteMany
   */
  export type SubmissionDeleteManyArgs = {
    /**
     * Filter which Submissions to delete
     * 
    **/
    where?: SubmissionWhereInput
  }


  /**
   * Submission without action
   */
  export type SubmissionArgs = {
    /**
     * Select specific fields to fetch from the Submission
     * 
    **/
    select?: SubmissionSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const LesionScalarFieldEnum: {
    id: 'id',
    name_fr: 'name_fr',
    name_en: 'name_en',
    category_fr: 'category_fr',
    category_en: 'category_en',
    image_fr: 'image_fr',
    video_fr: 'video_fr',
    macro_category_fr: 'macro_category_fr',
    multi_step: 'multi_step',
    next_step: 'next_step',
    previous_step: 'previous_step',
    image_en: 'image_en',
    video_en: 'video_en',
    image_trauma: 'image_trauma',
    face: 'face',
    has_options: 'has_options'
  };

  export type LesionScalarFieldEnum = (typeof LesionScalarFieldEnum)[keyof typeof LesionScalarFieldEnum]


  export const OptionScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    name_fr: 'name_fr',
    name_en: 'name_en',
    lesion_id: 'lesion_id',
    image_trauma: 'image_trauma',
    face: 'face'
  };

  export type OptionScalarFieldEnum = (typeof OptionScalarFieldEnum)[keyof typeof OptionScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const SubmissionScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type SubmissionScalarFieldEnum = (typeof SubmissionScalarFieldEnum)[keyof typeof SubmissionScalarFieldEnum]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  /**
   * Deep Input Types
   */


  export type LesionWhereInput = {
    AND?: Enumerable<LesionWhereInput>
    OR?: Enumerable<LesionWhereInput>
    NOT?: Enumerable<LesionWhereInput>
    id?: IntFilter | number
    name_fr?: StringNullableFilter | string | null
    name_en?: StringNullableFilter | string | null
    category_fr?: StringNullableFilter | string | null
    category_en?: StringNullableFilter | string | null
    image_fr?: StringNullableFilter | string | null
    video_fr?: StringNullableFilter | string | null
    macro_category_fr?: StringNullableFilter | string | null
    multi_step?: BoolNullableFilter | boolean | null
    next_step?: StringNullableFilter | string | null
    previous_step?: StringNullableFilter | string | null
    image_en?: StringNullableFilter | string | null
    video_en?: StringNullableFilter | string | null
    image_trauma?: StringNullableFilter | string | null
    face?: StringNullableFilter | string | null
    has_options?: BoolFilter | boolean
    options?: OptionListRelationFilter
  }

  export type LesionOrderByWithRelationInput = {
    id?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    category_fr?: SortOrder
    category_en?: SortOrder
    image_fr?: SortOrder
    video_fr?: SortOrder
    macro_category_fr?: SortOrder
    multi_step?: SortOrder
    next_step?: SortOrder
    previous_step?: SortOrder
    image_en?: SortOrder
    video_en?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    has_options?: SortOrder
    options?: OptionOrderByRelationAggregateInput
  }

  export type LesionWhereUniqueInput = {
    id?: number
  }

  export type LesionOrderByWithAggregationInput = {
    id?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    category_fr?: SortOrder
    category_en?: SortOrder
    image_fr?: SortOrder
    video_fr?: SortOrder
    macro_category_fr?: SortOrder
    multi_step?: SortOrder
    next_step?: SortOrder
    previous_step?: SortOrder
    image_en?: SortOrder
    video_en?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    has_options?: SortOrder
    _count?: LesionCountOrderByAggregateInput
    _avg?: LesionAvgOrderByAggregateInput
    _max?: LesionMaxOrderByAggregateInput
    _min?: LesionMinOrderByAggregateInput
    _sum?: LesionSumOrderByAggregateInput
  }

  export type LesionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<LesionScalarWhereWithAggregatesInput>
    OR?: Enumerable<LesionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<LesionScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    name_fr?: StringNullableWithAggregatesFilter | string | null
    name_en?: StringNullableWithAggregatesFilter | string | null
    category_fr?: StringNullableWithAggregatesFilter | string | null
    category_en?: StringNullableWithAggregatesFilter | string | null
    image_fr?: StringNullableWithAggregatesFilter | string | null
    video_fr?: StringNullableWithAggregatesFilter | string | null
    macro_category_fr?: StringNullableWithAggregatesFilter | string | null
    multi_step?: BoolNullableWithAggregatesFilter | boolean | null
    next_step?: StringNullableWithAggregatesFilter | string | null
    previous_step?: StringNullableWithAggregatesFilter | string | null
    image_en?: StringNullableWithAggregatesFilter | string | null
    video_en?: StringNullableWithAggregatesFilter | string | null
    image_trauma?: StringNullableWithAggregatesFilter | string | null
    face?: StringNullableWithAggregatesFilter | string | null
    has_options?: BoolWithAggregatesFilter | boolean
  }

  export type OptionWhereInput = {
    AND?: Enumerable<OptionWhereInput>
    OR?: Enumerable<OptionWhereInput>
    NOT?: Enumerable<OptionWhereInput>
    id?: IntFilter | number
    created_at?: DateTimeFilter | Date | string
    name_fr?: StringNullableFilter | string | null
    name_en?: StringNullableFilter | string | null
    lesion_id?: IntNullableFilter | number | null
    image_trauma?: StringNullableFilter | string | null
    face?: StringNullableFilter | string | null
    lesion?: XOR<LesionRelationFilter, LesionWhereInput> | null
  }

  export type OptionOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    lesion_id?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    lesion?: LesionOrderByWithRelationInput
  }

  export type OptionWhereUniqueInput = {
    id?: number
  }

  export type OptionOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    lesion_id?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    _count?: OptionCountOrderByAggregateInput
    _avg?: OptionAvgOrderByAggregateInput
    _max?: OptionMaxOrderByAggregateInput
    _min?: OptionMinOrderByAggregateInput
    _sum?: OptionSumOrderByAggregateInput
  }

  export type OptionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<OptionScalarWhereWithAggregatesInput>
    OR?: Enumerable<OptionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<OptionScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    created_at?: DateTimeWithAggregatesFilter | Date | string
    name_fr?: StringNullableWithAggregatesFilter | string | null
    name_en?: StringNullableWithAggregatesFilter | string | null
    lesion_id?: IntNullableWithAggregatesFilter | number | null
    image_trauma?: StringNullableWithAggregatesFilter | string | null
    face?: StringNullableWithAggregatesFilter | string | null
  }

  export type SubmissionWhereInput = {
    AND?: Enumerable<SubmissionWhereInput>
    OR?: Enumerable<SubmissionWhereInput>
    NOT?: Enumerable<SubmissionWhereInput>
    id?: IntFilter | number
    created_at?: DateTimeFilter | Date | string
    updated_at?: DateTimeNullableFilter | Date | string | null
  }

  export type SubmissionOrderByWithRelationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubmissionWhereUniqueInput = {
    id?: number
  }

  export type SubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: SubmissionCountOrderByAggregateInput
    _avg?: SubmissionAvgOrderByAggregateInput
    _max?: SubmissionMaxOrderByAggregateInput
    _min?: SubmissionMinOrderByAggregateInput
    _sum?: SubmissionSumOrderByAggregateInput
  }

  export type SubmissionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SubmissionScalarWhereWithAggregatesInput>
    OR?: Enumerable<SubmissionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<SubmissionScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    created_at?: DateTimeWithAggregatesFilter | Date | string
    updated_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
  }

  export type LesionCreateInput = {
    name_fr?: string | null
    name_en?: string | null
    category_fr?: string | null
    category_en?: string | null
    image_fr?: string | null
    video_fr?: string | null
    macro_category_fr?: string | null
    multi_step?: boolean | null
    next_step?: string | null
    previous_step?: string | null
    image_en?: string | null
    video_en?: string | null
    image_trauma?: string | null
    face?: string | null
    has_options?: boolean
    options?: OptionCreateNestedManyWithoutLesionInput
  }

  export type LesionUncheckedCreateInput = {
    id?: number
    name_fr?: string | null
    name_en?: string | null
    category_fr?: string | null
    category_en?: string | null
    image_fr?: string | null
    video_fr?: string | null
    macro_category_fr?: string | null
    multi_step?: boolean | null
    next_step?: string | null
    previous_step?: string | null
    image_en?: string | null
    video_en?: string | null
    image_trauma?: string | null
    face?: string | null
    has_options?: boolean
    options?: OptionUncheckedCreateNestedManyWithoutLesionInput
  }

  export type LesionUpdateInput = {
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    category_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_fr?: NullableStringFieldUpdateOperationsInput | string | null
    video_fr?: NullableStringFieldUpdateOperationsInput | string | null
    macro_category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    multi_step?: NullableBoolFieldUpdateOperationsInput | boolean | null
    next_step?: NullableStringFieldUpdateOperationsInput | string | null
    previous_step?: NullableStringFieldUpdateOperationsInput | string | null
    image_en?: NullableStringFieldUpdateOperationsInput | string | null
    video_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    has_options?: BoolFieldUpdateOperationsInput | boolean
    options?: OptionUpdateManyWithoutLesionNestedInput
  }

  export type LesionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    category_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_fr?: NullableStringFieldUpdateOperationsInput | string | null
    video_fr?: NullableStringFieldUpdateOperationsInput | string | null
    macro_category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    multi_step?: NullableBoolFieldUpdateOperationsInput | boolean | null
    next_step?: NullableStringFieldUpdateOperationsInput | string | null
    previous_step?: NullableStringFieldUpdateOperationsInput | string | null
    image_en?: NullableStringFieldUpdateOperationsInput | string | null
    video_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    has_options?: BoolFieldUpdateOperationsInput | boolean
    options?: OptionUncheckedUpdateManyWithoutLesionNestedInput
  }

  export type LesionCreateManyInput = {
    id?: number
    name_fr?: string | null
    name_en?: string | null
    category_fr?: string | null
    category_en?: string | null
    image_fr?: string | null
    video_fr?: string | null
    macro_category_fr?: string | null
    multi_step?: boolean | null
    next_step?: string | null
    previous_step?: string | null
    image_en?: string | null
    video_en?: string | null
    image_trauma?: string | null
    face?: string | null
    has_options?: boolean
  }

  export type LesionUpdateManyMutationInput = {
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    category_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_fr?: NullableStringFieldUpdateOperationsInput | string | null
    video_fr?: NullableStringFieldUpdateOperationsInput | string | null
    macro_category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    multi_step?: NullableBoolFieldUpdateOperationsInput | boolean | null
    next_step?: NullableStringFieldUpdateOperationsInput | string | null
    previous_step?: NullableStringFieldUpdateOperationsInput | string | null
    image_en?: NullableStringFieldUpdateOperationsInput | string | null
    video_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    has_options?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LesionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    category_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_fr?: NullableStringFieldUpdateOperationsInput | string | null
    video_fr?: NullableStringFieldUpdateOperationsInput | string | null
    macro_category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    multi_step?: NullableBoolFieldUpdateOperationsInput | boolean | null
    next_step?: NullableStringFieldUpdateOperationsInput | string | null
    previous_step?: NullableStringFieldUpdateOperationsInput | string | null
    image_en?: NullableStringFieldUpdateOperationsInput | string | null
    video_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    has_options?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OptionCreateInput = {
    created_at?: Date | string
    name_fr?: string | null
    name_en?: string | null
    image_trauma?: string | null
    face?: string | null
    lesion?: LesionCreateNestedOneWithoutOptionsInput
  }

  export type OptionUncheckedCreateInput = {
    id?: number
    created_at?: Date | string
    name_fr?: string | null
    name_en?: string | null
    lesion_id?: number | null
    image_trauma?: string | null
    face?: string | null
  }

  export type OptionUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    lesion?: LesionUpdateOneWithoutOptionsNestedInput
  }

  export type OptionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    lesion_id?: NullableIntFieldUpdateOperationsInput | number | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OptionCreateManyInput = {
    id?: number
    created_at?: Date | string
    name_fr?: string | null
    name_en?: string | null
    lesion_id?: number | null
    image_trauma?: string | null
    face?: string | null
  }

  export type OptionUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OptionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    lesion_id?: NullableIntFieldUpdateOperationsInput | number | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubmissionCreateInput = {
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type SubmissionUncheckedCreateInput = {
    id?: number
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type SubmissionUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubmissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubmissionCreateManyInput = {
    id?: number
    created_at?: Date | string
    updated_at?: Date | string | null
  }

  export type SubmissionUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SubmissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type BoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type OptionListRelationFilter = {
    every?: OptionWhereInput
    some?: OptionWhereInput
    none?: OptionWhereInput
  }

  export type OptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LesionCountOrderByAggregateInput = {
    id?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    category_fr?: SortOrder
    category_en?: SortOrder
    image_fr?: SortOrder
    video_fr?: SortOrder
    macro_category_fr?: SortOrder
    multi_step?: SortOrder
    next_step?: SortOrder
    previous_step?: SortOrder
    image_en?: SortOrder
    video_en?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    has_options?: SortOrder
  }

  export type LesionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LesionMaxOrderByAggregateInput = {
    id?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    category_fr?: SortOrder
    category_en?: SortOrder
    image_fr?: SortOrder
    video_fr?: SortOrder
    macro_category_fr?: SortOrder
    multi_step?: SortOrder
    next_step?: SortOrder
    previous_step?: SortOrder
    image_en?: SortOrder
    video_en?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    has_options?: SortOrder
  }

  export type LesionMinOrderByAggregateInput = {
    id?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    category_fr?: SortOrder
    category_en?: SortOrder
    image_fr?: SortOrder
    video_fr?: SortOrder
    macro_category_fr?: SortOrder
    multi_step?: SortOrder
    next_step?: SortOrder
    previous_step?: SortOrder
    image_en?: SortOrder
    video_en?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
    has_options?: SortOrder
  }

  export type LesionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type BoolNullableWithAggregatesFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableWithAggregatesFilter | boolean | null
    _count?: NestedIntNullableFilter
    _min?: NestedBoolNullableFilter
    _max?: NestedBoolNullableFilter
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type LesionRelationFilter = {
    is?: LesionWhereInput | null
    isNot?: LesionWhereInput | null
  }

  export type OptionCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    lesion_id?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
  }

  export type OptionAvgOrderByAggregateInput = {
    id?: SortOrder
    lesion_id?: SortOrder
  }

  export type OptionMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    lesion_id?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
  }

  export type OptionMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    name_fr?: SortOrder
    name_en?: SortOrder
    lesion_id?: SortOrder
    image_trauma?: SortOrder
    face?: SortOrder
  }

  export type OptionSumOrderByAggregateInput = {
    id?: SortOrder
    lesion_id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type SubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubmissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type SubmissionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type OptionCreateNestedManyWithoutLesionInput = {
    create?: XOR<Enumerable<OptionCreateWithoutLesionInput>, Enumerable<OptionUncheckedCreateWithoutLesionInput>>
    connectOrCreate?: Enumerable<OptionCreateOrConnectWithoutLesionInput>
    createMany?: OptionCreateManyLesionInputEnvelope
    connect?: Enumerable<OptionWhereUniqueInput>
  }

  export type OptionUncheckedCreateNestedManyWithoutLesionInput = {
    create?: XOR<Enumerable<OptionCreateWithoutLesionInput>, Enumerable<OptionUncheckedCreateWithoutLesionInput>>
    connectOrCreate?: Enumerable<OptionCreateOrConnectWithoutLesionInput>
    createMany?: OptionCreateManyLesionInputEnvelope
    connect?: Enumerable<OptionWhereUniqueInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type OptionUpdateManyWithoutLesionNestedInput = {
    create?: XOR<Enumerable<OptionCreateWithoutLesionInput>, Enumerable<OptionUncheckedCreateWithoutLesionInput>>
    connectOrCreate?: Enumerable<OptionCreateOrConnectWithoutLesionInput>
    upsert?: Enumerable<OptionUpsertWithWhereUniqueWithoutLesionInput>
    createMany?: OptionCreateManyLesionInputEnvelope
    set?: Enumerable<OptionWhereUniqueInput>
    disconnect?: Enumerable<OptionWhereUniqueInput>
    delete?: Enumerable<OptionWhereUniqueInput>
    connect?: Enumerable<OptionWhereUniqueInput>
    update?: Enumerable<OptionUpdateWithWhereUniqueWithoutLesionInput>
    updateMany?: Enumerable<OptionUpdateManyWithWhereWithoutLesionInput>
    deleteMany?: Enumerable<OptionScalarWhereInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OptionUncheckedUpdateManyWithoutLesionNestedInput = {
    create?: XOR<Enumerable<OptionCreateWithoutLesionInput>, Enumerable<OptionUncheckedCreateWithoutLesionInput>>
    connectOrCreate?: Enumerable<OptionCreateOrConnectWithoutLesionInput>
    upsert?: Enumerable<OptionUpsertWithWhereUniqueWithoutLesionInput>
    createMany?: OptionCreateManyLesionInputEnvelope
    set?: Enumerable<OptionWhereUniqueInput>
    disconnect?: Enumerable<OptionWhereUniqueInput>
    delete?: Enumerable<OptionWhereUniqueInput>
    connect?: Enumerable<OptionWhereUniqueInput>
    update?: Enumerable<OptionUpdateWithWhereUniqueWithoutLesionInput>
    updateMany?: Enumerable<OptionUpdateManyWithWhereWithoutLesionInput>
    deleteMany?: Enumerable<OptionScalarWhereInput>
  }

  export type LesionCreateNestedOneWithoutOptionsInput = {
    create?: XOR<LesionCreateWithoutOptionsInput, LesionUncheckedCreateWithoutOptionsInput>
    connectOrCreate?: LesionCreateOrConnectWithoutOptionsInput
    connect?: LesionWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LesionUpdateOneWithoutOptionsNestedInput = {
    create?: XOR<LesionCreateWithoutOptionsInput, LesionUncheckedCreateWithoutOptionsInput>
    connectOrCreate?: LesionCreateOrConnectWithoutOptionsInput
    upsert?: LesionUpsertWithoutOptionsInput
    disconnect?: boolean
    delete?: boolean
    connect?: LesionWhereUniqueInput
    update?: XOR<LesionUpdateWithoutOptionsInput, LesionUncheckedUpdateWithoutOptionsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedBoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableWithAggregatesFilter | boolean | null
    _count?: NestedIntNullableFilter
    _min?: NestedBoolNullableFilter
    _max?: NestedBoolNullableFilter
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type OptionCreateWithoutLesionInput = {
    created_at?: Date | string
    name_fr?: string | null
    name_en?: string | null
    image_trauma?: string | null
    face?: string | null
  }

  export type OptionUncheckedCreateWithoutLesionInput = {
    id?: number
    created_at?: Date | string
    name_fr?: string | null
    name_en?: string | null
    image_trauma?: string | null
    face?: string | null
  }

  export type OptionCreateOrConnectWithoutLesionInput = {
    where: OptionWhereUniqueInput
    create: XOR<OptionCreateWithoutLesionInput, OptionUncheckedCreateWithoutLesionInput>
  }

  export type OptionCreateManyLesionInputEnvelope = {
    data: Enumerable<OptionCreateManyLesionInput>
    skipDuplicates?: boolean
  }

  export type OptionUpsertWithWhereUniqueWithoutLesionInput = {
    where: OptionWhereUniqueInput
    update: XOR<OptionUpdateWithoutLesionInput, OptionUncheckedUpdateWithoutLesionInput>
    create: XOR<OptionCreateWithoutLesionInput, OptionUncheckedCreateWithoutLesionInput>
  }

  export type OptionUpdateWithWhereUniqueWithoutLesionInput = {
    where: OptionWhereUniqueInput
    data: XOR<OptionUpdateWithoutLesionInput, OptionUncheckedUpdateWithoutLesionInput>
  }

  export type OptionUpdateManyWithWhereWithoutLesionInput = {
    where: OptionScalarWhereInput
    data: XOR<OptionUpdateManyMutationInput, OptionUncheckedUpdateManyWithoutOptionsInput>
  }

  export type OptionScalarWhereInput = {
    AND?: Enumerable<OptionScalarWhereInput>
    OR?: Enumerable<OptionScalarWhereInput>
    NOT?: Enumerable<OptionScalarWhereInput>
    id?: IntFilter | number
    created_at?: DateTimeFilter | Date | string
    name_fr?: StringNullableFilter | string | null
    name_en?: StringNullableFilter | string | null
    lesion_id?: IntNullableFilter | number | null
    image_trauma?: StringNullableFilter | string | null
    face?: StringNullableFilter | string | null
  }

  export type LesionCreateWithoutOptionsInput = {
    name_fr?: string | null
    name_en?: string | null
    category_fr?: string | null
    category_en?: string | null
    image_fr?: string | null
    video_fr?: string | null
    macro_category_fr?: string | null
    multi_step?: boolean | null
    next_step?: string | null
    previous_step?: string | null
    image_en?: string | null
    video_en?: string | null
    image_trauma?: string | null
    face?: string | null
    has_options?: boolean
  }

  export type LesionUncheckedCreateWithoutOptionsInput = {
    id?: number
    name_fr?: string | null
    name_en?: string | null
    category_fr?: string | null
    category_en?: string | null
    image_fr?: string | null
    video_fr?: string | null
    macro_category_fr?: string | null
    multi_step?: boolean | null
    next_step?: string | null
    previous_step?: string | null
    image_en?: string | null
    video_en?: string | null
    image_trauma?: string | null
    face?: string | null
    has_options?: boolean
  }

  export type LesionCreateOrConnectWithoutOptionsInput = {
    where: LesionWhereUniqueInput
    create: XOR<LesionCreateWithoutOptionsInput, LesionUncheckedCreateWithoutOptionsInput>
  }

  export type LesionUpsertWithoutOptionsInput = {
    update: XOR<LesionUpdateWithoutOptionsInput, LesionUncheckedUpdateWithoutOptionsInput>
    create: XOR<LesionCreateWithoutOptionsInput, LesionUncheckedCreateWithoutOptionsInput>
  }

  export type LesionUpdateWithoutOptionsInput = {
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    category_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_fr?: NullableStringFieldUpdateOperationsInput | string | null
    video_fr?: NullableStringFieldUpdateOperationsInput | string | null
    macro_category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    multi_step?: NullableBoolFieldUpdateOperationsInput | boolean | null
    next_step?: NullableStringFieldUpdateOperationsInput | string | null
    previous_step?: NullableStringFieldUpdateOperationsInput | string | null
    image_en?: NullableStringFieldUpdateOperationsInput | string | null
    video_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    has_options?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LesionUncheckedUpdateWithoutOptionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    category_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_fr?: NullableStringFieldUpdateOperationsInput | string | null
    video_fr?: NullableStringFieldUpdateOperationsInput | string | null
    macro_category_fr?: NullableStringFieldUpdateOperationsInput | string | null
    multi_step?: NullableBoolFieldUpdateOperationsInput | boolean | null
    next_step?: NullableStringFieldUpdateOperationsInput | string | null
    previous_step?: NullableStringFieldUpdateOperationsInput | string | null
    image_en?: NullableStringFieldUpdateOperationsInput | string | null
    video_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
    has_options?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OptionCreateManyLesionInput = {
    id?: number
    created_at?: Date | string
    name_fr?: string | null
    name_en?: string | null
    image_trauma?: string | null
    face?: string | null
  }

  export type OptionUpdateWithoutLesionInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OptionUncheckedUpdateWithoutLesionInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OptionUncheckedUpdateManyWithoutOptionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    name_fr?: NullableStringFieldUpdateOperationsInput | string | null
    name_en?: NullableStringFieldUpdateOperationsInput | string | null
    image_trauma?: NullableStringFieldUpdateOperationsInput | string | null
    face?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}