
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model AuctionPlayer
 * 
 */
export type AuctionPlayer = $Result.DefaultSelection<Prisma.$AuctionPlayerPayload>
/**
 * Model TeamPlayer
 * 
 */
export type TeamPlayer = $Result.DefaultSelection<Prisma.$TeamPlayerPayload>
/**
 * Model AuctionState
 * 
 */
export type AuctionState = $Result.DefaultSelection<Prisma.$AuctionStatePayload>
/**
 * Model AuctionSequence
 * 
 */
export type AuctionSequence = $Result.DefaultSelection<Prisma.$AuctionSequencePayload>
/**
 * Model PowerCard
 * 
 */
export type PowerCard = $Result.DefaultSelection<Prisma.$PowerCardPayload>
/**
 * Model Top11Selection
 * 
 */
export type Top11Selection = $Result.DefaultSelection<Prisma.$Top11SelectionPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Franchise
 * 
 */
export type Franchise = $Result.DefaultSelection<Prisma.$FranchisePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Category: {
  BAT: 'BAT',
  BOWL: 'BOWL',
  AR: 'AR',
  WK: 'WK'
};

export type Category = (typeof Category)[keyof typeof Category]


export const Pool: {
  BAT_WK: 'BAT_WK',
  BOWL: 'BOWL',
  AR: 'AR'
};

export type Pool = (typeof Pool)[keyof typeof Pool]


export const Grade: {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export type Grade = (typeof Grade)[keyof typeof Grade]


export const Nationality: {
  INDIAN: 'INDIAN',
  OVERSEAS: 'OVERSEAS'
};

export type Nationality = (typeof Nationality)[keyof typeof Nationality]


export const AuctionPhase: {
  NOT_STARTED: 'NOT_STARTED',
  FRANCHISE_PHASE: 'FRANCHISE_PHASE',
  POWER_CARD_PHASE: 'POWER_CARD_PHASE',
  LIVE: 'LIVE',
  POST_AUCTION: 'POST_AUCTION',
  COMPLETED: 'COMPLETED'
};

export type AuctionPhase = (typeof AuctionPhase)[keyof typeof AuctionPhase]


export const PlayerAuctionStatus: {
  UNSOLD: 'UNSOLD',
  SOLD: 'SOLD'
};

export type PlayerAuctionStatus = (typeof PlayerAuctionStatus)[keyof typeof PlayerAuctionStatus]


export const PowerCardType: {
  GOD_EYE: 'GOD_EYE',
  MULLIGAN: 'MULLIGAN',
  FINAL_STRIKE: 'FINAL_STRIKE',
  BID_FREEZER: 'BID_FREEZER',
  RIGHT_TO_MATCH: 'RIGHT_TO_MATCH'
};

export type PowerCardType = (typeof PowerCardType)[keyof typeof PowerCardType]

}

export type Category = $Enums.Category

export const Category: typeof $Enums.Category

export type Pool = $Enums.Pool

export const Pool: typeof $Enums.Pool

export type Grade = $Enums.Grade

export const Grade: typeof $Enums.Grade

export type Nationality = $Enums.Nationality

export const Nationality: typeof $Enums.Nationality

export type AuctionPhase = $Enums.AuctionPhase

export const AuctionPhase: typeof $Enums.AuctionPhase

export type PlayerAuctionStatus = $Enums.PlayerAuctionStatus

export const PlayerAuctionStatus: typeof $Enums.PlayerAuctionStatus

export type PowerCardType = $Enums.PowerCardType

export const PowerCardType: typeof $Enums.PowerCardType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Teams
 * const teams = await prisma.team.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Teams
   * const teams = await prisma.team.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionPlayer`: Exposes CRUD operations for the **AuctionPlayer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionPlayers
    * const auctionPlayers = await prisma.auctionPlayer.findMany()
    * ```
    */
  get auctionPlayer(): Prisma.AuctionPlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teamPlayer`: Exposes CRUD operations for the **TeamPlayer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamPlayers
    * const teamPlayers = await prisma.teamPlayer.findMany()
    * ```
    */
  get teamPlayer(): Prisma.TeamPlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionState`: Exposes CRUD operations for the **AuctionState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionStates
    * const auctionStates = await prisma.auctionState.findMany()
    * ```
    */
  get auctionState(): Prisma.AuctionStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auctionSequence`: Exposes CRUD operations for the **AuctionSequence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuctionSequences
    * const auctionSequences = await prisma.auctionSequence.findMany()
    * ```
    */
  get auctionSequence(): Prisma.AuctionSequenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.powerCard`: Exposes CRUD operations for the **PowerCard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PowerCards
    * const powerCards = await prisma.powerCard.findMany()
    * ```
    */
  get powerCard(): Prisma.PowerCardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.top11Selection`: Exposes CRUD operations for the **Top11Selection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Top11Selections
    * const top11Selections = await prisma.top11Selection.findMany()
    * ```
    */
  get top11Selection(): Prisma.Top11SelectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.franchise`: Exposes CRUD operations for the **Franchise** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Franchises
    * const franchises = await prisma.franchise.findMany()
    * ```
    */
  get franchise(): Prisma.FranchiseDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

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
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



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
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Team: 'Team',
    Player: 'Player',
    AuctionPlayer: 'AuctionPlayer',
    TeamPlayer: 'TeamPlayer',
    AuctionState: 'AuctionState',
    AuctionSequence: 'AuctionSequence',
    PowerCard: 'PowerCard',
    Top11Selection: 'Top11Selection',
    AuditLog: 'AuditLog',
    Franchise: 'Franchise'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "team" | "player" | "auctionPlayer" | "teamPlayer" | "auctionState" | "auctionSequence" | "powerCard" | "top11Selection" | "auditLog" | "franchise"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      AuctionPlayer: {
        payload: Prisma.$AuctionPlayerPayload<ExtArgs>
        fields: Prisma.AuctionPlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuctionPlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuctionPlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>
          }
          findFirst: {
            args: Prisma.AuctionPlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuctionPlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>
          }
          findMany: {
            args: Prisma.AuctionPlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>[]
          }
          create: {
            args: Prisma.AuctionPlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>
          }
          createMany: {
            args: Prisma.AuctionPlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuctionPlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>[]
          }
          delete: {
            args: Prisma.AuctionPlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>
          }
          update: {
            args: Prisma.AuctionPlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>
          }
          deleteMany: {
            args: Prisma.AuctionPlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuctionPlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuctionPlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>[]
          }
          upsert: {
            args: Prisma.AuctionPlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionPlayerPayload>
          }
          aggregate: {
            args: Prisma.AuctionPlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuctionPlayer>
          }
          groupBy: {
            args: Prisma.AuctionPlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuctionPlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuctionPlayerCountArgs<ExtArgs>
            result: $Utils.Optional<AuctionPlayerCountAggregateOutputType> | number
          }
        }
      }
      TeamPlayer: {
        payload: Prisma.$TeamPlayerPayload<ExtArgs>
        fields: Prisma.TeamPlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamPlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamPlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>
          }
          findFirst: {
            args: Prisma.TeamPlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamPlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>
          }
          findMany: {
            args: Prisma.TeamPlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>[]
          }
          create: {
            args: Prisma.TeamPlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>
          }
          createMany: {
            args: Prisma.TeamPlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamPlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>[]
          }
          delete: {
            args: Prisma.TeamPlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>
          }
          update: {
            args: Prisma.TeamPlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>
          }
          deleteMany: {
            args: Prisma.TeamPlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamPlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamPlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>[]
          }
          upsert: {
            args: Prisma.TeamPlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPlayerPayload>
          }
          aggregate: {
            args: Prisma.TeamPlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamPlayer>
          }
          groupBy: {
            args: Prisma.TeamPlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamPlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamPlayerCountArgs<ExtArgs>
            result: $Utils.Optional<TeamPlayerCountAggregateOutputType> | number
          }
        }
      }
      AuctionState: {
        payload: Prisma.$AuctionStatePayload<ExtArgs>
        fields: Prisma.AuctionStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuctionStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuctionStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>
          }
          findFirst: {
            args: Prisma.AuctionStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuctionStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>
          }
          findMany: {
            args: Prisma.AuctionStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>[]
          }
          create: {
            args: Prisma.AuctionStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>
          }
          createMany: {
            args: Prisma.AuctionStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuctionStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>[]
          }
          delete: {
            args: Prisma.AuctionStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>
          }
          update: {
            args: Prisma.AuctionStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>
          }
          deleteMany: {
            args: Prisma.AuctionStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuctionStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuctionStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>[]
          }
          upsert: {
            args: Prisma.AuctionStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionStatePayload>
          }
          aggregate: {
            args: Prisma.AuctionStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuctionState>
          }
          groupBy: {
            args: Prisma.AuctionStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuctionStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuctionStateCountArgs<ExtArgs>
            result: $Utils.Optional<AuctionStateCountAggregateOutputType> | number
          }
        }
      }
      AuctionSequence: {
        payload: Prisma.$AuctionSequencePayload<ExtArgs>
        fields: Prisma.AuctionSequenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuctionSequenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuctionSequenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>
          }
          findFirst: {
            args: Prisma.AuctionSequenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuctionSequenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>
          }
          findMany: {
            args: Prisma.AuctionSequenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>[]
          }
          create: {
            args: Prisma.AuctionSequenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>
          }
          createMany: {
            args: Prisma.AuctionSequenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuctionSequenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>[]
          }
          delete: {
            args: Prisma.AuctionSequenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>
          }
          update: {
            args: Prisma.AuctionSequenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>
          }
          deleteMany: {
            args: Prisma.AuctionSequenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuctionSequenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuctionSequenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>[]
          }
          upsert: {
            args: Prisma.AuctionSequenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuctionSequencePayload>
          }
          aggregate: {
            args: Prisma.AuctionSequenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuctionSequence>
          }
          groupBy: {
            args: Prisma.AuctionSequenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuctionSequenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuctionSequenceCountArgs<ExtArgs>
            result: $Utils.Optional<AuctionSequenceCountAggregateOutputType> | number
          }
        }
      }
      PowerCard: {
        payload: Prisma.$PowerCardPayload<ExtArgs>
        fields: Prisma.PowerCardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PowerCardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PowerCardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>
          }
          findFirst: {
            args: Prisma.PowerCardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PowerCardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>
          }
          findMany: {
            args: Prisma.PowerCardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>[]
          }
          create: {
            args: Prisma.PowerCardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>
          }
          createMany: {
            args: Prisma.PowerCardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PowerCardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>[]
          }
          delete: {
            args: Prisma.PowerCardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>
          }
          update: {
            args: Prisma.PowerCardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>
          }
          deleteMany: {
            args: Prisma.PowerCardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PowerCardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PowerCardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>[]
          }
          upsert: {
            args: Prisma.PowerCardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerCardPayload>
          }
          aggregate: {
            args: Prisma.PowerCardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePowerCard>
          }
          groupBy: {
            args: Prisma.PowerCardGroupByArgs<ExtArgs>
            result: $Utils.Optional<PowerCardGroupByOutputType>[]
          }
          count: {
            args: Prisma.PowerCardCountArgs<ExtArgs>
            result: $Utils.Optional<PowerCardCountAggregateOutputType> | number
          }
        }
      }
      Top11Selection: {
        payload: Prisma.$Top11SelectionPayload<ExtArgs>
        fields: Prisma.Top11SelectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Top11SelectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Top11SelectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>
          }
          findFirst: {
            args: Prisma.Top11SelectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Top11SelectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>
          }
          findMany: {
            args: Prisma.Top11SelectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>[]
          }
          create: {
            args: Prisma.Top11SelectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>
          }
          createMany: {
            args: Prisma.Top11SelectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.Top11SelectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>[]
          }
          delete: {
            args: Prisma.Top11SelectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>
          }
          update: {
            args: Prisma.Top11SelectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>
          }
          deleteMany: {
            args: Prisma.Top11SelectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Top11SelectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.Top11SelectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>[]
          }
          upsert: {
            args: Prisma.Top11SelectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Top11SelectionPayload>
          }
          aggregate: {
            args: Prisma.Top11SelectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTop11Selection>
          }
          groupBy: {
            args: Prisma.Top11SelectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<Top11SelectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.Top11SelectionCountArgs<ExtArgs>
            result: $Utils.Optional<Top11SelectionCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Franchise: {
        payload: Prisma.$FranchisePayload<ExtArgs>
        fields: Prisma.FranchiseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FranchiseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FranchiseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>
          }
          findFirst: {
            args: Prisma.FranchiseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FranchiseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>
          }
          findMany: {
            args: Prisma.FranchiseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>[]
          }
          create: {
            args: Prisma.FranchiseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>
          }
          createMany: {
            args: Prisma.FranchiseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FranchiseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>[]
          }
          delete: {
            args: Prisma.FranchiseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>
          }
          update: {
            args: Prisma.FranchiseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>
          }
          deleteMany: {
            args: Prisma.FranchiseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FranchiseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FranchiseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>[]
          }
          upsert: {
            args: Prisma.FranchiseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FranchisePayload>
          }
          aggregate: {
            args: Prisma.FranchiseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFranchise>
          }
          groupBy: {
            args: Prisma.FranchiseGroupByArgs<ExtArgs>
            result: $Utils.Optional<FranchiseGroupByOutputType>[]
          }
          count: {
            args: Prisma.FranchiseCountArgs<ExtArgs>
            result: $Utils.Optional<FranchiseCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    team?: TeamOmit
    player?: PlayerOmit
    auctionPlayer?: AuctionPlayerOmit
    teamPlayer?: TeamPlayerOmit
    auctionState?: AuctionStateOmit
    auctionSequence?: AuctionSequenceOmit
    powerCard?: PowerCardOmit
    top11Selection?: Top11SelectionOmit
    auditLog?: AuditLogOmit
    franchise?: FranchiseOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    team_players: number
    power_cards: number
    auction_players: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team_players?: boolean | TeamCountOutputTypeCountTeam_playersArgs
    power_cards?: boolean | TeamCountOutputTypeCountPower_cardsArgs
    auction_players?: boolean | TeamCountOutputTypeCountAuction_playersArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountTeam_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamPlayerWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountPower_cardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerCardWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountAuction_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionPlayerWhereInput
  }


  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    auction_players: number
    team_players: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction_players?: boolean | PlayerCountOutputTypeCountAuction_playersArgs
    team_players?: boolean | PlayerCountOutputTypeCountTeam_playersArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountAuction_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionPlayerWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountTeam_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamPlayerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamAvgAggregateOutputType = {
    brand_score: Decimal | null
    purse_remaining: Decimal | null
    squad_count: number | null
    overseas_count: number | null
    batsmen_count: number | null
    bowlers_count: number | null
    ar_count: number | null
    wk_count: number | null
  }

  export type TeamSumAggregateOutputType = {
    brand_score: Decimal | null
    purse_remaining: Decimal | null
    squad_count: number | null
    overseas_count: number | null
    batsmen_count: number | null
    bowlers_count: number | null
    ar_count: number | null
    wk_count: number | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    name: string | null
    password_hash: string | null
    active_session_id: string | null
    brand_key: string | null
    franchise_name: string | null
    brand_score: Decimal | null
    purse_remaining: Decimal | null
    squad_count: number | null
    overseas_count: number | null
    batsmen_count: number | null
    bowlers_count: number | null
    ar_count: number | null
    wk_count: number | null
    logo: string | null
    primary_color: string | null
    created_at: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    name: string | null
    password_hash: string | null
    active_session_id: string | null
    brand_key: string | null
    franchise_name: string | null
    brand_score: Decimal | null
    purse_remaining: Decimal | null
    squad_count: number | null
    overseas_count: number | null
    batsmen_count: number | null
    bowlers_count: number | null
    ar_count: number | null
    wk_count: number | null
    logo: string | null
    primary_color: string | null
    created_at: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    name: number
    password_hash: number
    active_session_id: number
    brand_key: number
    franchise_name: number
    brand_score: number
    purse_remaining: number
    squad_count: number
    overseas_count: number
    batsmen_count: number
    bowlers_count: number
    ar_count: number
    wk_count: number
    purchased_players: number
    logo: number
    primary_color: number
    created_at: number
    _all: number
  }


  export type TeamAvgAggregateInputType = {
    brand_score?: true
    purse_remaining?: true
    squad_count?: true
    overseas_count?: true
    batsmen_count?: true
    bowlers_count?: true
    ar_count?: true
    wk_count?: true
  }

  export type TeamSumAggregateInputType = {
    brand_score?: true
    purse_remaining?: true
    squad_count?: true
    overseas_count?: true
    batsmen_count?: true
    bowlers_count?: true
    ar_count?: true
    wk_count?: true
  }

  export type TeamMinAggregateInputType = {
    id?: true
    name?: true
    password_hash?: true
    active_session_id?: true
    brand_key?: true
    franchise_name?: true
    brand_score?: true
    purse_remaining?: true
    squad_count?: true
    overseas_count?: true
    batsmen_count?: true
    bowlers_count?: true
    ar_count?: true
    wk_count?: true
    logo?: true
    primary_color?: true
    created_at?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    name?: true
    password_hash?: true
    active_session_id?: true
    brand_key?: true
    franchise_name?: true
    brand_score?: true
    purse_remaining?: true
    squad_count?: true
    overseas_count?: true
    batsmen_count?: true
    bowlers_count?: true
    ar_count?: true
    wk_count?: true
    logo?: true
    primary_color?: true
    created_at?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    name?: true
    password_hash?: true
    active_session_id?: true
    brand_key?: true
    franchise_name?: true
    brand_score?: true
    purse_remaining?: true
    squad_count?: true
    overseas_count?: true
    batsmen_count?: true
    bowlers_count?: true
    ar_count?: true
    wk_count?: true
    purchased_players?: true
    logo?: true
    primary_color?: true
    created_at?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _avg?: TeamAvgAggregateInputType
    _sum?: TeamSumAggregateInputType
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    name: string
    password_hash: string
    active_session_id: string | null
    brand_key: string | null
    franchise_name: string | null
    brand_score: Decimal
    purse_remaining: Decimal
    squad_count: number
    overseas_count: number
    batsmen_count: number
    bowlers_count: number
    ar_count: number
    wk_count: number
    purchased_players: JsonValue
    logo: string | null
    primary_color: string | null
    created_at: Date
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    password_hash?: boolean
    active_session_id?: boolean
    brand_key?: boolean
    franchise_name?: boolean
    brand_score?: boolean
    purse_remaining?: boolean
    squad_count?: boolean
    overseas_count?: boolean
    batsmen_count?: boolean
    bowlers_count?: boolean
    ar_count?: boolean
    wk_count?: boolean
    purchased_players?: boolean
    logo?: boolean
    primary_color?: boolean
    created_at?: boolean
    team_players?: boolean | Team$team_playersArgs<ExtArgs>
    power_cards?: boolean | Team$power_cardsArgs<ExtArgs>
    top11_selection?: boolean | Team$top11_selectionArgs<ExtArgs>
    auction_players?: boolean | Team$auction_playersArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    password_hash?: boolean
    active_session_id?: boolean
    brand_key?: boolean
    franchise_name?: boolean
    brand_score?: boolean
    purse_remaining?: boolean
    squad_count?: boolean
    overseas_count?: boolean
    batsmen_count?: boolean
    bowlers_count?: boolean
    ar_count?: boolean
    wk_count?: boolean
    purchased_players?: boolean
    logo?: boolean
    primary_color?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    password_hash?: boolean
    active_session_id?: boolean
    brand_key?: boolean
    franchise_name?: boolean
    brand_score?: boolean
    purse_remaining?: boolean
    squad_count?: boolean
    overseas_count?: boolean
    batsmen_count?: boolean
    bowlers_count?: boolean
    ar_count?: boolean
    wk_count?: boolean
    purchased_players?: boolean
    logo?: boolean
    primary_color?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    name?: boolean
    password_hash?: boolean
    active_session_id?: boolean
    brand_key?: boolean
    franchise_name?: boolean
    brand_score?: boolean
    purse_remaining?: boolean
    squad_count?: boolean
    overseas_count?: boolean
    batsmen_count?: boolean
    bowlers_count?: boolean
    ar_count?: boolean
    wk_count?: boolean
    purchased_players?: boolean
    logo?: boolean
    primary_color?: boolean
    created_at?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "password_hash" | "active_session_id" | "brand_key" | "franchise_name" | "brand_score" | "purse_remaining" | "squad_count" | "overseas_count" | "batsmen_count" | "bowlers_count" | "ar_count" | "wk_count" | "purchased_players" | "logo" | "primary_color" | "created_at", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team_players?: boolean | Team$team_playersArgs<ExtArgs>
    power_cards?: boolean | Team$power_cardsArgs<ExtArgs>
    top11_selection?: boolean | Team$top11_selectionArgs<ExtArgs>
    auction_players?: boolean | Team$auction_playersArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      team_players: Prisma.$TeamPlayerPayload<ExtArgs>[]
      power_cards: Prisma.$PowerCardPayload<ExtArgs>[]
      top11_selection: Prisma.$Top11SelectionPayload<ExtArgs> | null
      auction_players: Prisma.$AuctionPlayerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      password_hash: string
      active_session_id: string | null
      brand_key: string | null
      franchise_name: string | null
      brand_score: Prisma.Decimal
      purse_remaining: Prisma.Decimal
      squad_count: number
      overseas_count: number
      batsmen_count: number
      bowlers_count: number
      ar_count: number
      wk_count: number
      purchased_players: Prisma.JsonValue
      logo: string | null
      primary_color: string | null
      created_at: Date
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
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
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team_players<T extends Team$team_playersArgs<ExtArgs> = {}>(args?: Subset<T, Team$team_playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    power_cards<T extends Team$power_cardsArgs<ExtArgs> = {}>(args?: Subset<T, Team$power_cardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    top11_selection<T extends Team$top11_selectionArgs<ExtArgs> = {}>(args?: Subset<T, Team$top11_selectionArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    auction_players<T extends Team$auction_playersArgs<ExtArgs> = {}>(args?: Subset<T, Team$auction_playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly name: FieldRef<"Team", 'String'>
    readonly password_hash: FieldRef<"Team", 'String'>
    readonly active_session_id: FieldRef<"Team", 'String'>
    readonly brand_key: FieldRef<"Team", 'String'>
    readonly franchise_name: FieldRef<"Team", 'String'>
    readonly brand_score: FieldRef<"Team", 'Decimal'>
    readonly purse_remaining: FieldRef<"Team", 'Decimal'>
    readonly squad_count: FieldRef<"Team", 'Int'>
    readonly overseas_count: FieldRef<"Team", 'Int'>
    readonly batsmen_count: FieldRef<"Team", 'Int'>
    readonly bowlers_count: FieldRef<"Team", 'Int'>
    readonly ar_count: FieldRef<"Team", 'Int'>
    readonly wk_count: FieldRef<"Team", 'Int'>
    readonly purchased_players: FieldRef<"Team", 'Json'>
    readonly logo: FieldRef<"Team", 'String'>
    readonly primary_color: FieldRef<"Team", 'String'>
    readonly created_at: FieldRef<"Team", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.team_players
   */
  export type Team$team_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    where?: TeamPlayerWhereInput
    orderBy?: TeamPlayerOrderByWithRelationInput | TeamPlayerOrderByWithRelationInput[]
    cursor?: TeamPlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamPlayerScalarFieldEnum | TeamPlayerScalarFieldEnum[]
  }

  /**
   * Team.power_cards
   */
  export type Team$power_cardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    where?: PowerCardWhereInput
    orderBy?: PowerCardOrderByWithRelationInput | PowerCardOrderByWithRelationInput[]
    cursor?: PowerCardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PowerCardScalarFieldEnum | PowerCardScalarFieldEnum[]
  }

  /**
   * Team.top11_selection
   */
  export type Team$top11_selectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    where?: Top11SelectionWhereInput
  }

  /**
   * Team.auction_players
   */
  export type Team$auction_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    where?: AuctionPlayerWhereInput
    orderBy?: AuctionPlayerOrderByWithRelationInput | AuctionPlayerOrderByWithRelationInput[]
    cursor?: AuctionPlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuctionPlayerScalarFieldEnum | AuctionPlayerScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    rank: number | null
    rating: number | null
    base_price: Decimal | null
    legacy: number | null
    matches: number | null
    bat_runs: number | null
    bat_sr: Decimal | null
    bat_average: Decimal | null
    bowl_wickets: number | null
    bowl_eco: Decimal | null
    bowl_avg: Decimal | null
    sub_experience: number | null
    sub_scoring: number | null
    sub_impact: number | null
    sub_consistency: number | null
    sub_wicket_taking: number | null
    sub_economy: number | null
    sub_efficiency: number | null
    sub_batting: number | null
    sub_bowling: number | null
    sub_versatility: number | null
  }

  export type PlayerSumAggregateOutputType = {
    rank: number | null
    rating: number | null
    base_price: Decimal | null
    legacy: number | null
    matches: number | null
    bat_runs: number | null
    bat_sr: Decimal | null
    bat_average: Decimal | null
    bowl_wickets: number | null
    bowl_eco: Decimal | null
    bowl_avg: Decimal | null
    sub_experience: number | null
    sub_scoring: number | null
    sub_impact: number | null
    sub_consistency: number | null
    sub_wicket_taking: number | null
    sub_economy: number | null
    sub_efficiency: number | null
    sub_batting: number | null
    sub_bowling: number | null
    sub_versatility: number | null
  }

  export type PlayerMinAggregateOutputType = {
    id: string | null
    rank: number | null
    name: string | null
    team: string | null
    role: string | null
    category: $Enums.Category | null
    pool: $Enums.Pool | null
    grade: $Enums.Grade | null
    rating: number | null
    nationality: $Enums.Nationality | null
    nationality_raw: string | null
    base_price: Decimal | null
    legacy: number | null
    url: string | null
    image_url: string | null
    is_riddle: boolean | null
    matches: number | null
    bat_runs: number | null
    bat_sr: Decimal | null
    bat_average: Decimal | null
    bowl_wickets: number | null
    bowl_eco: Decimal | null
    bowl_avg: Decimal | null
    sub_experience: number | null
    sub_scoring: number | null
    sub_impact: number | null
    sub_consistency: number | null
    sub_wicket_taking: number | null
    sub_economy: number | null
    sub_efficiency: number | null
    sub_batting: number | null
    sub_bowling: number | null
    sub_versatility: number | null
  }

  export type PlayerMaxAggregateOutputType = {
    id: string | null
    rank: number | null
    name: string | null
    team: string | null
    role: string | null
    category: $Enums.Category | null
    pool: $Enums.Pool | null
    grade: $Enums.Grade | null
    rating: number | null
    nationality: $Enums.Nationality | null
    nationality_raw: string | null
    base_price: Decimal | null
    legacy: number | null
    url: string | null
    image_url: string | null
    is_riddle: boolean | null
    matches: number | null
    bat_runs: number | null
    bat_sr: Decimal | null
    bat_average: Decimal | null
    bowl_wickets: number | null
    bowl_eco: Decimal | null
    bowl_avg: Decimal | null
    sub_experience: number | null
    sub_scoring: number | null
    sub_impact: number | null
    sub_consistency: number | null
    sub_wicket_taking: number | null
    sub_economy: number | null
    sub_efficiency: number | null
    sub_batting: number | null
    sub_bowling: number | null
    sub_versatility: number | null
  }

  export type PlayerCountAggregateOutputType = {
    id: number
    rank: number
    name: number
    team: number
    role: number
    category: number
    pool: number
    grade: number
    rating: number
    nationality: number
    nationality_raw: number
    base_price: number
    legacy: number
    url: number
    image_url: number
    is_riddle: number
    matches: number
    bat_runs: number
    bat_sr: number
    bat_average: number
    bowl_wickets: number
    bowl_eco: number
    bowl_avg: number
    sub_experience: number
    sub_scoring: number
    sub_impact: number
    sub_consistency: number
    sub_wicket_taking: number
    sub_economy: number
    sub_efficiency: number
    sub_batting: number
    sub_bowling: number
    sub_versatility: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    rank?: true
    rating?: true
    base_price?: true
    legacy?: true
    matches?: true
    bat_runs?: true
    bat_sr?: true
    bat_average?: true
    bowl_wickets?: true
    bowl_eco?: true
    bowl_avg?: true
    sub_experience?: true
    sub_scoring?: true
    sub_impact?: true
    sub_consistency?: true
    sub_wicket_taking?: true
    sub_economy?: true
    sub_efficiency?: true
    sub_batting?: true
    sub_bowling?: true
    sub_versatility?: true
  }

  export type PlayerSumAggregateInputType = {
    rank?: true
    rating?: true
    base_price?: true
    legacy?: true
    matches?: true
    bat_runs?: true
    bat_sr?: true
    bat_average?: true
    bowl_wickets?: true
    bowl_eco?: true
    bowl_avg?: true
    sub_experience?: true
    sub_scoring?: true
    sub_impact?: true
    sub_consistency?: true
    sub_wicket_taking?: true
    sub_economy?: true
    sub_efficiency?: true
    sub_batting?: true
    sub_bowling?: true
    sub_versatility?: true
  }

  export type PlayerMinAggregateInputType = {
    id?: true
    rank?: true
    name?: true
    team?: true
    role?: true
    category?: true
    pool?: true
    grade?: true
    rating?: true
    nationality?: true
    nationality_raw?: true
    base_price?: true
    legacy?: true
    url?: true
    image_url?: true
    is_riddle?: true
    matches?: true
    bat_runs?: true
    bat_sr?: true
    bat_average?: true
    bowl_wickets?: true
    bowl_eco?: true
    bowl_avg?: true
    sub_experience?: true
    sub_scoring?: true
    sub_impact?: true
    sub_consistency?: true
    sub_wicket_taking?: true
    sub_economy?: true
    sub_efficiency?: true
    sub_batting?: true
    sub_bowling?: true
    sub_versatility?: true
  }

  export type PlayerMaxAggregateInputType = {
    id?: true
    rank?: true
    name?: true
    team?: true
    role?: true
    category?: true
    pool?: true
    grade?: true
    rating?: true
    nationality?: true
    nationality_raw?: true
    base_price?: true
    legacy?: true
    url?: true
    image_url?: true
    is_riddle?: true
    matches?: true
    bat_runs?: true
    bat_sr?: true
    bat_average?: true
    bowl_wickets?: true
    bowl_eco?: true
    bowl_avg?: true
    sub_experience?: true
    sub_scoring?: true
    sub_impact?: true
    sub_consistency?: true
    sub_wicket_taking?: true
    sub_economy?: true
    sub_efficiency?: true
    sub_batting?: true
    sub_bowling?: true
    sub_versatility?: true
  }

  export type PlayerCountAggregateInputType = {
    id?: true
    rank?: true
    name?: true
    team?: true
    role?: true
    category?: true
    pool?: true
    grade?: true
    rating?: true
    nationality?: true
    nationality_raw?: true
    base_price?: true
    legacy?: true
    url?: true
    image_url?: true
    is_riddle?: true
    matches?: true
    bat_runs?: true
    bat_sr?: true
    bat_average?: true
    bowl_wickets?: true
    bowl_eco?: true
    bowl_avg?: true
    sub_experience?: true
    sub_scoring?: true
    sub_impact?: true
    sub_consistency?: true
    sub_wicket_taking?: true
    sub_economy?: true
    sub_efficiency?: true
    sub_batting?: true
    sub_bowling?: true
    sub_versatility?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    id: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw: string | null
    base_price: Decimal
    legacy: number
    url: string | null
    image_url: string | null
    is_riddle: boolean
    matches: number | null
    bat_runs: number | null
    bat_sr: Decimal | null
    bat_average: Decimal | null
    bowl_wickets: number | null
    bowl_eco: Decimal | null
    bowl_avg: Decimal | null
    sub_experience: number | null
    sub_scoring: number | null
    sub_impact: number | null
    sub_consistency: number | null
    sub_wicket_taking: number | null
    sub_economy: number | null
    sub_efficiency: number | null
    sub_batting: number | null
    sub_bowling: number | null
    sub_versatility: number | null
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rank?: boolean
    name?: boolean
    team?: boolean
    role?: boolean
    category?: boolean
    pool?: boolean
    grade?: boolean
    rating?: boolean
    nationality?: boolean
    nationality_raw?: boolean
    base_price?: boolean
    legacy?: boolean
    url?: boolean
    image_url?: boolean
    is_riddle?: boolean
    matches?: boolean
    bat_runs?: boolean
    bat_sr?: boolean
    bat_average?: boolean
    bowl_wickets?: boolean
    bowl_eco?: boolean
    bowl_avg?: boolean
    sub_experience?: boolean
    sub_scoring?: boolean
    sub_impact?: boolean
    sub_consistency?: boolean
    sub_wicket_taking?: boolean
    sub_economy?: boolean
    sub_efficiency?: boolean
    sub_batting?: boolean
    sub_bowling?: boolean
    sub_versatility?: boolean
    auction_players?: boolean | Player$auction_playersArgs<ExtArgs>
    team_players?: boolean | Player$team_playersArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rank?: boolean
    name?: boolean
    team?: boolean
    role?: boolean
    category?: boolean
    pool?: boolean
    grade?: boolean
    rating?: boolean
    nationality?: boolean
    nationality_raw?: boolean
    base_price?: boolean
    legacy?: boolean
    url?: boolean
    image_url?: boolean
    is_riddle?: boolean
    matches?: boolean
    bat_runs?: boolean
    bat_sr?: boolean
    bat_average?: boolean
    bowl_wickets?: boolean
    bowl_eco?: boolean
    bowl_avg?: boolean
    sub_experience?: boolean
    sub_scoring?: boolean
    sub_impact?: boolean
    sub_consistency?: boolean
    sub_wicket_taking?: boolean
    sub_economy?: boolean
    sub_efficiency?: boolean
    sub_batting?: boolean
    sub_bowling?: boolean
    sub_versatility?: boolean
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rank?: boolean
    name?: boolean
    team?: boolean
    role?: boolean
    category?: boolean
    pool?: boolean
    grade?: boolean
    rating?: boolean
    nationality?: boolean
    nationality_raw?: boolean
    base_price?: boolean
    legacy?: boolean
    url?: boolean
    image_url?: boolean
    is_riddle?: boolean
    matches?: boolean
    bat_runs?: boolean
    bat_sr?: boolean
    bat_average?: boolean
    bowl_wickets?: boolean
    bowl_eco?: boolean
    bowl_avg?: boolean
    sub_experience?: boolean
    sub_scoring?: boolean
    sub_impact?: boolean
    sub_consistency?: boolean
    sub_wicket_taking?: boolean
    sub_economy?: boolean
    sub_efficiency?: boolean
    sub_batting?: boolean
    sub_bowling?: boolean
    sub_versatility?: boolean
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    id?: boolean
    rank?: boolean
    name?: boolean
    team?: boolean
    role?: boolean
    category?: boolean
    pool?: boolean
    grade?: boolean
    rating?: boolean
    nationality?: boolean
    nationality_raw?: boolean
    base_price?: boolean
    legacy?: boolean
    url?: boolean
    image_url?: boolean
    is_riddle?: boolean
    matches?: boolean
    bat_runs?: boolean
    bat_sr?: boolean
    bat_average?: boolean
    bowl_wickets?: boolean
    bowl_eco?: boolean
    bowl_avg?: boolean
    sub_experience?: boolean
    sub_scoring?: boolean
    sub_impact?: boolean
    sub_consistency?: boolean
    sub_wicket_taking?: boolean
    sub_economy?: boolean
    sub_efficiency?: boolean
    sub_batting?: boolean
    sub_bowling?: boolean
    sub_versatility?: boolean
  }

  export type PlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rank" | "name" | "team" | "role" | "category" | "pool" | "grade" | "rating" | "nationality" | "nationality_raw" | "base_price" | "legacy" | "url" | "image_url" | "is_riddle" | "matches" | "bat_runs" | "bat_sr" | "bat_average" | "bowl_wickets" | "bowl_eco" | "bowl_avg" | "sub_experience" | "sub_scoring" | "sub_impact" | "sub_consistency" | "sub_wicket_taking" | "sub_economy" | "sub_efficiency" | "sub_batting" | "sub_bowling" | "sub_versatility", ExtArgs["result"]["player"]>
  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auction_players?: boolean | Player$auction_playersArgs<ExtArgs>
    team_players?: boolean | Player$team_playersArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      auction_players: Prisma.$AuctionPlayerPayload<ExtArgs>[]
      team_players: Prisma.$TeamPlayerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rank: number
      name: string
      team: string
      role: string
      category: $Enums.Category
      pool: $Enums.Pool
      grade: $Enums.Grade
      rating: number
      nationality: $Enums.Nationality
      nationality_raw: string | null
      base_price: Prisma.Decimal
      legacy: number
      url: string | null
      image_url: string | null
      is_riddle: boolean
      matches: number | null
      bat_runs: number | null
      bat_sr: Prisma.Decimal | null
      bat_average: Prisma.Decimal | null
      bowl_wickets: number | null
      bowl_eco: Prisma.Decimal | null
      bowl_avg: Prisma.Decimal | null
      sub_experience: number | null
      sub_scoring: number | null
      sub_impact: number | null
      sub_consistency: number | null
      sub_wicket_taking: number | null
      sub_economy: number | null
      sub_efficiency: number | null
      sub_batting: number | null
      sub_bowling: number | null
      sub_versatility: number | null
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {PlayerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
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
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auction_players<T extends Player$auction_playersArgs<ExtArgs> = {}>(args?: Subset<T, Player$auction_playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    team_players<T extends Player$team_playersArgs<ExtArgs> = {}>(args?: Subset<T, Player$team_playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */
  interface PlayerFieldRefs {
    readonly id: FieldRef<"Player", 'String'>
    readonly rank: FieldRef<"Player", 'Int'>
    readonly name: FieldRef<"Player", 'String'>
    readonly team: FieldRef<"Player", 'String'>
    readonly role: FieldRef<"Player", 'String'>
    readonly category: FieldRef<"Player", 'Category'>
    readonly pool: FieldRef<"Player", 'Pool'>
    readonly grade: FieldRef<"Player", 'Grade'>
    readonly rating: FieldRef<"Player", 'Int'>
    readonly nationality: FieldRef<"Player", 'Nationality'>
    readonly nationality_raw: FieldRef<"Player", 'String'>
    readonly base_price: FieldRef<"Player", 'Decimal'>
    readonly legacy: FieldRef<"Player", 'Int'>
    readonly url: FieldRef<"Player", 'String'>
    readonly image_url: FieldRef<"Player", 'String'>
    readonly is_riddle: FieldRef<"Player", 'Boolean'>
    readonly matches: FieldRef<"Player", 'Int'>
    readonly bat_runs: FieldRef<"Player", 'Int'>
    readonly bat_sr: FieldRef<"Player", 'Decimal'>
    readonly bat_average: FieldRef<"Player", 'Decimal'>
    readonly bowl_wickets: FieldRef<"Player", 'Int'>
    readonly bowl_eco: FieldRef<"Player", 'Decimal'>
    readonly bowl_avg: FieldRef<"Player", 'Decimal'>
    readonly sub_experience: FieldRef<"Player", 'Int'>
    readonly sub_scoring: FieldRef<"Player", 'Int'>
    readonly sub_impact: FieldRef<"Player", 'Int'>
    readonly sub_consistency: FieldRef<"Player", 'Int'>
    readonly sub_wicket_taking: FieldRef<"Player", 'Int'>
    readonly sub_economy: FieldRef<"Player", 'Int'>
    readonly sub_efficiency: FieldRef<"Player", 'Int'>
    readonly sub_batting: FieldRef<"Player", 'Int'>
    readonly sub_bowling: FieldRef<"Player", 'Int'>
    readonly sub_versatility: FieldRef<"Player", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player updateManyAndReturn
   */
  export type PlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to delete.
     */
    limit?: number
  }

  /**
   * Player.auction_players
   */
  export type Player$auction_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    where?: AuctionPlayerWhereInput
    orderBy?: AuctionPlayerOrderByWithRelationInput | AuctionPlayerOrderByWithRelationInput[]
    cursor?: AuctionPlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuctionPlayerScalarFieldEnum | AuctionPlayerScalarFieldEnum[]
  }

  /**
   * Player.team_players
   */
  export type Player$team_playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    where?: TeamPlayerWhereInput
    orderBy?: TeamPlayerOrderByWithRelationInput | TeamPlayerOrderByWithRelationInput[]
    cursor?: TeamPlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamPlayerScalarFieldEnum | TeamPlayerScalarFieldEnum[]
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model AuctionPlayer
   */

  export type AggregateAuctionPlayer = {
    _count: AuctionPlayerCountAggregateOutputType | null
    _avg: AuctionPlayerAvgAggregateOutputType | null
    _sum: AuctionPlayerSumAggregateOutputType | null
    _min: AuctionPlayerMinAggregateOutputType | null
    _max: AuctionPlayerMaxAggregateOutputType | null
  }

  export type AuctionPlayerAvgAggregateOutputType = {
    sold_price: Decimal | null
  }

  export type AuctionPlayerSumAggregateOutputType = {
    sold_price: Decimal | null
  }

  export type AuctionPlayerMinAggregateOutputType = {
    id: string | null
    player_id: string | null
    status: $Enums.PlayerAuctionStatus | null
    sold_price: Decimal | null
    sold_to_team_id: string | null
  }

  export type AuctionPlayerMaxAggregateOutputType = {
    id: string | null
    player_id: string | null
    status: $Enums.PlayerAuctionStatus | null
    sold_price: Decimal | null
    sold_to_team_id: string | null
  }

  export type AuctionPlayerCountAggregateOutputType = {
    id: number
    player_id: number
    status: number
    sold_price: number
    sold_to_team_id: number
    _all: number
  }


  export type AuctionPlayerAvgAggregateInputType = {
    sold_price?: true
  }

  export type AuctionPlayerSumAggregateInputType = {
    sold_price?: true
  }

  export type AuctionPlayerMinAggregateInputType = {
    id?: true
    player_id?: true
    status?: true
    sold_price?: true
    sold_to_team_id?: true
  }

  export type AuctionPlayerMaxAggregateInputType = {
    id?: true
    player_id?: true
    status?: true
    sold_price?: true
    sold_to_team_id?: true
  }

  export type AuctionPlayerCountAggregateInputType = {
    id?: true
    player_id?: true
    status?: true
    sold_price?: true
    sold_to_team_id?: true
    _all?: true
  }

  export type AuctionPlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionPlayer to aggregate.
     */
    where?: AuctionPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionPlayers to fetch.
     */
    orderBy?: AuctionPlayerOrderByWithRelationInput | AuctionPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuctionPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuctionPlayers
    **/
    _count?: true | AuctionPlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuctionPlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuctionPlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuctionPlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuctionPlayerMaxAggregateInputType
  }

  export type GetAuctionPlayerAggregateType<T extends AuctionPlayerAggregateArgs> = {
        [P in keyof T & keyof AggregateAuctionPlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuctionPlayer[P]>
      : GetScalarType<T[P], AggregateAuctionPlayer[P]>
  }




  export type AuctionPlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionPlayerWhereInput
    orderBy?: AuctionPlayerOrderByWithAggregationInput | AuctionPlayerOrderByWithAggregationInput[]
    by: AuctionPlayerScalarFieldEnum[] | AuctionPlayerScalarFieldEnum
    having?: AuctionPlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuctionPlayerCountAggregateInputType | true
    _avg?: AuctionPlayerAvgAggregateInputType
    _sum?: AuctionPlayerSumAggregateInputType
    _min?: AuctionPlayerMinAggregateInputType
    _max?: AuctionPlayerMaxAggregateInputType
  }

  export type AuctionPlayerGroupByOutputType = {
    id: string
    player_id: string
    status: $Enums.PlayerAuctionStatus
    sold_price: Decimal | null
    sold_to_team_id: string | null
    _count: AuctionPlayerCountAggregateOutputType | null
    _avg: AuctionPlayerAvgAggregateOutputType | null
    _sum: AuctionPlayerSumAggregateOutputType | null
    _min: AuctionPlayerMinAggregateOutputType | null
    _max: AuctionPlayerMaxAggregateOutputType | null
  }

  type GetAuctionPlayerGroupByPayload<T extends AuctionPlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuctionPlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuctionPlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuctionPlayerGroupByOutputType[P]>
            : GetScalarType<T[P], AuctionPlayerGroupByOutputType[P]>
        }
      >
    >


  export type AuctionPlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    player_id?: boolean
    status?: boolean
    sold_price?: boolean
    sold_to_team_id?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    sold_to_team?: boolean | AuctionPlayer$sold_to_teamArgs<ExtArgs>
  }, ExtArgs["result"]["auctionPlayer"]>

  export type AuctionPlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    player_id?: boolean
    status?: boolean
    sold_price?: boolean
    sold_to_team_id?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    sold_to_team?: boolean | AuctionPlayer$sold_to_teamArgs<ExtArgs>
  }, ExtArgs["result"]["auctionPlayer"]>

  export type AuctionPlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    player_id?: boolean
    status?: boolean
    sold_price?: boolean
    sold_to_team_id?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    sold_to_team?: boolean | AuctionPlayer$sold_to_teamArgs<ExtArgs>
  }, ExtArgs["result"]["auctionPlayer"]>

  export type AuctionPlayerSelectScalar = {
    id?: boolean
    player_id?: boolean
    status?: boolean
    sold_price?: boolean
    sold_to_team_id?: boolean
  }

  export type AuctionPlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "player_id" | "status" | "sold_price" | "sold_to_team_id", ExtArgs["result"]["auctionPlayer"]>
  export type AuctionPlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    sold_to_team?: boolean | AuctionPlayer$sold_to_teamArgs<ExtArgs>
  }
  export type AuctionPlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    sold_to_team?: boolean | AuctionPlayer$sold_to_teamArgs<ExtArgs>
  }
  export type AuctionPlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    sold_to_team?: boolean | AuctionPlayer$sold_to_teamArgs<ExtArgs>
  }

  export type $AuctionPlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuctionPlayer"
    objects: {
      player: Prisma.$PlayerPayload<ExtArgs>
      sold_to_team: Prisma.$TeamPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      player_id: string
      status: $Enums.PlayerAuctionStatus
      sold_price: Prisma.Decimal | null
      sold_to_team_id: string | null
    }, ExtArgs["result"]["auctionPlayer"]>
    composites: {}
  }

  type AuctionPlayerGetPayload<S extends boolean | null | undefined | AuctionPlayerDefaultArgs> = $Result.GetResult<Prisma.$AuctionPlayerPayload, S>

  type AuctionPlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuctionPlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuctionPlayerCountAggregateInputType | true
    }

  export interface AuctionPlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuctionPlayer'], meta: { name: 'AuctionPlayer' } }
    /**
     * Find zero or one AuctionPlayer that matches the filter.
     * @param {AuctionPlayerFindUniqueArgs} args - Arguments to find a AuctionPlayer
     * @example
     * // Get one AuctionPlayer
     * const auctionPlayer = await prisma.auctionPlayer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuctionPlayerFindUniqueArgs>(args: SelectSubset<T, AuctionPlayerFindUniqueArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuctionPlayer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuctionPlayerFindUniqueOrThrowArgs} args - Arguments to find a AuctionPlayer
     * @example
     * // Get one AuctionPlayer
     * const auctionPlayer = await prisma.auctionPlayer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuctionPlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, AuctionPlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionPlayer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerFindFirstArgs} args - Arguments to find a AuctionPlayer
     * @example
     * // Get one AuctionPlayer
     * const auctionPlayer = await prisma.auctionPlayer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuctionPlayerFindFirstArgs>(args?: SelectSubset<T, AuctionPlayerFindFirstArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionPlayer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerFindFirstOrThrowArgs} args - Arguments to find a AuctionPlayer
     * @example
     * // Get one AuctionPlayer
     * const auctionPlayer = await prisma.auctionPlayer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuctionPlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, AuctionPlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuctionPlayers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuctionPlayers
     * const auctionPlayers = await prisma.auctionPlayer.findMany()
     * 
     * // Get first 10 AuctionPlayers
     * const auctionPlayers = await prisma.auctionPlayer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auctionPlayerWithIdOnly = await prisma.auctionPlayer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuctionPlayerFindManyArgs>(args?: SelectSubset<T, AuctionPlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuctionPlayer.
     * @param {AuctionPlayerCreateArgs} args - Arguments to create a AuctionPlayer.
     * @example
     * // Create one AuctionPlayer
     * const AuctionPlayer = await prisma.auctionPlayer.create({
     *   data: {
     *     // ... data to create a AuctionPlayer
     *   }
     * })
     * 
     */
    create<T extends AuctionPlayerCreateArgs>(args: SelectSubset<T, AuctionPlayerCreateArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuctionPlayers.
     * @param {AuctionPlayerCreateManyArgs} args - Arguments to create many AuctionPlayers.
     * @example
     * // Create many AuctionPlayers
     * const auctionPlayer = await prisma.auctionPlayer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuctionPlayerCreateManyArgs>(args?: SelectSubset<T, AuctionPlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuctionPlayers and returns the data saved in the database.
     * @param {AuctionPlayerCreateManyAndReturnArgs} args - Arguments to create many AuctionPlayers.
     * @example
     * // Create many AuctionPlayers
     * const auctionPlayer = await prisma.auctionPlayer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuctionPlayers and only return the `id`
     * const auctionPlayerWithIdOnly = await prisma.auctionPlayer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuctionPlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, AuctionPlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuctionPlayer.
     * @param {AuctionPlayerDeleteArgs} args - Arguments to delete one AuctionPlayer.
     * @example
     * // Delete one AuctionPlayer
     * const AuctionPlayer = await prisma.auctionPlayer.delete({
     *   where: {
     *     // ... filter to delete one AuctionPlayer
     *   }
     * })
     * 
     */
    delete<T extends AuctionPlayerDeleteArgs>(args: SelectSubset<T, AuctionPlayerDeleteArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuctionPlayer.
     * @param {AuctionPlayerUpdateArgs} args - Arguments to update one AuctionPlayer.
     * @example
     * // Update one AuctionPlayer
     * const auctionPlayer = await prisma.auctionPlayer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuctionPlayerUpdateArgs>(args: SelectSubset<T, AuctionPlayerUpdateArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuctionPlayers.
     * @param {AuctionPlayerDeleteManyArgs} args - Arguments to filter AuctionPlayers to delete.
     * @example
     * // Delete a few AuctionPlayers
     * const { count } = await prisma.auctionPlayer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuctionPlayerDeleteManyArgs>(args?: SelectSubset<T, AuctionPlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuctionPlayers
     * const auctionPlayer = await prisma.auctionPlayer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuctionPlayerUpdateManyArgs>(args: SelectSubset<T, AuctionPlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionPlayers and returns the data updated in the database.
     * @param {AuctionPlayerUpdateManyAndReturnArgs} args - Arguments to update many AuctionPlayers.
     * @example
     * // Update many AuctionPlayers
     * const auctionPlayer = await prisma.auctionPlayer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuctionPlayers and only return the `id`
     * const auctionPlayerWithIdOnly = await prisma.auctionPlayer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuctionPlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, AuctionPlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuctionPlayer.
     * @param {AuctionPlayerUpsertArgs} args - Arguments to update or create a AuctionPlayer.
     * @example
     * // Update or create a AuctionPlayer
     * const auctionPlayer = await prisma.auctionPlayer.upsert({
     *   create: {
     *     // ... data to create a AuctionPlayer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuctionPlayer we want to update
     *   }
     * })
     */
    upsert<T extends AuctionPlayerUpsertArgs>(args: SelectSubset<T, AuctionPlayerUpsertArgs<ExtArgs>>): Prisma__AuctionPlayerClient<$Result.GetResult<Prisma.$AuctionPlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuctionPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerCountArgs} args - Arguments to filter AuctionPlayers to count.
     * @example
     * // Count the number of AuctionPlayers
     * const count = await prisma.auctionPlayer.count({
     *   where: {
     *     // ... the filter for the AuctionPlayers we want to count
     *   }
     * })
    **/
    count<T extends AuctionPlayerCountArgs>(
      args?: Subset<T, AuctionPlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuctionPlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuctionPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuctionPlayerAggregateArgs>(args: Subset<T, AuctionPlayerAggregateArgs>): Prisma.PrismaPromise<GetAuctionPlayerAggregateType<T>>

    /**
     * Group by AuctionPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionPlayerGroupByArgs} args - Group by arguments.
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
      T extends AuctionPlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuctionPlayerGroupByArgs['orderBy'] }
        : { orderBy?: AuctionPlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AuctionPlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuctionPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuctionPlayer model
   */
  readonly fields: AuctionPlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuctionPlayer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuctionPlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sold_to_team<T extends AuctionPlayer$sold_to_teamArgs<ExtArgs> = {}>(args?: Subset<T, AuctionPlayer$sold_to_teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuctionPlayer model
   */
  interface AuctionPlayerFieldRefs {
    readonly id: FieldRef<"AuctionPlayer", 'String'>
    readonly player_id: FieldRef<"AuctionPlayer", 'String'>
    readonly status: FieldRef<"AuctionPlayer", 'PlayerAuctionStatus'>
    readonly sold_price: FieldRef<"AuctionPlayer", 'Decimal'>
    readonly sold_to_team_id: FieldRef<"AuctionPlayer", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuctionPlayer findUnique
   */
  export type AuctionPlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * Filter, which AuctionPlayer to fetch.
     */
    where: AuctionPlayerWhereUniqueInput
  }

  /**
   * AuctionPlayer findUniqueOrThrow
   */
  export type AuctionPlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * Filter, which AuctionPlayer to fetch.
     */
    where: AuctionPlayerWhereUniqueInput
  }

  /**
   * AuctionPlayer findFirst
   */
  export type AuctionPlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * Filter, which AuctionPlayer to fetch.
     */
    where?: AuctionPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionPlayers to fetch.
     */
    orderBy?: AuctionPlayerOrderByWithRelationInput | AuctionPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionPlayers.
     */
    cursor?: AuctionPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionPlayers.
     */
    distinct?: AuctionPlayerScalarFieldEnum | AuctionPlayerScalarFieldEnum[]
  }

  /**
   * AuctionPlayer findFirstOrThrow
   */
  export type AuctionPlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * Filter, which AuctionPlayer to fetch.
     */
    where?: AuctionPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionPlayers to fetch.
     */
    orderBy?: AuctionPlayerOrderByWithRelationInput | AuctionPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionPlayers.
     */
    cursor?: AuctionPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionPlayers.
     */
    distinct?: AuctionPlayerScalarFieldEnum | AuctionPlayerScalarFieldEnum[]
  }

  /**
   * AuctionPlayer findMany
   */
  export type AuctionPlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * Filter, which AuctionPlayers to fetch.
     */
    where?: AuctionPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionPlayers to fetch.
     */
    orderBy?: AuctionPlayerOrderByWithRelationInput | AuctionPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuctionPlayers.
     */
    cursor?: AuctionPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionPlayers.
     */
    skip?: number
    distinct?: AuctionPlayerScalarFieldEnum | AuctionPlayerScalarFieldEnum[]
  }

  /**
   * AuctionPlayer create
   */
  export type AuctionPlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a AuctionPlayer.
     */
    data: XOR<AuctionPlayerCreateInput, AuctionPlayerUncheckedCreateInput>
  }

  /**
   * AuctionPlayer createMany
   */
  export type AuctionPlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuctionPlayers.
     */
    data: AuctionPlayerCreateManyInput | AuctionPlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuctionPlayer createManyAndReturn
   */
  export type AuctionPlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * The data used to create many AuctionPlayers.
     */
    data: AuctionPlayerCreateManyInput | AuctionPlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuctionPlayer update
   */
  export type AuctionPlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a AuctionPlayer.
     */
    data: XOR<AuctionPlayerUpdateInput, AuctionPlayerUncheckedUpdateInput>
    /**
     * Choose, which AuctionPlayer to update.
     */
    where: AuctionPlayerWhereUniqueInput
  }

  /**
   * AuctionPlayer updateMany
   */
  export type AuctionPlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuctionPlayers.
     */
    data: XOR<AuctionPlayerUpdateManyMutationInput, AuctionPlayerUncheckedUpdateManyInput>
    /**
     * Filter which AuctionPlayers to update
     */
    where?: AuctionPlayerWhereInput
    /**
     * Limit how many AuctionPlayers to update.
     */
    limit?: number
  }

  /**
   * AuctionPlayer updateManyAndReturn
   */
  export type AuctionPlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * The data used to update AuctionPlayers.
     */
    data: XOR<AuctionPlayerUpdateManyMutationInput, AuctionPlayerUncheckedUpdateManyInput>
    /**
     * Filter which AuctionPlayers to update
     */
    where?: AuctionPlayerWhereInput
    /**
     * Limit how many AuctionPlayers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuctionPlayer upsert
   */
  export type AuctionPlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the AuctionPlayer to update in case it exists.
     */
    where: AuctionPlayerWhereUniqueInput
    /**
     * In case the AuctionPlayer found by the `where` argument doesn't exist, create a new AuctionPlayer with this data.
     */
    create: XOR<AuctionPlayerCreateInput, AuctionPlayerUncheckedCreateInput>
    /**
     * In case the AuctionPlayer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuctionPlayerUpdateInput, AuctionPlayerUncheckedUpdateInput>
  }

  /**
   * AuctionPlayer delete
   */
  export type AuctionPlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
    /**
     * Filter which AuctionPlayer to delete.
     */
    where: AuctionPlayerWhereUniqueInput
  }

  /**
   * AuctionPlayer deleteMany
   */
  export type AuctionPlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionPlayers to delete
     */
    where?: AuctionPlayerWhereInput
    /**
     * Limit how many AuctionPlayers to delete.
     */
    limit?: number
  }

  /**
   * AuctionPlayer.sold_to_team
   */
  export type AuctionPlayer$sold_to_teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * AuctionPlayer without action
   */
  export type AuctionPlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionPlayer
     */
    select?: AuctionPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionPlayer
     */
    omit?: AuctionPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuctionPlayerInclude<ExtArgs> | null
  }


  /**
   * Model TeamPlayer
   */

  export type AggregateTeamPlayer = {
    _count: TeamPlayerCountAggregateOutputType | null
    _avg: TeamPlayerAvgAggregateOutputType | null
    _sum: TeamPlayerSumAggregateOutputType | null
    _min: TeamPlayerMinAggregateOutputType | null
    _max: TeamPlayerMaxAggregateOutputType | null
  }

  export type TeamPlayerAvgAggregateOutputType = {
    price_paid: Decimal | null
  }

  export type TeamPlayerSumAggregateOutputType = {
    price_paid: Decimal | null
  }

  export type TeamPlayerMinAggregateOutputType = {
    id: string | null
    team_id: string | null
    player_id: string | null
    price_paid: Decimal | null
  }

  export type TeamPlayerMaxAggregateOutputType = {
    id: string | null
    team_id: string | null
    player_id: string | null
    price_paid: Decimal | null
  }

  export type TeamPlayerCountAggregateOutputType = {
    id: number
    team_id: number
    player_id: number
    price_paid: number
    _all: number
  }


  export type TeamPlayerAvgAggregateInputType = {
    price_paid?: true
  }

  export type TeamPlayerSumAggregateInputType = {
    price_paid?: true
  }

  export type TeamPlayerMinAggregateInputType = {
    id?: true
    team_id?: true
    player_id?: true
    price_paid?: true
  }

  export type TeamPlayerMaxAggregateInputType = {
    id?: true
    team_id?: true
    player_id?: true
    price_paid?: true
  }

  export type TeamPlayerCountAggregateInputType = {
    id?: true
    team_id?: true
    player_id?: true
    price_paid?: true
    _all?: true
  }

  export type TeamPlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamPlayer to aggregate.
     */
    where?: TeamPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: TeamPlayerOrderByWithRelationInput | TeamPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamPlayers
    **/
    _count?: true | TeamPlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamPlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamPlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamPlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamPlayerMaxAggregateInputType
  }

  export type GetTeamPlayerAggregateType<T extends TeamPlayerAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamPlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamPlayer[P]>
      : GetScalarType<T[P], AggregateTeamPlayer[P]>
  }




  export type TeamPlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamPlayerWhereInput
    orderBy?: TeamPlayerOrderByWithAggregationInput | TeamPlayerOrderByWithAggregationInput[]
    by: TeamPlayerScalarFieldEnum[] | TeamPlayerScalarFieldEnum
    having?: TeamPlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamPlayerCountAggregateInputType | true
    _avg?: TeamPlayerAvgAggregateInputType
    _sum?: TeamPlayerSumAggregateInputType
    _min?: TeamPlayerMinAggregateInputType
    _max?: TeamPlayerMaxAggregateInputType
  }

  export type TeamPlayerGroupByOutputType = {
    id: string
    team_id: string
    player_id: string
    price_paid: Decimal
    _count: TeamPlayerCountAggregateOutputType | null
    _avg: TeamPlayerAvgAggregateOutputType | null
    _sum: TeamPlayerSumAggregateOutputType | null
    _min: TeamPlayerMinAggregateOutputType | null
    _max: TeamPlayerMaxAggregateOutputType | null
  }

  type GetTeamPlayerGroupByPayload<T extends TeamPlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamPlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamPlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamPlayerGroupByOutputType[P]>
            : GetScalarType<T[P], TeamPlayerGroupByOutputType[P]>
        }
      >
    >


  export type TeamPlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    player_id?: boolean
    price_paid?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamPlayer"]>

  export type TeamPlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    player_id?: boolean
    price_paid?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamPlayer"]>

  export type TeamPlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    player_id?: boolean
    price_paid?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamPlayer"]>

  export type TeamPlayerSelectScalar = {
    id?: boolean
    team_id?: boolean
    player_id?: boolean
    price_paid?: boolean
  }

  export type TeamPlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "team_id" | "player_id" | "price_paid", ExtArgs["result"]["teamPlayer"]>
  export type TeamPlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type TeamPlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type TeamPlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }

  export type $TeamPlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamPlayer"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
      player: Prisma.$PlayerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      team_id: string
      player_id: string
      price_paid: Prisma.Decimal
    }, ExtArgs["result"]["teamPlayer"]>
    composites: {}
  }

  type TeamPlayerGetPayload<S extends boolean | null | undefined | TeamPlayerDefaultArgs> = $Result.GetResult<Prisma.$TeamPlayerPayload, S>

  type TeamPlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamPlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamPlayerCountAggregateInputType | true
    }

  export interface TeamPlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamPlayer'], meta: { name: 'TeamPlayer' } }
    /**
     * Find zero or one TeamPlayer that matches the filter.
     * @param {TeamPlayerFindUniqueArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamPlayerFindUniqueArgs>(args: SelectSubset<T, TeamPlayerFindUniqueArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TeamPlayer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamPlayerFindUniqueOrThrowArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamPlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamPlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamPlayer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerFindFirstArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamPlayerFindFirstArgs>(args?: SelectSubset<T, TeamPlayerFindFirstArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamPlayer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerFindFirstOrThrowArgs} args - Arguments to find a TeamPlayer
     * @example
     * // Get one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamPlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamPlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TeamPlayers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamPlayers
     * const teamPlayers = await prisma.teamPlayer.findMany()
     * 
     * // Get first 10 TeamPlayers
     * const teamPlayers = await prisma.teamPlayer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamPlayerWithIdOnly = await prisma.teamPlayer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamPlayerFindManyArgs>(args?: SelectSubset<T, TeamPlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TeamPlayer.
     * @param {TeamPlayerCreateArgs} args - Arguments to create a TeamPlayer.
     * @example
     * // Create one TeamPlayer
     * const TeamPlayer = await prisma.teamPlayer.create({
     *   data: {
     *     // ... data to create a TeamPlayer
     *   }
     * })
     * 
     */
    create<T extends TeamPlayerCreateArgs>(args: SelectSubset<T, TeamPlayerCreateArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TeamPlayers.
     * @param {TeamPlayerCreateManyArgs} args - Arguments to create many TeamPlayers.
     * @example
     * // Create many TeamPlayers
     * const teamPlayer = await prisma.teamPlayer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamPlayerCreateManyArgs>(args?: SelectSubset<T, TeamPlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamPlayers and returns the data saved in the database.
     * @param {TeamPlayerCreateManyAndReturnArgs} args - Arguments to create many TeamPlayers.
     * @example
     * // Create many TeamPlayers
     * const teamPlayer = await prisma.teamPlayer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamPlayers and only return the `id`
     * const teamPlayerWithIdOnly = await prisma.teamPlayer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamPlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamPlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TeamPlayer.
     * @param {TeamPlayerDeleteArgs} args - Arguments to delete one TeamPlayer.
     * @example
     * // Delete one TeamPlayer
     * const TeamPlayer = await prisma.teamPlayer.delete({
     *   where: {
     *     // ... filter to delete one TeamPlayer
     *   }
     * })
     * 
     */
    delete<T extends TeamPlayerDeleteArgs>(args: SelectSubset<T, TeamPlayerDeleteArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TeamPlayer.
     * @param {TeamPlayerUpdateArgs} args - Arguments to update one TeamPlayer.
     * @example
     * // Update one TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamPlayerUpdateArgs>(args: SelectSubset<T, TeamPlayerUpdateArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TeamPlayers.
     * @param {TeamPlayerDeleteManyArgs} args - Arguments to filter TeamPlayers to delete.
     * @example
     * // Delete a few TeamPlayers
     * const { count } = await prisma.teamPlayer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamPlayerDeleteManyArgs>(args?: SelectSubset<T, TeamPlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamPlayers
     * const teamPlayer = await prisma.teamPlayer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamPlayerUpdateManyArgs>(args: SelectSubset<T, TeamPlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamPlayers and returns the data updated in the database.
     * @param {TeamPlayerUpdateManyAndReturnArgs} args - Arguments to update many TeamPlayers.
     * @example
     * // Update many TeamPlayers
     * const teamPlayer = await prisma.teamPlayer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TeamPlayers and only return the `id`
     * const teamPlayerWithIdOnly = await prisma.teamPlayer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamPlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamPlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TeamPlayer.
     * @param {TeamPlayerUpsertArgs} args - Arguments to update or create a TeamPlayer.
     * @example
     * // Update or create a TeamPlayer
     * const teamPlayer = await prisma.teamPlayer.upsert({
     *   create: {
     *     // ... data to create a TeamPlayer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamPlayer we want to update
     *   }
     * })
     */
    upsert<T extends TeamPlayerUpsertArgs>(args: SelectSubset<T, TeamPlayerUpsertArgs<ExtArgs>>): Prisma__TeamPlayerClient<$Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TeamPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerCountArgs} args - Arguments to filter TeamPlayers to count.
     * @example
     * // Count the number of TeamPlayers
     * const count = await prisma.teamPlayer.count({
     *   where: {
     *     // ... the filter for the TeamPlayers we want to count
     *   }
     * })
    **/
    count<T extends TeamPlayerCountArgs>(
      args?: Subset<T, TeamPlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamPlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamPlayerAggregateArgs>(args: Subset<T, TeamPlayerAggregateArgs>): Prisma.PrismaPromise<GetTeamPlayerAggregateType<T>>

    /**
     * Group by TeamPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamPlayerGroupByArgs} args - Group by arguments.
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
      T extends TeamPlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamPlayerGroupByArgs['orderBy'] }
        : { orderBy?: TeamPlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TeamPlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamPlayer model
   */
  readonly fields: TeamPlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamPlayer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamPlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamPlayer model
   */
  interface TeamPlayerFieldRefs {
    readonly id: FieldRef<"TeamPlayer", 'String'>
    readonly team_id: FieldRef<"TeamPlayer", 'String'>
    readonly player_id: FieldRef<"TeamPlayer", 'String'>
    readonly price_paid: FieldRef<"TeamPlayer", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * TeamPlayer findUnique
   */
  export type TeamPlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where: TeamPlayerWhereUniqueInput
  }

  /**
   * TeamPlayer findUniqueOrThrow
   */
  export type TeamPlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where: TeamPlayerWhereUniqueInput
  }

  /**
   * TeamPlayer findFirst
   */
  export type TeamPlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where?: TeamPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: TeamPlayerOrderByWithRelationInput | TeamPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamPlayers.
     */
    cursor?: TeamPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamPlayers.
     */
    distinct?: TeamPlayerScalarFieldEnum | TeamPlayerScalarFieldEnum[]
  }

  /**
   * TeamPlayer findFirstOrThrow
   */
  export type TeamPlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * Filter, which TeamPlayer to fetch.
     */
    where?: TeamPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: TeamPlayerOrderByWithRelationInput | TeamPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamPlayers.
     */
    cursor?: TeamPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamPlayers.
     */
    distinct?: TeamPlayerScalarFieldEnum | TeamPlayerScalarFieldEnum[]
  }

  /**
   * TeamPlayer findMany
   */
  export type TeamPlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * Filter, which TeamPlayers to fetch.
     */
    where?: TeamPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamPlayers to fetch.
     */
    orderBy?: TeamPlayerOrderByWithRelationInput | TeamPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamPlayers.
     */
    cursor?: TeamPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamPlayers.
     */
    skip?: number
    distinct?: TeamPlayerScalarFieldEnum | TeamPlayerScalarFieldEnum[]
  }

  /**
   * TeamPlayer create
   */
  export type TeamPlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamPlayer.
     */
    data: XOR<TeamPlayerCreateInput, TeamPlayerUncheckedCreateInput>
  }

  /**
   * TeamPlayer createMany
   */
  export type TeamPlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamPlayers.
     */
    data: TeamPlayerCreateManyInput | TeamPlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamPlayer createManyAndReturn
   */
  export type TeamPlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * The data used to create many TeamPlayers.
     */
    data: TeamPlayerCreateManyInput | TeamPlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamPlayer update
   */
  export type TeamPlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamPlayer.
     */
    data: XOR<TeamPlayerUpdateInput, TeamPlayerUncheckedUpdateInput>
    /**
     * Choose, which TeamPlayer to update.
     */
    where: TeamPlayerWhereUniqueInput
  }

  /**
   * TeamPlayer updateMany
   */
  export type TeamPlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamPlayers.
     */
    data: XOR<TeamPlayerUpdateManyMutationInput, TeamPlayerUncheckedUpdateManyInput>
    /**
     * Filter which TeamPlayers to update
     */
    where?: TeamPlayerWhereInput
    /**
     * Limit how many TeamPlayers to update.
     */
    limit?: number
  }

  /**
   * TeamPlayer updateManyAndReturn
   */
  export type TeamPlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * The data used to update TeamPlayers.
     */
    data: XOR<TeamPlayerUpdateManyMutationInput, TeamPlayerUncheckedUpdateManyInput>
    /**
     * Filter which TeamPlayers to update
     */
    where?: TeamPlayerWhereInput
    /**
     * Limit how many TeamPlayers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamPlayer upsert
   */
  export type TeamPlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamPlayer to update in case it exists.
     */
    where: TeamPlayerWhereUniqueInput
    /**
     * In case the TeamPlayer found by the `where` argument doesn't exist, create a new TeamPlayer with this data.
     */
    create: XOR<TeamPlayerCreateInput, TeamPlayerUncheckedCreateInput>
    /**
     * In case the TeamPlayer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamPlayerUpdateInput, TeamPlayerUncheckedUpdateInput>
  }

  /**
   * TeamPlayer delete
   */
  export type TeamPlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
    /**
     * Filter which TeamPlayer to delete.
     */
    where: TeamPlayerWhereUniqueInput
  }

  /**
   * TeamPlayer deleteMany
   */
  export type TeamPlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamPlayers to delete
     */
    where?: TeamPlayerWhereInput
    /**
     * Limit how many TeamPlayers to delete.
     */
    limit?: number
  }

  /**
   * TeamPlayer without action
   */
  export type TeamPlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamPlayer
     */
    select?: TeamPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamPlayer
     */
    omit?: TeamPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamPlayerInclude<ExtArgs> | null
  }


  /**
   * Model AuctionState
   */

  export type AggregateAuctionState = {
    _count: AuctionStateCountAggregateOutputType | null
    _avg: AuctionStateAvgAggregateOutputType | null
    _sum: AuctionStateSumAggregateOutputType | null
    _min: AuctionStateMinAggregateOutputType | null
    _max: AuctionStateMaxAggregateOutputType | null
  }

  export type AuctionStateAvgAggregateOutputType = {
    id: number | null
    current_bid: Decimal | null
    current_sequence_id: number | null
    current_sequence_index: number | null
    last_sold_price: Decimal | null
  }

  export type AuctionStateSumAggregateOutputType = {
    id: number | null
    current_bid: Decimal | null
    current_sequence_id: number | null
    current_sequence_index: number | null
    last_sold_price: Decimal | null
  }

  export type AuctionStateMinAggregateOutputType = {
    id: number | null
    phase: $Enums.AuctionPhase | null
    current_player_id: string | null
    current_bid: Decimal | null
    highest_bidder_id: string | null
    current_sequence_id: number | null
    current_sequence_index: number | null
    bid_frozen_team_id: string | null
    auction_day: string | null
    active_power_card: string | null
    active_power_card_team: string | null
    gods_eye_revealed: boolean | null
    last_sold_player_id: string | null
    last_sold_price: Decimal | null
    last_sold_team_id: string | null
    last_sold_team_name: string | null
  }

  export type AuctionStateMaxAggregateOutputType = {
    id: number | null
    phase: $Enums.AuctionPhase | null
    current_player_id: string | null
    current_bid: Decimal | null
    highest_bidder_id: string | null
    current_sequence_id: number | null
    current_sequence_index: number | null
    bid_frozen_team_id: string | null
    auction_day: string | null
    active_power_card: string | null
    active_power_card_team: string | null
    gods_eye_revealed: boolean | null
    last_sold_player_id: string | null
    last_sold_price: Decimal | null
    last_sold_team_id: string | null
    last_sold_team_name: string | null
  }

  export type AuctionStateCountAggregateOutputType = {
    id: number
    phase: number
    current_player_id: number
    current_bid: number
    highest_bidder_id: number
    current_sequence_id: number
    current_sequence_index: number
    bid_frozen_team_id: number
    auction_day: number
    active_power_card: number
    active_power_card_team: number
    gods_eye_revealed: number
    bid_history: number
    last_sold_player_id: number
    last_sold_price: number
    last_sold_team_id: number
    last_sold_team_name: number
    _all: number
  }


  export type AuctionStateAvgAggregateInputType = {
    id?: true
    current_bid?: true
    current_sequence_id?: true
    current_sequence_index?: true
    last_sold_price?: true
  }

  export type AuctionStateSumAggregateInputType = {
    id?: true
    current_bid?: true
    current_sequence_id?: true
    current_sequence_index?: true
    last_sold_price?: true
  }

  export type AuctionStateMinAggregateInputType = {
    id?: true
    phase?: true
    current_player_id?: true
    current_bid?: true
    highest_bidder_id?: true
    current_sequence_id?: true
    current_sequence_index?: true
    bid_frozen_team_id?: true
    auction_day?: true
    active_power_card?: true
    active_power_card_team?: true
    gods_eye_revealed?: true
    last_sold_player_id?: true
    last_sold_price?: true
    last_sold_team_id?: true
    last_sold_team_name?: true
  }

  export type AuctionStateMaxAggregateInputType = {
    id?: true
    phase?: true
    current_player_id?: true
    current_bid?: true
    highest_bidder_id?: true
    current_sequence_id?: true
    current_sequence_index?: true
    bid_frozen_team_id?: true
    auction_day?: true
    active_power_card?: true
    active_power_card_team?: true
    gods_eye_revealed?: true
    last_sold_player_id?: true
    last_sold_price?: true
    last_sold_team_id?: true
    last_sold_team_name?: true
  }

  export type AuctionStateCountAggregateInputType = {
    id?: true
    phase?: true
    current_player_id?: true
    current_bid?: true
    highest_bidder_id?: true
    current_sequence_id?: true
    current_sequence_index?: true
    bid_frozen_team_id?: true
    auction_day?: true
    active_power_card?: true
    active_power_card_team?: true
    gods_eye_revealed?: true
    bid_history?: true
    last_sold_player_id?: true
    last_sold_price?: true
    last_sold_team_id?: true
    last_sold_team_name?: true
    _all?: true
  }

  export type AuctionStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionState to aggregate.
     */
    where?: AuctionStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionStates to fetch.
     */
    orderBy?: AuctionStateOrderByWithRelationInput | AuctionStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuctionStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuctionStates
    **/
    _count?: true | AuctionStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuctionStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuctionStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuctionStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuctionStateMaxAggregateInputType
  }

  export type GetAuctionStateAggregateType<T extends AuctionStateAggregateArgs> = {
        [P in keyof T & keyof AggregateAuctionState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuctionState[P]>
      : GetScalarType<T[P], AggregateAuctionState[P]>
  }




  export type AuctionStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionStateWhereInput
    orderBy?: AuctionStateOrderByWithAggregationInput | AuctionStateOrderByWithAggregationInput[]
    by: AuctionStateScalarFieldEnum[] | AuctionStateScalarFieldEnum
    having?: AuctionStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuctionStateCountAggregateInputType | true
    _avg?: AuctionStateAvgAggregateInputType
    _sum?: AuctionStateSumAggregateInputType
    _min?: AuctionStateMinAggregateInputType
    _max?: AuctionStateMaxAggregateInputType
  }

  export type AuctionStateGroupByOutputType = {
    id: number
    phase: $Enums.AuctionPhase
    current_player_id: string | null
    current_bid: Decimal | null
    highest_bidder_id: string | null
    current_sequence_id: number | null
    current_sequence_index: number
    bid_frozen_team_id: string | null
    auction_day: string
    active_power_card: string | null
    active_power_card_team: string | null
    gods_eye_revealed: boolean
    bid_history: JsonValue
    last_sold_player_id: string | null
    last_sold_price: Decimal | null
    last_sold_team_id: string | null
    last_sold_team_name: string | null
    _count: AuctionStateCountAggregateOutputType | null
    _avg: AuctionStateAvgAggregateOutputType | null
    _sum: AuctionStateSumAggregateOutputType | null
    _min: AuctionStateMinAggregateOutputType | null
    _max: AuctionStateMaxAggregateOutputType | null
  }

  type GetAuctionStateGroupByPayload<T extends AuctionStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuctionStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuctionStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuctionStateGroupByOutputType[P]>
            : GetScalarType<T[P], AuctionStateGroupByOutputType[P]>
        }
      >
    >


  export type AuctionStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase?: boolean
    current_player_id?: boolean
    current_bid?: boolean
    highest_bidder_id?: boolean
    current_sequence_id?: boolean
    current_sequence_index?: boolean
    bid_frozen_team_id?: boolean
    auction_day?: boolean
    active_power_card?: boolean
    active_power_card_team?: boolean
    gods_eye_revealed?: boolean
    bid_history?: boolean
    last_sold_player_id?: boolean
    last_sold_price?: boolean
    last_sold_team_id?: boolean
    last_sold_team_name?: boolean
  }, ExtArgs["result"]["auctionState"]>

  export type AuctionStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase?: boolean
    current_player_id?: boolean
    current_bid?: boolean
    highest_bidder_id?: boolean
    current_sequence_id?: boolean
    current_sequence_index?: boolean
    bid_frozen_team_id?: boolean
    auction_day?: boolean
    active_power_card?: boolean
    active_power_card_team?: boolean
    gods_eye_revealed?: boolean
    bid_history?: boolean
    last_sold_player_id?: boolean
    last_sold_price?: boolean
    last_sold_team_id?: boolean
    last_sold_team_name?: boolean
  }, ExtArgs["result"]["auctionState"]>

  export type AuctionStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phase?: boolean
    current_player_id?: boolean
    current_bid?: boolean
    highest_bidder_id?: boolean
    current_sequence_id?: boolean
    current_sequence_index?: boolean
    bid_frozen_team_id?: boolean
    auction_day?: boolean
    active_power_card?: boolean
    active_power_card_team?: boolean
    gods_eye_revealed?: boolean
    bid_history?: boolean
    last_sold_player_id?: boolean
    last_sold_price?: boolean
    last_sold_team_id?: boolean
    last_sold_team_name?: boolean
  }, ExtArgs["result"]["auctionState"]>

  export type AuctionStateSelectScalar = {
    id?: boolean
    phase?: boolean
    current_player_id?: boolean
    current_bid?: boolean
    highest_bidder_id?: boolean
    current_sequence_id?: boolean
    current_sequence_index?: boolean
    bid_frozen_team_id?: boolean
    auction_day?: boolean
    active_power_card?: boolean
    active_power_card_team?: boolean
    gods_eye_revealed?: boolean
    bid_history?: boolean
    last_sold_player_id?: boolean
    last_sold_price?: boolean
    last_sold_team_id?: boolean
    last_sold_team_name?: boolean
  }

  export type AuctionStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phase" | "current_player_id" | "current_bid" | "highest_bidder_id" | "current_sequence_id" | "current_sequence_index" | "bid_frozen_team_id" | "auction_day" | "active_power_card" | "active_power_card_team" | "gods_eye_revealed" | "bid_history" | "last_sold_player_id" | "last_sold_price" | "last_sold_team_id" | "last_sold_team_name", ExtArgs["result"]["auctionState"]>

  export type $AuctionStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuctionState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      phase: $Enums.AuctionPhase
      current_player_id: string | null
      current_bid: Prisma.Decimal | null
      highest_bidder_id: string | null
      current_sequence_id: number | null
      current_sequence_index: number
      bid_frozen_team_id: string | null
      auction_day: string
      active_power_card: string | null
      active_power_card_team: string | null
      gods_eye_revealed: boolean
      bid_history: Prisma.JsonValue
      last_sold_player_id: string | null
      last_sold_price: Prisma.Decimal | null
      last_sold_team_id: string | null
      last_sold_team_name: string | null
    }, ExtArgs["result"]["auctionState"]>
    composites: {}
  }

  type AuctionStateGetPayload<S extends boolean | null | undefined | AuctionStateDefaultArgs> = $Result.GetResult<Prisma.$AuctionStatePayload, S>

  type AuctionStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuctionStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuctionStateCountAggregateInputType | true
    }

  export interface AuctionStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuctionState'], meta: { name: 'AuctionState' } }
    /**
     * Find zero or one AuctionState that matches the filter.
     * @param {AuctionStateFindUniqueArgs} args - Arguments to find a AuctionState
     * @example
     * // Get one AuctionState
     * const auctionState = await prisma.auctionState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuctionStateFindUniqueArgs>(args: SelectSubset<T, AuctionStateFindUniqueArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuctionState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuctionStateFindUniqueOrThrowArgs} args - Arguments to find a AuctionState
     * @example
     * // Get one AuctionState
     * const auctionState = await prisma.auctionState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuctionStateFindUniqueOrThrowArgs>(args: SelectSubset<T, AuctionStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateFindFirstArgs} args - Arguments to find a AuctionState
     * @example
     * // Get one AuctionState
     * const auctionState = await prisma.auctionState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuctionStateFindFirstArgs>(args?: SelectSubset<T, AuctionStateFindFirstArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateFindFirstOrThrowArgs} args - Arguments to find a AuctionState
     * @example
     * // Get one AuctionState
     * const auctionState = await prisma.auctionState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuctionStateFindFirstOrThrowArgs>(args?: SelectSubset<T, AuctionStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuctionStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuctionStates
     * const auctionStates = await prisma.auctionState.findMany()
     * 
     * // Get first 10 AuctionStates
     * const auctionStates = await prisma.auctionState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auctionStateWithIdOnly = await prisma.auctionState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuctionStateFindManyArgs>(args?: SelectSubset<T, AuctionStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuctionState.
     * @param {AuctionStateCreateArgs} args - Arguments to create a AuctionState.
     * @example
     * // Create one AuctionState
     * const AuctionState = await prisma.auctionState.create({
     *   data: {
     *     // ... data to create a AuctionState
     *   }
     * })
     * 
     */
    create<T extends AuctionStateCreateArgs>(args: SelectSubset<T, AuctionStateCreateArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuctionStates.
     * @param {AuctionStateCreateManyArgs} args - Arguments to create many AuctionStates.
     * @example
     * // Create many AuctionStates
     * const auctionState = await prisma.auctionState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuctionStateCreateManyArgs>(args?: SelectSubset<T, AuctionStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuctionStates and returns the data saved in the database.
     * @param {AuctionStateCreateManyAndReturnArgs} args - Arguments to create many AuctionStates.
     * @example
     * // Create many AuctionStates
     * const auctionState = await prisma.auctionState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuctionStates and only return the `id`
     * const auctionStateWithIdOnly = await prisma.auctionState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuctionStateCreateManyAndReturnArgs>(args?: SelectSubset<T, AuctionStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuctionState.
     * @param {AuctionStateDeleteArgs} args - Arguments to delete one AuctionState.
     * @example
     * // Delete one AuctionState
     * const AuctionState = await prisma.auctionState.delete({
     *   where: {
     *     // ... filter to delete one AuctionState
     *   }
     * })
     * 
     */
    delete<T extends AuctionStateDeleteArgs>(args: SelectSubset<T, AuctionStateDeleteArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuctionState.
     * @param {AuctionStateUpdateArgs} args - Arguments to update one AuctionState.
     * @example
     * // Update one AuctionState
     * const auctionState = await prisma.auctionState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuctionStateUpdateArgs>(args: SelectSubset<T, AuctionStateUpdateArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuctionStates.
     * @param {AuctionStateDeleteManyArgs} args - Arguments to filter AuctionStates to delete.
     * @example
     * // Delete a few AuctionStates
     * const { count } = await prisma.auctionState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuctionStateDeleteManyArgs>(args?: SelectSubset<T, AuctionStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuctionStates
     * const auctionState = await prisma.auctionState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuctionStateUpdateManyArgs>(args: SelectSubset<T, AuctionStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionStates and returns the data updated in the database.
     * @param {AuctionStateUpdateManyAndReturnArgs} args - Arguments to update many AuctionStates.
     * @example
     * // Update many AuctionStates
     * const auctionState = await prisma.auctionState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuctionStates and only return the `id`
     * const auctionStateWithIdOnly = await prisma.auctionState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuctionStateUpdateManyAndReturnArgs>(args: SelectSubset<T, AuctionStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuctionState.
     * @param {AuctionStateUpsertArgs} args - Arguments to update or create a AuctionState.
     * @example
     * // Update or create a AuctionState
     * const auctionState = await prisma.auctionState.upsert({
     *   create: {
     *     // ... data to create a AuctionState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuctionState we want to update
     *   }
     * })
     */
    upsert<T extends AuctionStateUpsertArgs>(args: SelectSubset<T, AuctionStateUpsertArgs<ExtArgs>>): Prisma__AuctionStateClient<$Result.GetResult<Prisma.$AuctionStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuctionStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateCountArgs} args - Arguments to filter AuctionStates to count.
     * @example
     * // Count the number of AuctionStates
     * const count = await prisma.auctionState.count({
     *   where: {
     *     // ... the filter for the AuctionStates we want to count
     *   }
     * })
    **/
    count<T extends AuctionStateCountArgs>(
      args?: Subset<T, AuctionStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuctionStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuctionState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuctionStateAggregateArgs>(args: Subset<T, AuctionStateAggregateArgs>): Prisma.PrismaPromise<GetAuctionStateAggregateType<T>>

    /**
     * Group by AuctionState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionStateGroupByArgs} args - Group by arguments.
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
      T extends AuctionStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuctionStateGroupByArgs['orderBy'] }
        : { orderBy?: AuctionStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AuctionStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuctionStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuctionState model
   */
  readonly fields: AuctionStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuctionState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuctionStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuctionState model
   */
  interface AuctionStateFieldRefs {
    readonly id: FieldRef<"AuctionState", 'Int'>
    readonly phase: FieldRef<"AuctionState", 'AuctionPhase'>
    readonly current_player_id: FieldRef<"AuctionState", 'String'>
    readonly current_bid: FieldRef<"AuctionState", 'Decimal'>
    readonly highest_bidder_id: FieldRef<"AuctionState", 'String'>
    readonly current_sequence_id: FieldRef<"AuctionState", 'Int'>
    readonly current_sequence_index: FieldRef<"AuctionState", 'Int'>
    readonly bid_frozen_team_id: FieldRef<"AuctionState", 'String'>
    readonly auction_day: FieldRef<"AuctionState", 'String'>
    readonly active_power_card: FieldRef<"AuctionState", 'String'>
    readonly active_power_card_team: FieldRef<"AuctionState", 'String'>
    readonly gods_eye_revealed: FieldRef<"AuctionState", 'Boolean'>
    readonly bid_history: FieldRef<"AuctionState", 'Json'>
    readonly last_sold_player_id: FieldRef<"AuctionState", 'String'>
    readonly last_sold_price: FieldRef<"AuctionState", 'Decimal'>
    readonly last_sold_team_id: FieldRef<"AuctionState", 'String'>
    readonly last_sold_team_name: FieldRef<"AuctionState", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuctionState findUnique
   */
  export type AuctionStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * Filter, which AuctionState to fetch.
     */
    where: AuctionStateWhereUniqueInput
  }

  /**
   * AuctionState findUniqueOrThrow
   */
  export type AuctionStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * Filter, which AuctionState to fetch.
     */
    where: AuctionStateWhereUniqueInput
  }

  /**
   * AuctionState findFirst
   */
  export type AuctionStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * Filter, which AuctionState to fetch.
     */
    where?: AuctionStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionStates to fetch.
     */
    orderBy?: AuctionStateOrderByWithRelationInput | AuctionStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionStates.
     */
    cursor?: AuctionStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionStates.
     */
    distinct?: AuctionStateScalarFieldEnum | AuctionStateScalarFieldEnum[]
  }

  /**
   * AuctionState findFirstOrThrow
   */
  export type AuctionStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * Filter, which AuctionState to fetch.
     */
    where?: AuctionStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionStates to fetch.
     */
    orderBy?: AuctionStateOrderByWithRelationInput | AuctionStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionStates.
     */
    cursor?: AuctionStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionStates.
     */
    distinct?: AuctionStateScalarFieldEnum | AuctionStateScalarFieldEnum[]
  }

  /**
   * AuctionState findMany
   */
  export type AuctionStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * Filter, which AuctionStates to fetch.
     */
    where?: AuctionStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionStates to fetch.
     */
    orderBy?: AuctionStateOrderByWithRelationInput | AuctionStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuctionStates.
     */
    cursor?: AuctionStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionStates.
     */
    skip?: number
    distinct?: AuctionStateScalarFieldEnum | AuctionStateScalarFieldEnum[]
  }

  /**
   * AuctionState create
   */
  export type AuctionStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * The data needed to create a AuctionState.
     */
    data?: XOR<AuctionStateCreateInput, AuctionStateUncheckedCreateInput>
  }

  /**
   * AuctionState createMany
   */
  export type AuctionStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuctionStates.
     */
    data: AuctionStateCreateManyInput | AuctionStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuctionState createManyAndReturn
   */
  export type AuctionStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * The data used to create many AuctionStates.
     */
    data: AuctionStateCreateManyInput | AuctionStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuctionState update
   */
  export type AuctionStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * The data needed to update a AuctionState.
     */
    data: XOR<AuctionStateUpdateInput, AuctionStateUncheckedUpdateInput>
    /**
     * Choose, which AuctionState to update.
     */
    where: AuctionStateWhereUniqueInput
  }

  /**
   * AuctionState updateMany
   */
  export type AuctionStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuctionStates.
     */
    data: XOR<AuctionStateUpdateManyMutationInput, AuctionStateUncheckedUpdateManyInput>
    /**
     * Filter which AuctionStates to update
     */
    where?: AuctionStateWhereInput
    /**
     * Limit how many AuctionStates to update.
     */
    limit?: number
  }

  /**
   * AuctionState updateManyAndReturn
   */
  export type AuctionStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * The data used to update AuctionStates.
     */
    data: XOR<AuctionStateUpdateManyMutationInput, AuctionStateUncheckedUpdateManyInput>
    /**
     * Filter which AuctionStates to update
     */
    where?: AuctionStateWhereInput
    /**
     * Limit how many AuctionStates to update.
     */
    limit?: number
  }

  /**
   * AuctionState upsert
   */
  export type AuctionStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * The filter to search for the AuctionState to update in case it exists.
     */
    where: AuctionStateWhereUniqueInput
    /**
     * In case the AuctionState found by the `where` argument doesn't exist, create a new AuctionState with this data.
     */
    create: XOR<AuctionStateCreateInput, AuctionStateUncheckedCreateInput>
    /**
     * In case the AuctionState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuctionStateUpdateInput, AuctionStateUncheckedUpdateInput>
  }

  /**
   * AuctionState delete
   */
  export type AuctionStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
    /**
     * Filter which AuctionState to delete.
     */
    where: AuctionStateWhereUniqueInput
  }

  /**
   * AuctionState deleteMany
   */
  export type AuctionStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionStates to delete
     */
    where?: AuctionStateWhereInput
    /**
     * Limit how many AuctionStates to delete.
     */
    limit?: number
  }

  /**
   * AuctionState without action
   */
  export type AuctionStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionState
     */
    select?: AuctionStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionState
     */
    omit?: AuctionStateOmit<ExtArgs> | null
  }


  /**
   * Model AuctionSequence
   */

  export type AggregateAuctionSequence = {
    _count: AuctionSequenceCountAggregateOutputType | null
    _avg: AuctionSequenceAvgAggregateOutputType | null
    _sum: AuctionSequenceSumAggregateOutputType | null
    _min: AuctionSequenceMinAggregateOutputType | null
    _max: AuctionSequenceMaxAggregateOutputType | null
  }

  export type AuctionSequenceAvgAggregateOutputType = {
    id: number | null
  }

  export type AuctionSequenceSumAggregateOutputType = {
    id: number | null
  }

  export type AuctionSequenceMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type AuctionSequenceMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type AuctionSequenceCountAggregateOutputType = {
    id: number
    name: number
    player_ids: number
    _all: number
  }


  export type AuctionSequenceAvgAggregateInputType = {
    id?: true
  }

  export type AuctionSequenceSumAggregateInputType = {
    id?: true
  }

  export type AuctionSequenceMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type AuctionSequenceMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type AuctionSequenceCountAggregateInputType = {
    id?: true
    name?: true
    player_ids?: true
    _all?: true
  }

  export type AuctionSequenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionSequence to aggregate.
     */
    where?: AuctionSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionSequences to fetch.
     */
    orderBy?: AuctionSequenceOrderByWithRelationInput | AuctionSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuctionSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuctionSequences
    **/
    _count?: true | AuctionSequenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuctionSequenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuctionSequenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuctionSequenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuctionSequenceMaxAggregateInputType
  }

  export type GetAuctionSequenceAggregateType<T extends AuctionSequenceAggregateArgs> = {
        [P in keyof T & keyof AggregateAuctionSequence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuctionSequence[P]>
      : GetScalarType<T[P], AggregateAuctionSequence[P]>
  }




  export type AuctionSequenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuctionSequenceWhereInput
    orderBy?: AuctionSequenceOrderByWithAggregationInput | AuctionSequenceOrderByWithAggregationInput[]
    by: AuctionSequenceScalarFieldEnum[] | AuctionSequenceScalarFieldEnum
    having?: AuctionSequenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuctionSequenceCountAggregateInputType | true
    _avg?: AuctionSequenceAvgAggregateInputType
    _sum?: AuctionSequenceSumAggregateInputType
    _min?: AuctionSequenceMinAggregateInputType
    _max?: AuctionSequenceMaxAggregateInputType
  }

  export type AuctionSequenceGroupByOutputType = {
    id: number
    name: string
    player_ids: JsonValue
    _count: AuctionSequenceCountAggregateOutputType | null
    _avg: AuctionSequenceAvgAggregateOutputType | null
    _sum: AuctionSequenceSumAggregateOutputType | null
    _min: AuctionSequenceMinAggregateOutputType | null
    _max: AuctionSequenceMaxAggregateOutputType | null
  }

  type GetAuctionSequenceGroupByPayload<T extends AuctionSequenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuctionSequenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuctionSequenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuctionSequenceGroupByOutputType[P]>
            : GetScalarType<T[P], AuctionSequenceGroupByOutputType[P]>
        }
      >
    >


  export type AuctionSequenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    player_ids?: boolean
  }, ExtArgs["result"]["auctionSequence"]>

  export type AuctionSequenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    player_ids?: boolean
  }, ExtArgs["result"]["auctionSequence"]>

  export type AuctionSequenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    player_ids?: boolean
  }, ExtArgs["result"]["auctionSequence"]>

  export type AuctionSequenceSelectScalar = {
    id?: boolean
    name?: boolean
    player_ids?: boolean
  }

  export type AuctionSequenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "player_ids", ExtArgs["result"]["auctionSequence"]>

  export type $AuctionSequencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuctionSequence"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      player_ids: Prisma.JsonValue
    }, ExtArgs["result"]["auctionSequence"]>
    composites: {}
  }

  type AuctionSequenceGetPayload<S extends boolean | null | undefined | AuctionSequenceDefaultArgs> = $Result.GetResult<Prisma.$AuctionSequencePayload, S>

  type AuctionSequenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuctionSequenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuctionSequenceCountAggregateInputType | true
    }

  export interface AuctionSequenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuctionSequence'], meta: { name: 'AuctionSequence' } }
    /**
     * Find zero or one AuctionSequence that matches the filter.
     * @param {AuctionSequenceFindUniqueArgs} args - Arguments to find a AuctionSequence
     * @example
     * // Get one AuctionSequence
     * const auctionSequence = await prisma.auctionSequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuctionSequenceFindUniqueArgs>(args: SelectSubset<T, AuctionSequenceFindUniqueArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuctionSequence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuctionSequenceFindUniqueOrThrowArgs} args - Arguments to find a AuctionSequence
     * @example
     * // Get one AuctionSequence
     * const auctionSequence = await prisma.auctionSequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuctionSequenceFindUniqueOrThrowArgs>(args: SelectSubset<T, AuctionSequenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionSequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceFindFirstArgs} args - Arguments to find a AuctionSequence
     * @example
     * // Get one AuctionSequence
     * const auctionSequence = await prisma.auctionSequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuctionSequenceFindFirstArgs>(args?: SelectSubset<T, AuctionSequenceFindFirstArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuctionSequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceFindFirstOrThrowArgs} args - Arguments to find a AuctionSequence
     * @example
     * // Get one AuctionSequence
     * const auctionSequence = await prisma.auctionSequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuctionSequenceFindFirstOrThrowArgs>(args?: SelectSubset<T, AuctionSequenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuctionSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuctionSequences
     * const auctionSequences = await prisma.auctionSequence.findMany()
     * 
     * // Get first 10 AuctionSequences
     * const auctionSequences = await prisma.auctionSequence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auctionSequenceWithIdOnly = await prisma.auctionSequence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuctionSequenceFindManyArgs>(args?: SelectSubset<T, AuctionSequenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuctionSequence.
     * @param {AuctionSequenceCreateArgs} args - Arguments to create a AuctionSequence.
     * @example
     * // Create one AuctionSequence
     * const AuctionSequence = await prisma.auctionSequence.create({
     *   data: {
     *     // ... data to create a AuctionSequence
     *   }
     * })
     * 
     */
    create<T extends AuctionSequenceCreateArgs>(args: SelectSubset<T, AuctionSequenceCreateArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuctionSequences.
     * @param {AuctionSequenceCreateManyArgs} args - Arguments to create many AuctionSequences.
     * @example
     * // Create many AuctionSequences
     * const auctionSequence = await prisma.auctionSequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuctionSequenceCreateManyArgs>(args?: SelectSubset<T, AuctionSequenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuctionSequences and returns the data saved in the database.
     * @param {AuctionSequenceCreateManyAndReturnArgs} args - Arguments to create many AuctionSequences.
     * @example
     * // Create many AuctionSequences
     * const auctionSequence = await prisma.auctionSequence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuctionSequences and only return the `id`
     * const auctionSequenceWithIdOnly = await prisma.auctionSequence.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuctionSequenceCreateManyAndReturnArgs>(args?: SelectSubset<T, AuctionSequenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuctionSequence.
     * @param {AuctionSequenceDeleteArgs} args - Arguments to delete one AuctionSequence.
     * @example
     * // Delete one AuctionSequence
     * const AuctionSequence = await prisma.auctionSequence.delete({
     *   where: {
     *     // ... filter to delete one AuctionSequence
     *   }
     * })
     * 
     */
    delete<T extends AuctionSequenceDeleteArgs>(args: SelectSubset<T, AuctionSequenceDeleteArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuctionSequence.
     * @param {AuctionSequenceUpdateArgs} args - Arguments to update one AuctionSequence.
     * @example
     * // Update one AuctionSequence
     * const auctionSequence = await prisma.auctionSequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuctionSequenceUpdateArgs>(args: SelectSubset<T, AuctionSequenceUpdateArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuctionSequences.
     * @param {AuctionSequenceDeleteManyArgs} args - Arguments to filter AuctionSequences to delete.
     * @example
     * // Delete a few AuctionSequences
     * const { count } = await prisma.auctionSequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuctionSequenceDeleteManyArgs>(args?: SelectSubset<T, AuctionSequenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuctionSequences
     * const auctionSequence = await prisma.auctionSequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuctionSequenceUpdateManyArgs>(args: SelectSubset<T, AuctionSequenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuctionSequences and returns the data updated in the database.
     * @param {AuctionSequenceUpdateManyAndReturnArgs} args - Arguments to update many AuctionSequences.
     * @example
     * // Update many AuctionSequences
     * const auctionSequence = await prisma.auctionSequence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuctionSequences and only return the `id`
     * const auctionSequenceWithIdOnly = await prisma.auctionSequence.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuctionSequenceUpdateManyAndReturnArgs>(args: SelectSubset<T, AuctionSequenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuctionSequence.
     * @param {AuctionSequenceUpsertArgs} args - Arguments to update or create a AuctionSequence.
     * @example
     * // Update or create a AuctionSequence
     * const auctionSequence = await prisma.auctionSequence.upsert({
     *   create: {
     *     // ... data to create a AuctionSequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuctionSequence we want to update
     *   }
     * })
     */
    upsert<T extends AuctionSequenceUpsertArgs>(args: SelectSubset<T, AuctionSequenceUpsertArgs<ExtArgs>>): Prisma__AuctionSequenceClient<$Result.GetResult<Prisma.$AuctionSequencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuctionSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceCountArgs} args - Arguments to filter AuctionSequences to count.
     * @example
     * // Count the number of AuctionSequences
     * const count = await prisma.auctionSequence.count({
     *   where: {
     *     // ... the filter for the AuctionSequences we want to count
     *   }
     * })
    **/
    count<T extends AuctionSequenceCountArgs>(
      args?: Subset<T, AuctionSequenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuctionSequenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuctionSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuctionSequenceAggregateArgs>(args: Subset<T, AuctionSequenceAggregateArgs>): Prisma.PrismaPromise<GetAuctionSequenceAggregateType<T>>

    /**
     * Group by AuctionSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuctionSequenceGroupByArgs} args - Group by arguments.
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
      T extends AuctionSequenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuctionSequenceGroupByArgs['orderBy'] }
        : { orderBy?: AuctionSequenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AuctionSequenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuctionSequenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuctionSequence model
   */
  readonly fields: AuctionSequenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuctionSequence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuctionSequenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuctionSequence model
   */
  interface AuctionSequenceFieldRefs {
    readonly id: FieldRef<"AuctionSequence", 'Int'>
    readonly name: FieldRef<"AuctionSequence", 'String'>
    readonly player_ids: FieldRef<"AuctionSequence", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AuctionSequence findUnique
   */
  export type AuctionSequenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * Filter, which AuctionSequence to fetch.
     */
    where: AuctionSequenceWhereUniqueInput
  }

  /**
   * AuctionSequence findUniqueOrThrow
   */
  export type AuctionSequenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * Filter, which AuctionSequence to fetch.
     */
    where: AuctionSequenceWhereUniqueInput
  }

  /**
   * AuctionSequence findFirst
   */
  export type AuctionSequenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * Filter, which AuctionSequence to fetch.
     */
    where?: AuctionSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionSequences to fetch.
     */
    orderBy?: AuctionSequenceOrderByWithRelationInput | AuctionSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionSequences.
     */
    cursor?: AuctionSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionSequences.
     */
    distinct?: AuctionSequenceScalarFieldEnum | AuctionSequenceScalarFieldEnum[]
  }

  /**
   * AuctionSequence findFirstOrThrow
   */
  export type AuctionSequenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * Filter, which AuctionSequence to fetch.
     */
    where?: AuctionSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionSequences to fetch.
     */
    orderBy?: AuctionSequenceOrderByWithRelationInput | AuctionSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuctionSequences.
     */
    cursor?: AuctionSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionSequences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuctionSequences.
     */
    distinct?: AuctionSequenceScalarFieldEnum | AuctionSequenceScalarFieldEnum[]
  }

  /**
   * AuctionSequence findMany
   */
  export type AuctionSequenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * Filter, which AuctionSequences to fetch.
     */
    where?: AuctionSequenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuctionSequences to fetch.
     */
    orderBy?: AuctionSequenceOrderByWithRelationInput | AuctionSequenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuctionSequences.
     */
    cursor?: AuctionSequenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuctionSequences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuctionSequences.
     */
    skip?: number
    distinct?: AuctionSequenceScalarFieldEnum | AuctionSequenceScalarFieldEnum[]
  }

  /**
   * AuctionSequence create
   */
  export type AuctionSequenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * The data needed to create a AuctionSequence.
     */
    data: XOR<AuctionSequenceCreateInput, AuctionSequenceUncheckedCreateInput>
  }

  /**
   * AuctionSequence createMany
   */
  export type AuctionSequenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuctionSequences.
     */
    data: AuctionSequenceCreateManyInput | AuctionSequenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuctionSequence createManyAndReturn
   */
  export type AuctionSequenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * The data used to create many AuctionSequences.
     */
    data: AuctionSequenceCreateManyInput | AuctionSequenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuctionSequence update
   */
  export type AuctionSequenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * The data needed to update a AuctionSequence.
     */
    data: XOR<AuctionSequenceUpdateInput, AuctionSequenceUncheckedUpdateInput>
    /**
     * Choose, which AuctionSequence to update.
     */
    where: AuctionSequenceWhereUniqueInput
  }

  /**
   * AuctionSequence updateMany
   */
  export type AuctionSequenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuctionSequences.
     */
    data: XOR<AuctionSequenceUpdateManyMutationInput, AuctionSequenceUncheckedUpdateManyInput>
    /**
     * Filter which AuctionSequences to update
     */
    where?: AuctionSequenceWhereInput
    /**
     * Limit how many AuctionSequences to update.
     */
    limit?: number
  }

  /**
   * AuctionSequence updateManyAndReturn
   */
  export type AuctionSequenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * The data used to update AuctionSequences.
     */
    data: XOR<AuctionSequenceUpdateManyMutationInput, AuctionSequenceUncheckedUpdateManyInput>
    /**
     * Filter which AuctionSequences to update
     */
    where?: AuctionSequenceWhereInput
    /**
     * Limit how many AuctionSequences to update.
     */
    limit?: number
  }

  /**
   * AuctionSequence upsert
   */
  export type AuctionSequenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * The filter to search for the AuctionSequence to update in case it exists.
     */
    where: AuctionSequenceWhereUniqueInput
    /**
     * In case the AuctionSequence found by the `where` argument doesn't exist, create a new AuctionSequence with this data.
     */
    create: XOR<AuctionSequenceCreateInput, AuctionSequenceUncheckedCreateInput>
    /**
     * In case the AuctionSequence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuctionSequenceUpdateInput, AuctionSequenceUncheckedUpdateInput>
  }

  /**
   * AuctionSequence delete
   */
  export type AuctionSequenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
    /**
     * Filter which AuctionSequence to delete.
     */
    where: AuctionSequenceWhereUniqueInput
  }

  /**
   * AuctionSequence deleteMany
   */
  export type AuctionSequenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuctionSequences to delete
     */
    where?: AuctionSequenceWhereInput
    /**
     * Limit how many AuctionSequences to delete.
     */
    limit?: number
  }

  /**
   * AuctionSequence without action
   */
  export type AuctionSequenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuctionSequence
     */
    select?: AuctionSequenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuctionSequence
     */
    omit?: AuctionSequenceOmit<ExtArgs> | null
  }


  /**
   * Model PowerCard
   */

  export type AggregatePowerCard = {
    _count: PowerCardCountAggregateOutputType | null
    _min: PowerCardMinAggregateOutputType | null
    _max: PowerCardMaxAggregateOutputType | null
  }

  export type PowerCardMinAggregateOutputType = {
    id: string | null
    team_id: string | null
    type: $Enums.PowerCardType | null
    is_used: boolean | null
  }

  export type PowerCardMaxAggregateOutputType = {
    id: string | null
    team_id: string | null
    type: $Enums.PowerCardType | null
    is_used: boolean | null
  }

  export type PowerCardCountAggregateOutputType = {
    id: number
    team_id: number
    type: number
    is_used: number
    _all: number
  }


  export type PowerCardMinAggregateInputType = {
    id?: true
    team_id?: true
    type?: true
    is_used?: true
  }

  export type PowerCardMaxAggregateInputType = {
    id?: true
    team_id?: true
    type?: true
    is_used?: true
  }

  export type PowerCardCountAggregateInputType = {
    id?: true
    team_id?: true
    type?: true
    is_used?: true
    _all?: true
  }

  export type PowerCardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerCard to aggregate.
     */
    where?: PowerCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerCards to fetch.
     */
    orderBy?: PowerCardOrderByWithRelationInput | PowerCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PowerCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PowerCards
    **/
    _count?: true | PowerCardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PowerCardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PowerCardMaxAggregateInputType
  }

  export type GetPowerCardAggregateType<T extends PowerCardAggregateArgs> = {
        [P in keyof T & keyof AggregatePowerCard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePowerCard[P]>
      : GetScalarType<T[P], AggregatePowerCard[P]>
  }




  export type PowerCardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerCardWhereInput
    orderBy?: PowerCardOrderByWithAggregationInput | PowerCardOrderByWithAggregationInput[]
    by: PowerCardScalarFieldEnum[] | PowerCardScalarFieldEnum
    having?: PowerCardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PowerCardCountAggregateInputType | true
    _min?: PowerCardMinAggregateInputType
    _max?: PowerCardMaxAggregateInputType
  }

  export type PowerCardGroupByOutputType = {
    id: string
    team_id: string
    type: $Enums.PowerCardType
    is_used: boolean
    _count: PowerCardCountAggregateOutputType | null
    _min: PowerCardMinAggregateOutputType | null
    _max: PowerCardMaxAggregateOutputType | null
  }

  type GetPowerCardGroupByPayload<T extends PowerCardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PowerCardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PowerCardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PowerCardGroupByOutputType[P]>
            : GetScalarType<T[P], PowerCardGroupByOutputType[P]>
        }
      >
    >


  export type PowerCardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    type?: boolean
    is_used?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerCard"]>

  export type PowerCardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    type?: boolean
    is_used?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerCard"]>

  export type PowerCardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    team_id?: boolean
    type?: boolean
    is_used?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerCard"]>

  export type PowerCardSelectScalar = {
    id?: boolean
    team_id?: boolean
    type?: boolean
    is_used?: boolean
  }

  export type PowerCardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "team_id" | "type" | "is_used", ExtArgs["result"]["powerCard"]>
  export type PowerCardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type PowerCardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type PowerCardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $PowerCardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PowerCard"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      team_id: string
      type: $Enums.PowerCardType
      is_used: boolean
    }, ExtArgs["result"]["powerCard"]>
    composites: {}
  }

  type PowerCardGetPayload<S extends boolean | null | undefined | PowerCardDefaultArgs> = $Result.GetResult<Prisma.$PowerCardPayload, S>

  type PowerCardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PowerCardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PowerCardCountAggregateInputType | true
    }

  export interface PowerCardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PowerCard'], meta: { name: 'PowerCard' } }
    /**
     * Find zero or one PowerCard that matches the filter.
     * @param {PowerCardFindUniqueArgs} args - Arguments to find a PowerCard
     * @example
     * // Get one PowerCard
     * const powerCard = await prisma.powerCard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PowerCardFindUniqueArgs>(args: SelectSubset<T, PowerCardFindUniqueArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PowerCard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PowerCardFindUniqueOrThrowArgs} args - Arguments to find a PowerCard
     * @example
     * // Get one PowerCard
     * const powerCard = await prisma.powerCard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PowerCardFindUniqueOrThrowArgs>(args: SelectSubset<T, PowerCardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerCard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardFindFirstArgs} args - Arguments to find a PowerCard
     * @example
     * // Get one PowerCard
     * const powerCard = await prisma.powerCard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PowerCardFindFirstArgs>(args?: SelectSubset<T, PowerCardFindFirstArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerCard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardFindFirstOrThrowArgs} args - Arguments to find a PowerCard
     * @example
     * // Get one PowerCard
     * const powerCard = await prisma.powerCard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PowerCardFindFirstOrThrowArgs>(args?: SelectSubset<T, PowerCardFindFirstOrThrowArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PowerCards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PowerCards
     * const powerCards = await prisma.powerCard.findMany()
     * 
     * // Get first 10 PowerCards
     * const powerCards = await prisma.powerCard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const powerCardWithIdOnly = await prisma.powerCard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PowerCardFindManyArgs>(args?: SelectSubset<T, PowerCardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PowerCard.
     * @param {PowerCardCreateArgs} args - Arguments to create a PowerCard.
     * @example
     * // Create one PowerCard
     * const PowerCard = await prisma.powerCard.create({
     *   data: {
     *     // ... data to create a PowerCard
     *   }
     * })
     * 
     */
    create<T extends PowerCardCreateArgs>(args: SelectSubset<T, PowerCardCreateArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PowerCards.
     * @param {PowerCardCreateManyArgs} args - Arguments to create many PowerCards.
     * @example
     * // Create many PowerCards
     * const powerCard = await prisma.powerCard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PowerCardCreateManyArgs>(args?: SelectSubset<T, PowerCardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PowerCards and returns the data saved in the database.
     * @param {PowerCardCreateManyAndReturnArgs} args - Arguments to create many PowerCards.
     * @example
     * // Create many PowerCards
     * const powerCard = await prisma.powerCard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PowerCards and only return the `id`
     * const powerCardWithIdOnly = await prisma.powerCard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PowerCardCreateManyAndReturnArgs>(args?: SelectSubset<T, PowerCardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PowerCard.
     * @param {PowerCardDeleteArgs} args - Arguments to delete one PowerCard.
     * @example
     * // Delete one PowerCard
     * const PowerCard = await prisma.powerCard.delete({
     *   where: {
     *     // ... filter to delete one PowerCard
     *   }
     * })
     * 
     */
    delete<T extends PowerCardDeleteArgs>(args: SelectSubset<T, PowerCardDeleteArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PowerCard.
     * @param {PowerCardUpdateArgs} args - Arguments to update one PowerCard.
     * @example
     * // Update one PowerCard
     * const powerCard = await prisma.powerCard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PowerCardUpdateArgs>(args: SelectSubset<T, PowerCardUpdateArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PowerCards.
     * @param {PowerCardDeleteManyArgs} args - Arguments to filter PowerCards to delete.
     * @example
     * // Delete a few PowerCards
     * const { count } = await prisma.powerCard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PowerCardDeleteManyArgs>(args?: SelectSubset<T, PowerCardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PowerCards
     * const powerCard = await prisma.powerCard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PowerCardUpdateManyArgs>(args: SelectSubset<T, PowerCardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerCards and returns the data updated in the database.
     * @param {PowerCardUpdateManyAndReturnArgs} args - Arguments to update many PowerCards.
     * @example
     * // Update many PowerCards
     * const powerCard = await prisma.powerCard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PowerCards and only return the `id`
     * const powerCardWithIdOnly = await prisma.powerCard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PowerCardUpdateManyAndReturnArgs>(args: SelectSubset<T, PowerCardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PowerCard.
     * @param {PowerCardUpsertArgs} args - Arguments to update or create a PowerCard.
     * @example
     * // Update or create a PowerCard
     * const powerCard = await prisma.powerCard.upsert({
     *   create: {
     *     // ... data to create a PowerCard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PowerCard we want to update
     *   }
     * })
     */
    upsert<T extends PowerCardUpsertArgs>(args: SelectSubset<T, PowerCardUpsertArgs<ExtArgs>>): Prisma__PowerCardClient<$Result.GetResult<Prisma.$PowerCardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PowerCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardCountArgs} args - Arguments to filter PowerCards to count.
     * @example
     * // Count the number of PowerCards
     * const count = await prisma.powerCard.count({
     *   where: {
     *     // ... the filter for the PowerCards we want to count
     *   }
     * })
    **/
    count<T extends PowerCardCountArgs>(
      args?: Subset<T, PowerCardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PowerCardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PowerCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PowerCardAggregateArgs>(args: Subset<T, PowerCardAggregateArgs>): Prisma.PrismaPromise<GetPowerCardAggregateType<T>>

    /**
     * Group by PowerCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerCardGroupByArgs} args - Group by arguments.
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
      T extends PowerCardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PowerCardGroupByArgs['orderBy'] }
        : { orderBy?: PowerCardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, PowerCardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPowerCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PowerCard model
   */
  readonly fields: PowerCardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PowerCard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PowerCardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PowerCard model
   */
  interface PowerCardFieldRefs {
    readonly id: FieldRef<"PowerCard", 'String'>
    readonly team_id: FieldRef<"PowerCard", 'String'>
    readonly type: FieldRef<"PowerCard", 'PowerCardType'>
    readonly is_used: FieldRef<"PowerCard", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * PowerCard findUnique
   */
  export type PowerCardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * Filter, which PowerCard to fetch.
     */
    where: PowerCardWhereUniqueInput
  }

  /**
   * PowerCard findUniqueOrThrow
   */
  export type PowerCardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * Filter, which PowerCard to fetch.
     */
    where: PowerCardWhereUniqueInput
  }

  /**
   * PowerCard findFirst
   */
  export type PowerCardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * Filter, which PowerCard to fetch.
     */
    where?: PowerCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerCards to fetch.
     */
    orderBy?: PowerCardOrderByWithRelationInput | PowerCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerCards.
     */
    cursor?: PowerCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerCards.
     */
    distinct?: PowerCardScalarFieldEnum | PowerCardScalarFieldEnum[]
  }

  /**
   * PowerCard findFirstOrThrow
   */
  export type PowerCardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * Filter, which PowerCard to fetch.
     */
    where?: PowerCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerCards to fetch.
     */
    orderBy?: PowerCardOrderByWithRelationInput | PowerCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerCards.
     */
    cursor?: PowerCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerCards.
     */
    distinct?: PowerCardScalarFieldEnum | PowerCardScalarFieldEnum[]
  }

  /**
   * PowerCard findMany
   */
  export type PowerCardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * Filter, which PowerCards to fetch.
     */
    where?: PowerCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerCards to fetch.
     */
    orderBy?: PowerCardOrderByWithRelationInput | PowerCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PowerCards.
     */
    cursor?: PowerCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerCards.
     */
    skip?: number
    distinct?: PowerCardScalarFieldEnum | PowerCardScalarFieldEnum[]
  }

  /**
   * PowerCard create
   */
  export type PowerCardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * The data needed to create a PowerCard.
     */
    data: XOR<PowerCardCreateInput, PowerCardUncheckedCreateInput>
  }

  /**
   * PowerCard createMany
   */
  export type PowerCardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PowerCards.
     */
    data: PowerCardCreateManyInput | PowerCardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PowerCard createManyAndReturn
   */
  export type PowerCardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * The data used to create many PowerCards.
     */
    data: PowerCardCreateManyInput | PowerCardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PowerCard update
   */
  export type PowerCardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * The data needed to update a PowerCard.
     */
    data: XOR<PowerCardUpdateInput, PowerCardUncheckedUpdateInput>
    /**
     * Choose, which PowerCard to update.
     */
    where: PowerCardWhereUniqueInput
  }

  /**
   * PowerCard updateMany
   */
  export type PowerCardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PowerCards.
     */
    data: XOR<PowerCardUpdateManyMutationInput, PowerCardUncheckedUpdateManyInput>
    /**
     * Filter which PowerCards to update
     */
    where?: PowerCardWhereInput
    /**
     * Limit how many PowerCards to update.
     */
    limit?: number
  }

  /**
   * PowerCard updateManyAndReturn
   */
  export type PowerCardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * The data used to update PowerCards.
     */
    data: XOR<PowerCardUpdateManyMutationInput, PowerCardUncheckedUpdateManyInput>
    /**
     * Filter which PowerCards to update
     */
    where?: PowerCardWhereInput
    /**
     * Limit how many PowerCards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PowerCard upsert
   */
  export type PowerCardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * The filter to search for the PowerCard to update in case it exists.
     */
    where: PowerCardWhereUniqueInput
    /**
     * In case the PowerCard found by the `where` argument doesn't exist, create a new PowerCard with this data.
     */
    create: XOR<PowerCardCreateInput, PowerCardUncheckedCreateInput>
    /**
     * In case the PowerCard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PowerCardUpdateInput, PowerCardUncheckedUpdateInput>
  }

  /**
   * PowerCard delete
   */
  export type PowerCardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
    /**
     * Filter which PowerCard to delete.
     */
    where: PowerCardWhereUniqueInput
  }

  /**
   * PowerCard deleteMany
   */
  export type PowerCardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerCards to delete
     */
    where?: PowerCardWhereInput
    /**
     * Limit how many PowerCards to delete.
     */
    limit?: number
  }

  /**
   * PowerCard without action
   */
  export type PowerCardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerCard
     */
    select?: PowerCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerCard
     */
    omit?: PowerCardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerCardInclude<ExtArgs> | null
  }


  /**
   * Model Top11Selection
   */

  export type AggregateTop11Selection = {
    _count: Top11SelectionCountAggregateOutputType | null
    _min: Top11SelectionMinAggregateOutputType | null
    _max: Top11SelectionMaxAggregateOutputType | null
  }

  export type Top11SelectionMinAggregateOutputType = {
    team_id: string | null
    captain_id: string | null
    vice_captain_id: string | null
    submitted_at: Date | null
  }

  export type Top11SelectionMaxAggregateOutputType = {
    team_id: string | null
    captain_id: string | null
    vice_captain_id: string | null
    submitted_at: Date | null
  }

  export type Top11SelectionCountAggregateOutputType = {
    team_id: number
    player_ids: number
    captain_id: number
    vice_captain_id: number
    submitted_at: number
    _all: number
  }


  export type Top11SelectionMinAggregateInputType = {
    team_id?: true
    captain_id?: true
    vice_captain_id?: true
    submitted_at?: true
  }

  export type Top11SelectionMaxAggregateInputType = {
    team_id?: true
    captain_id?: true
    vice_captain_id?: true
    submitted_at?: true
  }

  export type Top11SelectionCountAggregateInputType = {
    team_id?: true
    player_ids?: true
    captain_id?: true
    vice_captain_id?: true
    submitted_at?: true
    _all?: true
  }

  export type Top11SelectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Top11Selection to aggregate.
     */
    where?: Top11SelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Top11Selections to fetch.
     */
    orderBy?: Top11SelectionOrderByWithRelationInput | Top11SelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Top11SelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Top11Selections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Top11Selections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Top11Selections
    **/
    _count?: true | Top11SelectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Top11SelectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Top11SelectionMaxAggregateInputType
  }

  export type GetTop11SelectionAggregateType<T extends Top11SelectionAggregateArgs> = {
        [P in keyof T & keyof AggregateTop11Selection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTop11Selection[P]>
      : GetScalarType<T[P], AggregateTop11Selection[P]>
  }




  export type Top11SelectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Top11SelectionWhereInput
    orderBy?: Top11SelectionOrderByWithAggregationInput | Top11SelectionOrderByWithAggregationInput[]
    by: Top11SelectionScalarFieldEnum[] | Top11SelectionScalarFieldEnum
    having?: Top11SelectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Top11SelectionCountAggregateInputType | true
    _min?: Top11SelectionMinAggregateInputType
    _max?: Top11SelectionMaxAggregateInputType
  }

  export type Top11SelectionGroupByOutputType = {
    team_id: string
    player_ids: string[]
    captain_id: string
    vice_captain_id: string
    submitted_at: Date
    _count: Top11SelectionCountAggregateOutputType | null
    _min: Top11SelectionMinAggregateOutputType | null
    _max: Top11SelectionMaxAggregateOutputType | null
  }

  type GetTop11SelectionGroupByPayload<T extends Top11SelectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Top11SelectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Top11SelectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Top11SelectionGroupByOutputType[P]>
            : GetScalarType<T[P], Top11SelectionGroupByOutputType[P]>
        }
      >
    >


  export type Top11SelectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    team_id?: boolean
    player_ids?: boolean
    captain_id?: boolean
    vice_captain_id?: boolean
    submitted_at?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["top11Selection"]>

  export type Top11SelectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    team_id?: boolean
    player_ids?: boolean
    captain_id?: boolean
    vice_captain_id?: boolean
    submitted_at?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["top11Selection"]>

  export type Top11SelectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    team_id?: boolean
    player_ids?: boolean
    captain_id?: boolean
    vice_captain_id?: boolean
    submitted_at?: boolean
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["top11Selection"]>

  export type Top11SelectionSelectScalar = {
    team_id?: boolean
    player_ids?: boolean
    captain_id?: boolean
    vice_captain_id?: boolean
    submitted_at?: boolean
  }

  export type Top11SelectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"team_id" | "player_ids" | "captain_id" | "vice_captain_id" | "submitted_at", ExtArgs["result"]["top11Selection"]>
  export type Top11SelectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type Top11SelectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type Top11SelectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $Top11SelectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Top11Selection"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      team_id: string
      player_ids: string[]
      captain_id: string
      vice_captain_id: string
      submitted_at: Date
    }, ExtArgs["result"]["top11Selection"]>
    composites: {}
  }

  type Top11SelectionGetPayload<S extends boolean | null | undefined | Top11SelectionDefaultArgs> = $Result.GetResult<Prisma.$Top11SelectionPayload, S>

  type Top11SelectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<Top11SelectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Top11SelectionCountAggregateInputType | true
    }

  export interface Top11SelectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Top11Selection'], meta: { name: 'Top11Selection' } }
    /**
     * Find zero or one Top11Selection that matches the filter.
     * @param {Top11SelectionFindUniqueArgs} args - Arguments to find a Top11Selection
     * @example
     * // Get one Top11Selection
     * const top11Selection = await prisma.top11Selection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Top11SelectionFindUniqueArgs>(args: SelectSubset<T, Top11SelectionFindUniqueArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Top11Selection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Top11SelectionFindUniqueOrThrowArgs} args - Arguments to find a Top11Selection
     * @example
     * // Get one Top11Selection
     * const top11Selection = await prisma.top11Selection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Top11SelectionFindUniqueOrThrowArgs>(args: SelectSubset<T, Top11SelectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Top11Selection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionFindFirstArgs} args - Arguments to find a Top11Selection
     * @example
     * // Get one Top11Selection
     * const top11Selection = await prisma.top11Selection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Top11SelectionFindFirstArgs>(args?: SelectSubset<T, Top11SelectionFindFirstArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Top11Selection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionFindFirstOrThrowArgs} args - Arguments to find a Top11Selection
     * @example
     * // Get one Top11Selection
     * const top11Selection = await prisma.top11Selection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Top11SelectionFindFirstOrThrowArgs>(args?: SelectSubset<T, Top11SelectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Top11Selections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Top11Selections
     * const top11Selections = await prisma.top11Selection.findMany()
     * 
     * // Get first 10 Top11Selections
     * const top11Selections = await prisma.top11Selection.findMany({ take: 10 })
     * 
     * // Only select the `team_id`
     * const top11SelectionWithTeam_idOnly = await prisma.top11Selection.findMany({ select: { team_id: true } })
     * 
     */
    findMany<T extends Top11SelectionFindManyArgs>(args?: SelectSubset<T, Top11SelectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Top11Selection.
     * @param {Top11SelectionCreateArgs} args - Arguments to create a Top11Selection.
     * @example
     * // Create one Top11Selection
     * const Top11Selection = await prisma.top11Selection.create({
     *   data: {
     *     // ... data to create a Top11Selection
     *   }
     * })
     * 
     */
    create<T extends Top11SelectionCreateArgs>(args: SelectSubset<T, Top11SelectionCreateArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Top11Selections.
     * @param {Top11SelectionCreateManyArgs} args - Arguments to create many Top11Selections.
     * @example
     * // Create many Top11Selections
     * const top11Selection = await prisma.top11Selection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Top11SelectionCreateManyArgs>(args?: SelectSubset<T, Top11SelectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Top11Selections and returns the data saved in the database.
     * @param {Top11SelectionCreateManyAndReturnArgs} args - Arguments to create many Top11Selections.
     * @example
     * // Create many Top11Selections
     * const top11Selection = await prisma.top11Selection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Top11Selections and only return the `team_id`
     * const top11SelectionWithTeam_idOnly = await prisma.top11Selection.createManyAndReturn({
     *   select: { team_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends Top11SelectionCreateManyAndReturnArgs>(args?: SelectSubset<T, Top11SelectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Top11Selection.
     * @param {Top11SelectionDeleteArgs} args - Arguments to delete one Top11Selection.
     * @example
     * // Delete one Top11Selection
     * const Top11Selection = await prisma.top11Selection.delete({
     *   where: {
     *     // ... filter to delete one Top11Selection
     *   }
     * })
     * 
     */
    delete<T extends Top11SelectionDeleteArgs>(args: SelectSubset<T, Top11SelectionDeleteArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Top11Selection.
     * @param {Top11SelectionUpdateArgs} args - Arguments to update one Top11Selection.
     * @example
     * // Update one Top11Selection
     * const top11Selection = await prisma.top11Selection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Top11SelectionUpdateArgs>(args: SelectSubset<T, Top11SelectionUpdateArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Top11Selections.
     * @param {Top11SelectionDeleteManyArgs} args - Arguments to filter Top11Selections to delete.
     * @example
     * // Delete a few Top11Selections
     * const { count } = await prisma.top11Selection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Top11SelectionDeleteManyArgs>(args?: SelectSubset<T, Top11SelectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Top11Selections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Top11Selections
     * const top11Selection = await prisma.top11Selection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Top11SelectionUpdateManyArgs>(args: SelectSubset<T, Top11SelectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Top11Selections and returns the data updated in the database.
     * @param {Top11SelectionUpdateManyAndReturnArgs} args - Arguments to update many Top11Selections.
     * @example
     * // Update many Top11Selections
     * const top11Selection = await prisma.top11Selection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Top11Selections and only return the `team_id`
     * const top11SelectionWithTeam_idOnly = await prisma.top11Selection.updateManyAndReturn({
     *   select: { team_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends Top11SelectionUpdateManyAndReturnArgs>(args: SelectSubset<T, Top11SelectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Top11Selection.
     * @param {Top11SelectionUpsertArgs} args - Arguments to update or create a Top11Selection.
     * @example
     * // Update or create a Top11Selection
     * const top11Selection = await prisma.top11Selection.upsert({
     *   create: {
     *     // ... data to create a Top11Selection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Top11Selection we want to update
     *   }
     * })
     */
    upsert<T extends Top11SelectionUpsertArgs>(args: SelectSubset<T, Top11SelectionUpsertArgs<ExtArgs>>): Prisma__Top11SelectionClient<$Result.GetResult<Prisma.$Top11SelectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Top11Selections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionCountArgs} args - Arguments to filter Top11Selections to count.
     * @example
     * // Count the number of Top11Selections
     * const count = await prisma.top11Selection.count({
     *   where: {
     *     // ... the filter for the Top11Selections we want to count
     *   }
     * })
    **/
    count<T extends Top11SelectionCountArgs>(
      args?: Subset<T, Top11SelectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Top11SelectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Top11Selection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Top11SelectionAggregateArgs>(args: Subset<T, Top11SelectionAggregateArgs>): Prisma.PrismaPromise<GetTop11SelectionAggregateType<T>>

    /**
     * Group by Top11Selection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Top11SelectionGroupByArgs} args - Group by arguments.
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
      T extends Top11SelectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Top11SelectionGroupByArgs['orderBy'] }
        : { orderBy?: Top11SelectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, Top11SelectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTop11SelectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Top11Selection model
   */
  readonly fields: Top11SelectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Top11Selection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Top11SelectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Top11Selection model
   */
  interface Top11SelectionFieldRefs {
    readonly team_id: FieldRef<"Top11Selection", 'String'>
    readonly player_ids: FieldRef<"Top11Selection", 'String[]'>
    readonly captain_id: FieldRef<"Top11Selection", 'String'>
    readonly vice_captain_id: FieldRef<"Top11Selection", 'String'>
    readonly submitted_at: FieldRef<"Top11Selection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Top11Selection findUnique
   */
  export type Top11SelectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * Filter, which Top11Selection to fetch.
     */
    where: Top11SelectionWhereUniqueInput
  }

  /**
   * Top11Selection findUniqueOrThrow
   */
  export type Top11SelectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * Filter, which Top11Selection to fetch.
     */
    where: Top11SelectionWhereUniqueInput
  }

  /**
   * Top11Selection findFirst
   */
  export type Top11SelectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * Filter, which Top11Selection to fetch.
     */
    where?: Top11SelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Top11Selections to fetch.
     */
    orderBy?: Top11SelectionOrderByWithRelationInput | Top11SelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Top11Selections.
     */
    cursor?: Top11SelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Top11Selections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Top11Selections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Top11Selections.
     */
    distinct?: Top11SelectionScalarFieldEnum | Top11SelectionScalarFieldEnum[]
  }

  /**
   * Top11Selection findFirstOrThrow
   */
  export type Top11SelectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * Filter, which Top11Selection to fetch.
     */
    where?: Top11SelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Top11Selections to fetch.
     */
    orderBy?: Top11SelectionOrderByWithRelationInput | Top11SelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Top11Selections.
     */
    cursor?: Top11SelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Top11Selections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Top11Selections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Top11Selections.
     */
    distinct?: Top11SelectionScalarFieldEnum | Top11SelectionScalarFieldEnum[]
  }

  /**
   * Top11Selection findMany
   */
  export type Top11SelectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * Filter, which Top11Selections to fetch.
     */
    where?: Top11SelectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Top11Selections to fetch.
     */
    orderBy?: Top11SelectionOrderByWithRelationInput | Top11SelectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Top11Selections.
     */
    cursor?: Top11SelectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Top11Selections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Top11Selections.
     */
    skip?: number
    distinct?: Top11SelectionScalarFieldEnum | Top11SelectionScalarFieldEnum[]
  }

  /**
   * Top11Selection create
   */
  export type Top11SelectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Top11Selection.
     */
    data: XOR<Top11SelectionCreateInput, Top11SelectionUncheckedCreateInput>
  }

  /**
   * Top11Selection createMany
   */
  export type Top11SelectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Top11Selections.
     */
    data: Top11SelectionCreateManyInput | Top11SelectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Top11Selection createManyAndReturn
   */
  export type Top11SelectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * The data used to create many Top11Selections.
     */
    data: Top11SelectionCreateManyInput | Top11SelectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Top11Selection update
   */
  export type Top11SelectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Top11Selection.
     */
    data: XOR<Top11SelectionUpdateInput, Top11SelectionUncheckedUpdateInput>
    /**
     * Choose, which Top11Selection to update.
     */
    where: Top11SelectionWhereUniqueInput
  }

  /**
   * Top11Selection updateMany
   */
  export type Top11SelectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Top11Selections.
     */
    data: XOR<Top11SelectionUpdateManyMutationInput, Top11SelectionUncheckedUpdateManyInput>
    /**
     * Filter which Top11Selections to update
     */
    where?: Top11SelectionWhereInput
    /**
     * Limit how many Top11Selections to update.
     */
    limit?: number
  }

  /**
   * Top11Selection updateManyAndReturn
   */
  export type Top11SelectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * The data used to update Top11Selections.
     */
    data: XOR<Top11SelectionUpdateManyMutationInput, Top11SelectionUncheckedUpdateManyInput>
    /**
     * Filter which Top11Selections to update
     */
    where?: Top11SelectionWhereInput
    /**
     * Limit how many Top11Selections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Top11Selection upsert
   */
  export type Top11SelectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Top11Selection to update in case it exists.
     */
    where: Top11SelectionWhereUniqueInput
    /**
     * In case the Top11Selection found by the `where` argument doesn't exist, create a new Top11Selection with this data.
     */
    create: XOR<Top11SelectionCreateInput, Top11SelectionUncheckedCreateInput>
    /**
     * In case the Top11Selection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Top11SelectionUpdateInput, Top11SelectionUncheckedUpdateInput>
  }

  /**
   * Top11Selection delete
   */
  export type Top11SelectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
    /**
     * Filter which Top11Selection to delete.
     */
    where: Top11SelectionWhereUniqueInput
  }

  /**
   * Top11Selection deleteMany
   */
  export type Top11SelectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Top11Selections to delete
     */
    where?: Top11SelectionWhereInput
    /**
     * Limit how many Top11Selections to delete.
     */
    limit?: number
  }

  /**
   * Top11Selection without action
   */
  export type Top11SelectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Top11Selection
     */
    select?: Top11SelectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Top11Selection
     */
    omit?: Top11SelectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Top11SelectionInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    action: string | null
    created_at: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    created_at: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    action: number
    details: number
    created_at: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    action?: true
    created_at?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    created_at?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    action?: true
    details?: true
    created_at?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    action: string
    details: JsonValue
    created_at: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "details" | "created_at", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string
      details: Prisma.JsonValue
      created_at: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'Json'>
    readonly created_at: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model Franchise
   */

  export type AggregateFranchise = {
    _count: FranchiseCountAggregateOutputType | null
    _avg: FranchiseAvgAggregateOutputType | null
    _sum: FranchiseSumAggregateOutputType | null
    _min: FranchiseMinAggregateOutputType | null
    _max: FranchiseMaxAggregateOutputType | null
  }

  export type FranchiseAvgAggregateOutputType = {
    id: number | null
    brand_score: Decimal | null
  }

  export type FranchiseSumAggregateOutputType = {
    id: number | null
    brand_score: Decimal | null
  }

  export type FranchiseMinAggregateOutputType = {
    id: number | null
    name: string | null
    short_name: string | null
    brand_score: Decimal | null
    logo: string | null
    primary_color: string | null
  }

  export type FranchiseMaxAggregateOutputType = {
    id: number | null
    name: string | null
    short_name: string | null
    brand_score: Decimal | null
    logo: string | null
    primary_color: string | null
  }

  export type FranchiseCountAggregateOutputType = {
    id: number
    name: number
    short_name: number
    brand_score: number
    logo: number
    primary_color: number
    _all: number
  }


  export type FranchiseAvgAggregateInputType = {
    id?: true
    brand_score?: true
  }

  export type FranchiseSumAggregateInputType = {
    id?: true
    brand_score?: true
  }

  export type FranchiseMinAggregateInputType = {
    id?: true
    name?: true
    short_name?: true
    brand_score?: true
    logo?: true
    primary_color?: true
  }

  export type FranchiseMaxAggregateInputType = {
    id?: true
    name?: true
    short_name?: true
    brand_score?: true
    logo?: true
    primary_color?: true
  }

  export type FranchiseCountAggregateInputType = {
    id?: true
    name?: true
    short_name?: true
    brand_score?: true
    logo?: true
    primary_color?: true
    _all?: true
  }

  export type FranchiseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Franchise to aggregate.
     */
    where?: FranchiseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Franchises to fetch.
     */
    orderBy?: FranchiseOrderByWithRelationInput | FranchiseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FranchiseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Franchises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Franchises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Franchises
    **/
    _count?: true | FranchiseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FranchiseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FranchiseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FranchiseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FranchiseMaxAggregateInputType
  }

  export type GetFranchiseAggregateType<T extends FranchiseAggregateArgs> = {
        [P in keyof T & keyof AggregateFranchise]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFranchise[P]>
      : GetScalarType<T[P], AggregateFranchise[P]>
  }




  export type FranchiseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FranchiseWhereInput
    orderBy?: FranchiseOrderByWithAggregationInput | FranchiseOrderByWithAggregationInput[]
    by: FranchiseScalarFieldEnum[] | FranchiseScalarFieldEnum
    having?: FranchiseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FranchiseCountAggregateInputType | true
    _avg?: FranchiseAvgAggregateInputType
    _sum?: FranchiseSumAggregateInputType
    _min?: FranchiseMinAggregateInputType
    _max?: FranchiseMaxAggregateInputType
  }

  export type FranchiseGroupByOutputType = {
    id: number
    name: string
    short_name: string
    brand_score: Decimal
    logo: string | null
    primary_color: string | null
    _count: FranchiseCountAggregateOutputType | null
    _avg: FranchiseAvgAggregateOutputType | null
    _sum: FranchiseSumAggregateOutputType | null
    _min: FranchiseMinAggregateOutputType | null
    _max: FranchiseMaxAggregateOutputType | null
  }

  type GetFranchiseGroupByPayload<T extends FranchiseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FranchiseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FranchiseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FranchiseGroupByOutputType[P]>
            : GetScalarType<T[P], FranchiseGroupByOutputType[P]>
        }
      >
    >


  export type FranchiseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    short_name?: boolean
    brand_score?: boolean
    logo?: boolean
    primary_color?: boolean
  }, ExtArgs["result"]["franchise"]>

  export type FranchiseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    short_name?: boolean
    brand_score?: boolean
    logo?: boolean
    primary_color?: boolean
  }, ExtArgs["result"]["franchise"]>

  export type FranchiseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    short_name?: boolean
    brand_score?: boolean
    logo?: boolean
    primary_color?: boolean
  }, ExtArgs["result"]["franchise"]>

  export type FranchiseSelectScalar = {
    id?: boolean
    name?: boolean
    short_name?: boolean
    brand_score?: boolean
    logo?: boolean
    primary_color?: boolean
  }

  export type FranchiseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "short_name" | "brand_score" | "logo" | "primary_color", ExtArgs["result"]["franchise"]>

  export type $FranchisePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Franchise"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      short_name: string
      brand_score: Prisma.Decimal
      logo: string | null
      primary_color: string | null
    }, ExtArgs["result"]["franchise"]>
    composites: {}
  }

  type FranchiseGetPayload<S extends boolean | null | undefined | FranchiseDefaultArgs> = $Result.GetResult<Prisma.$FranchisePayload, S>

  type FranchiseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FranchiseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FranchiseCountAggregateInputType | true
    }

  export interface FranchiseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Franchise'], meta: { name: 'Franchise' } }
    /**
     * Find zero or one Franchise that matches the filter.
     * @param {FranchiseFindUniqueArgs} args - Arguments to find a Franchise
     * @example
     * // Get one Franchise
     * const franchise = await prisma.franchise.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FranchiseFindUniqueArgs>(args: SelectSubset<T, FranchiseFindUniqueArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Franchise that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FranchiseFindUniqueOrThrowArgs} args - Arguments to find a Franchise
     * @example
     * // Get one Franchise
     * const franchise = await prisma.franchise.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FranchiseFindUniqueOrThrowArgs>(args: SelectSubset<T, FranchiseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Franchise that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseFindFirstArgs} args - Arguments to find a Franchise
     * @example
     * // Get one Franchise
     * const franchise = await prisma.franchise.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FranchiseFindFirstArgs>(args?: SelectSubset<T, FranchiseFindFirstArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Franchise that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseFindFirstOrThrowArgs} args - Arguments to find a Franchise
     * @example
     * // Get one Franchise
     * const franchise = await prisma.franchise.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FranchiseFindFirstOrThrowArgs>(args?: SelectSubset<T, FranchiseFindFirstOrThrowArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Franchises that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Franchises
     * const franchises = await prisma.franchise.findMany()
     * 
     * // Get first 10 Franchises
     * const franchises = await prisma.franchise.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const franchiseWithIdOnly = await prisma.franchise.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FranchiseFindManyArgs>(args?: SelectSubset<T, FranchiseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Franchise.
     * @param {FranchiseCreateArgs} args - Arguments to create a Franchise.
     * @example
     * // Create one Franchise
     * const Franchise = await prisma.franchise.create({
     *   data: {
     *     // ... data to create a Franchise
     *   }
     * })
     * 
     */
    create<T extends FranchiseCreateArgs>(args: SelectSubset<T, FranchiseCreateArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Franchises.
     * @param {FranchiseCreateManyArgs} args - Arguments to create many Franchises.
     * @example
     * // Create many Franchises
     * const franchise = await prisma.franchise.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FranchiseCreateManyArgs>(args?: SelectSubset<T, FranchiseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Franchises and returns the data saved in the database.
     * @param {FranchiseCreateManyAndReturnArgs} args - Arguments to create many Franchises.
     * @example
     * // Create many Franchises
     * const franchise = await prisma.franchise.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Franchises and only return the `id`
     * const franchiseWithIdOnly = await prisma.franchise.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FranchiseCreateManyAndReturnArgs>(args?: SelectSubset<T, FranchiseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Franchise.
     * @param {FranchiseDeleteArgs} args - Arguments to delete one Franchise.
     * @example
     * // Delete one Franchise
     * const Franchise = await prisma.franchise.delete({
     *   where: {
     *     // ... filter to delete one Franchise
     *   }
     * })
     * 
     */
    delete<T extends FranchiseDeleteArgs>(args: SelectSubset<T, FranchiseDeleteArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Franchise.
     * @param {FranchiseUpdateArgs} args - Arguments to update one Franchise.
     * @example
     * // Update one Franchise
     * const franchise = await prisma.franchise.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FranchiseUpdateArgs>(args: SelectSubset<T, FranchiseUpdateArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Franchises.
     * @param {FranchiseDeleteManyArgs} args - Arguments to filter Franchises to delete.
     * @example
     * // Delete a few Franchises
     * const { count } = await prisma.franchise.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FranchiseDeleteManyArgs>(args?: SelectSubset<T, FranchiseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Franchises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Franchises
     * const franchise = await prisma.franchise.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FranchiseUpdateManyArgs>(args: SelectSubset<T, FranchiseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Franchises and returns the data updated in the database.
     * @param {FranchiseUpdateManyAndReturnArgs} args - Arguments to update many Franchises.
     * @example
     * // Update many Franchises
     * const franchise = await prisma.franchise.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Franchises and only return the `id`
     * const franchiseWithIdOnly = await prisma.franchise.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FranchiseUpdateManyAndReturnArgs>(args: SelectSubset<T, FranchiseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Franchise.
     * @param {FranchiseUpsertArgs} args - Arguments to update or create a Franchise.
     * @example
     * // Update or create a Franchise
     * const franchise = await prisma.franchise.upsert({
     *   create: {
     *     // ... data to create a Franchise
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Franchise we want to update
     *   }
     * })
     */
    upsert<T extends FranchiseUpsertArgs>(args: SelectSubset<T, FranchiseUpsertArgs<ExtArgs>>): Prisma__FranchiseClient<$Result.GetResult<Prisma.$FranchisePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Franchises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseCountArgs} args - Arguments to filter Franchises to count.
     * @example
     * // Count the number of Franchises
     * const count = await prisma.franchise.count({
     *   where: {
     *     // ... the filter for the Franchises we want to count
     *   }
     * })
    **/
    count<T extends FranchiseCountArgs>(
      args?: Subset<T, FranchiseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FranchiseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Franchise.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FranchiseAggregateArgs>(args: Subset<T, FranchiseAggregateArgs>): Prisma.PrismaPromise<GetFranchiseAggregateType<T>>

    /**
     * Group by Franchise.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FranchiseGroupByArgs} args - Group by arguments.
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
      T extends FranchiseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FranchiseGroupByArgs['orderBy'] }
        : { orderBy?: FranchiseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, FranchiseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFranchiseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Franchise model
   */
  readonly fields: FranchiseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Franchise.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FranchiseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Franchise model
   */
  interface FranchiseFieldRefs {
    readonly id: FieldRef<"Franchise", 'Int'>
    readonly name: FieldRef<"Franchise", 'String'>
    readonly short_name: FieldRef<"Franchise", 'String'>
    readonly brand_score: FieldRef<"Franchise", 'Decimal'>
    readonly logo: FieldRef<"Franchise", 'String'>
    readonly primary_color: FieldRef<"Franchise", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Franchise findUnique
   */
  export type FranchiseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * Filter, which Franchise to fetch.
     */
    where: FranchiseWhereUniqueInput
  }

  /**
   * Franchise findUniqueOrThrow
   */
  export type FranchiseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * Filter, which Franchise to fetch.
     */
    where: FranchiseWhereUniqueInput
  }

  /**
   * Franchise findFirst
   */
  export type FranchiseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * Filter, which Franchise to fetch.
     */
    where?: FranchiseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Franchises to fetch.
     */
    orderBy?: FranchiseOrderByWithRelationInput | FranchiseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Franchises.
     */
    cursor?: FranchiseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Franchises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Franchises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Franchises.
     */
    distinct?: FranchiseScalarFieldEnum | FranchiseScalarFieldEnum[]
  }

  /**
   * Franchise findFirstOrThrow
   */
  export type FranchiseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * Filter, which Franchise to fetch.
     */
    where?: FranchiseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Franchises to fetch.
     */
    orderBy?: FranchiseOrderByWithRelationInput | FranchiseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Franchises.
     */
    cursor?: FranchiseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Franchises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Franchises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Franchises.
     */
    distinct?: FranchiseScalarFieldEnum | FranchiseScalarFieldEnum[]
  }

  /**
   * Franchise findMany
   */
  export type FranchiseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * Filter, which Franchises to fetch.
     */
    where?: FranchiseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Franchises to fetch.
     */
    orderBy?: FranchiseOrderByWithRelationInput | FranchiseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Franchises.
     */
    cursor?: FranchiseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Franchises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Franchises.
     */
    skip?: number
    distinct?: FranchiseScalarFieldEnum | FranchiseScalarFieldEnum[]
  }

  /**
   * Franchise create
   */
  export type FranchiseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * The data needed to create a Franchise.
     */
    data: XOR<FranchiseCreateInput, FranchiseUncheckedCreateInput>
  }

  /**
   * Franchise createMany
   */
  export type FranchiseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Franchises.
     */
    data: FranchiseCreateManyInput | FranchiseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Franchise createManyAndReturn
   */
  export type FranchiseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * The data used to create many Franchises.
     */
    data: FranchiseCreateManyInput | FranchiseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Franchise update
   */
  export type FranchiseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * The data needed to update a Franchise.
     */
    data: XOR<FranchiseUpdateInput, FranchiseUncheckedUpdateInput>
    /**
     * Choose, which Franchise to update.
     */
    where: FranchiseWhereUniqueInput
  }

  /**
   * Franchise updateMany
   */
  export type FranchiseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Franchises.
     */
    data: XOR<FranchiseUpdateManyMutationInput, FranchiseUncheckedUpdateManyInput>
    /**
     * Filter which Franchises to update
     */
    where?: FranchiseWhereInput
    /**
     * Limit how many Franchises to update.
     */
    limit?: number
  }

  /**
   * Franchise updateManyAndReturn
   */
  export type FranchiseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * The data used to update Franchises.
     */
    data: XOR<FranchiseUpdateManyMutationInput, FranchiseUncheckedUpdateManyInput>
    /**
     * Filter which Franchises to update
     */
    where?: FranchiseWhereInput
    /**
     * Limit how many Franchises to update.
     */
    limit?: number
  }

  /**
   * Franchise upsert
   */
  export type FranchiseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * The filter to search for the Franchise to update in case it exists.
     */
    where: FranchiseWhereUniqueInput
    /**
     * In case the Franchise found by the `where` argument doesn't exist, create a new Franchise with this data.
     */
    create: XOR<FranchiseCreateInput, FranchiseUncheckedCreateInput>
    /**
     * In case the Franchise was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FranchiseUpdateInput, FranchiseUncheckedUpdateInput>
  }

  /**
   * Franchise delete
   */
  export type FranchiseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
    /**
     * Filter which Franchise to delete.
     */
    where: FranchiseWhereUniqueInput
  }

  /**
   * Franchise deleteMany
   */
  export type FranchiseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Franchises to delete
     */
    where?: FranchiseWhereInput
    /**
     * Limit how many Franchises to delete.
     */
    limit?: number
  }

  /**
   * Franchise without action
   */
  export type FranchiseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Franchise
     */
    select?: FranchiseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Franchise
     */
    omit?: FranchiseOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    password_hash: 'password_hash',
    active_session_id: 'active_session_id',
    brand_key: 'brand_key',
    franchise_name: 'franchise_name',
    brand_score: 'brand_score',
    purse_remaining: 'purse_remaining',
    squad_count: 'squad_count',
    overseas_count: 'overseas_count',
    batsmen_count: 'batsmen_count',
    bowlers_count: 'bowlers_count',
    ar_count: 'ar_count',
    wk_count: 'wk_count',
    purchased_players: 'purchased_players',
    logo: 'logo',
    primary_color: 'primary_color',
    created_at: 'created_at'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const PlayerScalarFieldEnum: {
    id: 'id',
    rank: 'rank',
    name: 'name',
    team: 'team',
    role: 'role',
    category: 'category',
    pool: 'pool',
    grade: 'grade',
    rating: 'rating',
    nationality: 'nationality',
    nationality_raw: 'nationality_raw',
    base_price: 'base_price',
    legacy: 'legacy',
    url: 'url',
    image_url: 'image_url',
    is_riddle: 'is_riddle',
    matches: 'matches',
    bat_runs: 'bat_runs',
    bat_sr: 'bat_sr',
    bat_average: 'bat_average',
    bowl_wickets: 'bowl_wickets',
    bowl_eco: 'bowl_eco',
    bowl_avg: 'bowl_avg',
    sub_experience: 'sub_experience',
    sub_scoring: 'sub_scoring',
    sub_impact: 'sub_impact',
    sub_consistency: 'sub_consistency',
    sub_wicket_taking: 'sub_wicket_taking',
    sub_economy: 'sub_economy',
    sub_efficiency: 'sub_efficiency',
    sub_batting: 'sub_batting',
    sub_bowling: 'sub_bowling',
    sub_versatility: 'sub_versatility'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const AuctionPlayerScalarFieldEnum: {
    id: 'id',
    player_id: 'player_id',
    status: 'status',
    sold_price: 'sold_price',
    sold_to_team_id: 'sold_to_team_id'
  };

  export type AuctionPlayerScalarFieldEnum = (typeof AuctionPlayerScalarFieldEnum)[keyof typeof AuctionPlayerScalarFieldEnum]


  export const TeamPlayerScalarFieldEnum: {
    id: 'id',
    team_id: 'team_id',
    player_id: 'player_id',
    price_paid: 'price_paid'
  };

  export type TeamPlayerScalarFieldEnum = (typeof TeamPlayerScalarFieldEnum)[keyof typeof TeamPlayerScalarFieldEnum]


  export const AuctionStateScalarFieldEnum: {
    id: 'id',
    phase: 'phase',
    current_player_id: 'current_player_id',
    current_bid: 'current_bid',
    highest_bidder_id: 'highest_bidder_id',
    current_sequence_id: 'current_sequence_id',
    current_sequence_index: 'current_sequence_index',
    bid_frozen_team_id: 'bid_frozen_team_id',
    auction_day: 'auction_day',
    active_power_card: 'active_power_card',
    active_power_card_team: 'active_power_card_team',
    gods_eye_revealed: 'gods_eye_revealed',
    bid_history: 'bid_history',
    last_sold_player_id: 'last_sold_player_id',
    last_sold_price: 'last_sold_price',
    last_sold_team_id: 'last_sold_team_id',
    last_sold_team_name: 'last_sold_team_name'
  };

  export type AuctionStateScalarFieldEnum = (typeof AuctionStateScalarFieldEnum)[keyof typeof AuctionStateScalarFieldEnum]


  export const AuctionSequenceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    player_ids: 'player_ids'
  };

  export type AuctionSequenceScalarFieldEnum = (typeof AuctionSequenceScalarFieldEnum)[keyof typeof AuctionSequenceScalarFieldEnum]


  export const PowerCardScalarFieldEnum: {
    id: 'id',
    team_id: 'team_id',
    type: 'type',
    is_used: 'is_used'
  };

  export type PowerCardScalarFieldEnum = (typeof PowerCardScalarFieldEnum)[keyof typeof PowerCardScalarFieldEnum]


  export const Top11SelectionScalarFieldEnum: {
    team_id: 'team_id',
    player_ids: 'player_ids',
    captain_id: 'captain_id',
    vice_captain_id: 'vice_captain_id',
    submitted_at: 'submitted_at'
  };

  export type Top11SelectionScalarFieldEnum = (typeof Top11SelectionScalarFieldEnum)[keyof typeof Top11SelectionScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    details: 'details',
    created_at: 'created_at'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const FranchiseScalarFieldEnum: {
    id: 'id',
    name: 'name',
    short_name: 'short_name',
    brand_score: 'brand_score',
    logo: 'logo',
    primary_color: 'primary_color'
  };

  export type FranchiseScalarFieldEnum = (typeof FranchiseScalarFieldEnum)[keyof typeof FranchiseScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Category'
   */
  export type EnumCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Category'>
    


  /**
   * Reference to a field of type 'Category[]'
   */
  export type ListEnumCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Category[]'>
    


  /**
   * Reference to a field of type 'Pool'
   */
  export type EnumPoolFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Pool'>
    


  /**
   * Reference to a field of type 'Pool[]'
   */
  export type ListEnumPoolFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Pool[]'>
    


  /**
   * Reference to a field of type 'Grade'
   */
  export type EnumGradeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Grade'>
    


  /**
   * Reference to a field of type 'Grade[]'
   */
  export type ListEnumGradeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Grade[]'>
    


  /**
   * Reference to a field of type 'Nationality'
   */
  export type EnumNationalityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Nationality'>
    


  /**
   * Reference to a field of type 'Nationality[]'
   */
  export type ListEnumNationalityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Nationality[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'PlayerAuctionStatus'
   */
  export type EnumPlayerAuctionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerAuctionStatus'>
    


  /**
   * Reference to a field of type 'PlayerAuctionStatus[]'
   */
  export type ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerAuctionStatus[]'>
    


  /**
   * Reference to a field of type 'AuctionPhase'
   */
  export type EnumAuctionPhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuctionPhase'>
    


  /**
   * Reference to a field of type 'AuctionPhase[]'
   */
  export type ListEnumAuctionPhaseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuctionPhase[]'>
    


  /**
   * Reference to a field of type 'PowerCardType'
   */
  export type EnumPowerCardTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PowerCardType'>
    


  /**
   * Reference to a field of type 'PowerCardType[]'
   */
  export type ListEnumPowerCardTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PowerCardType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    password_hash?: StringFilter<"Team"> | string
    active_session_id?: StringNullableFilter<"Team"> | string | null
    brand_key?: StringNullableFilter<"Team"> | string | null
    franchise_name?: StringNullableFilter<"Team"> | string | null
    brand_score?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    squad_count?: IntFilter<"Team"> | number
    overseas_count?: IntFilter<"Team"> | number
    batsmen_count?: IntFilter<"Team"> | number
    bowlers_count?: IntFilter<"Team"> | number
    ar_count?: IntFilter<"Team"> | number
    wk_count?: IntFilter<"Team"> | number
    purchased_players?: JsonFilter<"Team">
    logo?: StringNullableFilter<"Team"> | string | null
    primary_color?: StringNullableFilter<"Team"> | string | null
    created_at?: DateTimeFilter<"Team"> | Date | string
    team_players?: TeamPlayerListRelationFilter
    power_cards?: PowerCardListRelationFilter
    top11_selection?: XOR<Top11SelectionNullableScalarRelationFilter, Top11SelectionWhereInput> | null
    auction_players?: AuctionPlayerListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    active_session_id?: SortOrderInput | SortOrder
    brand_key?: SortOrderInput | SortOrder
    franchise_name?: SortOrderInput | SortOrder
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
    purchased_players?: SortOrder
    logo?: SortOrderInput | SortOrder
    primary_color?: SortOrderInput | SortOrder
    created_at?: SortOrder
    team_players?: TeamPlayerOrderByRelationAggregateInput
    power_cards?: PowerCardOrderByRelationAggregateInput
    top11_selection?: Top11SelectionOrderByWithRelationInput
    auction_players?: AuctionPlayerOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    brand_key?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    password_hash?: StringFilter<"Team"> | string
    active_session_id?: StringNullableFilter<"Team"> | string | null
    franchise_name?: StringNullableFilter<"Team"> | string | null
    brand_score?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFilter<"Team"> | Decimal | DecimalJsLike | number | string
    squad_count?: IntFilter<"Team"> | number
    overseas_count?: IntFilter<"Team"> | number
    batsmen_count?: IntFilter<"Team"> | number
    bowlers_count?: IntFilter<"Team"> | number
    ar_count?: IntFilter<"Team"> | number
    wk_count?: IntFilter<"Team"> | number
    purchased_players?: JsonFilter<"Team">
    logo?: StringNullableFilter<"Team"> | string | null
    primary_color?: StringNullableFilter<"Team"> | string | null
    created_at?: DateTimeFilter<"Team"> | Date | string
    team_players?: TeamPlayerListRelationFilter
    power_cards?: PowerCardListRelationFilter
    top11_selection?: XOR<Top11SelectionNullableScalarRelationFilter, Top11SelectionWhereInput> | null
    auction_players?: AuctionPlayerListRelationFilter
  }, "id" | "name" | "brand_key">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    active_session_id?: SortOrderInput | SortOrder
    brand_key?: SortOrderInput | SortOrder
    franchise_name?: SortOrderInput | SortOrder
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
    purchased_players?: SortOrder
    logo?: SortOrderInput | SortOrder
    primary_color?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _avg?: TeamAvgOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
    _sum?: TeamSumOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    name?: StringWithAggregatesFilter<"Team"> | string
    password_hash?: StringWithAggregatesFilter<"Team"> | string
    active_session_id?: StringNullableWithAggregatesFilter<"Team"> | string | null
    brand_key?: StringNullableWithAggregatesFilter<"Team"> | string | null
    franchise_name?: StringNullableWithAggregatesFilter<"Team"> | string | null
    brand_score?: DecimalWithAggregatesFilter<"Team"> | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalWithAggregatesFilter<"Team"> | Decimal | DecimalJsLike | number | string
    squad_count?: IntWithAggregatesFilter<"Team"> | number
    overseas_count?: IntWithAggregatesFilter<"Team"> | number
    batsmen_count?: IntWithAggregatesFilter<"Team"> | number
    bowlers_count?: IntWithAggregatesFilter<"Team"> | number
    ar_count?: IntWithAggregatesFilter<"Team"> | number
    wk_count?: IntWithAggregatesFilter<"Team"> | number
    purchased_players?: JsonWithAggregatesFilter<"Team">
    logo?: StringNullableWithAggregatesFilter<"Team"> | string | null
    primary_color?: StringNullableWithAggregatesFilter<"Team"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Team"> | Date | string
  }

  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    id?: StringFilter<"Player"> | string
    rank?: IntFilter<"Player"> | number
    name?: StringFilter<"Player"> | string
    team?: StringFilter<"Player"> | string
    role?: StringFilter<"Player"> | string
    category?: EnumCategoryFilter<"Player"> | $Enums.Category
    pool?: EnumPoolFilter<"Player"> | $Enums.Pool
    grade?: EnumGradeFilter<"Player"> | $Enums.Grade
    rating?: IntFilter<"Player"> | number
    nationality?: EnumNationalityFilter<"Player"> | $Enums.Nationality
    nationality_raw?: StringNullableFilter<"Player"> | string | null
    base_price?: DecimalFilter<"Player"> | Decimal | DecimalJsLike | number | string
    legacy?: IntFilter<"Player"> | number
    url?: StringNullableFilter<"Player"> | string | null
    image_url?: StringNullableFilter<"Player"> | string | null
    is_riddle?: BoolFilter<"Player"> | boolean
    matches?: IntNullableFilter<"Player"> | number | null
    bat_runs?: IntNullableFilter<"Player"> | number | null
    bat_sr?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bat_average?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: IntNullableFilter<"Player"> | number | null
    bowl_eco?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    sub_experience?: IntNullableFilter<"Player"> | number | null
    sub_scoring?: IntNullableFilter<"Player"> | number | null
    sub_impact?: IntNullableFilter<"Player"> | number | null
    sub_consistency?: IntNullableFilter<"Player"> | number | null
    sub_wicket_taking?: IntNullableFilter<"Player"> | number | null
    sub_economy?: IntNullableFilter<"Player"> | number | null
    sub_efficiency?: IntNullableFilter<"Player"> | number | null
    sub_batting?: IntNullableFilter<"Player"> | number | null
    sub_bowling?: IntNullableFilter<"Player"> | number | null
    sub_versatility?: IntNullableFilter<"Player"> | number | null
    auction_players?: AuctionPlayerListRelationFilter
    team_players?: TeamPlayerListRelationFilter
  }

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder
    rank?: SortOrder
    name?: SortOrder
    team?: SortOrder
    role?: SortOrder
    category?: SortOrder
    pool?: SortOrder
    grade?: SortOrder
    rating?: SortOrder
    nationality?: SortOrder
    nationality_raw?: SortOrderInput | SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    url?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    is_riddle?: SortOrder
    matches?: SortOrderInput | SortOrder
    bat_runs?: SortOrderInput | SortOrder
    bat_sr?: SortOrderInput | SortOrder
    bat_average?: SortOrderInput | SortOrder
    bowl_wickets?: SortOrderInput | SortOrder
    bowl_eco?: SortOrderInput | SortOrder
    bowl_avg?: SortOrderInput | SortOrder
    sub_experience?: SortOrderInput | SortOrder
    sub_scoring?: SortOrderInput | SortOrder
    sub_impact?: SortOrderInput | SortOrder
    sub_consistency?: SortOrderInput | SortOrder
    sub_wicket_taking?: SortOrderInput | SortOrder
    sub_economy?: SortOrderInput | SortOrder
    sub_efficiency?: SortOrderInput | SortOrder
    sub_batting?: SortOrderInput | SortOrder
    sub_bowling?: SortOrderInput | SortOrder
    sub_versatility?: SortOrderInput | SortOrder
    auction_players?: AuctionPlayerOrderByRelationAggregateInput
    team_players?: TeamPlayerOrderByRelationAggregateInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    rank?: number
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    name?: StringFilter<"Player"> | string
    team?: StringFilter<"Player"> | string
    role?: StringFilter<"Player"> | string
    category?: EnumCategoryFilter<"Player"> | $Enums.Category
    pool?: EnumPoolFilter<"Player"> | $Enums.Pool
    grade?: EnumGradeFilter<"Player"> | $Enums.Grade
    rating?: IntFilter<"Player"> | number
    nationality?: EnumNationalityFilter<"Player"> | $Enums.Nationality
    nationality_raw?: StringNullableFilter<"Player"> | string | null
    base_price?: DecimalFilter<"Player"> | Decimal | DecimalJsLike | number | string
    legacy?: IntFilter<"Player"> | number
    url?: StringNullableFilter<"Player"> | string | null
    image_url?: StringNullableFilter<"Player"> | string | null
    is_riddle?: BoolFilter<"Player"> | boolean
    matches?: IntNullableFilter<"Player"> | number | null
    bat_runs?: IntNullableFilter<"Player"> | number | null
    bat_sr?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bat_average?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: IntNullableFilter<"Player"> | number | null
    bowl_eco?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: DecimalNullableFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    sub_experience?: IntNullableFilter<"Player"> | number | null
    sub_scoring?: IntNullableFilter<"Player"> | number | null
    sub_impact?: IntNullableFilter<"Player"> | number | null
    sub_consistency?: IntNullableFilter<"Player"> | number | null
    sub_wicket_taking?: IntNullableFilter<"Player"> | number | null
    sub_economy?: IntNullableFilter<"Player"> | number | null
    sub_efficiency?: IntNullableFilter<"Player"> | number | null
    sub_batting?: IntNullableFilter<"Player"> | number | null
    sub_bowling?: IntNullableFilter<"Player"> | number | null
    sub_versatility?: IntNullableFilter<"Player"> | number | null
    auction_players?: AuctionPlayerListRelationFilter
    team_players?: TeamPlayerListRelationFilter
  }, "id" | "rank">

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder
    rank?: SortOrder
    name?: SortOrder
    team?: SortOrder
    role?: SortOrder
    category?: SortOrder
    pool?: SortOrder
    grade?: SortOrder
    rating?: SortOrder
    nationality?: SortOrder
    nationality_raw?: SortOrderInput | SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    url?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    is_riddle?: SortOrder
    matches?: SortOrderInput | SortOrder
    bat_runs?: SortOrderInput | SortOrder
    bat_sr?: SortOrderInput | SortOrder
    bat_average?: SortOrderInput | SortOrder
    bowl_wickets?: SortOrderInput | SortOrder
    bowl_eco?: SortOrderInput | SortOrder
    bowl_avg?: SortOrderInput | SortOrder
    sub_experience?: SortOrderInput | SortOrder
    sub_scoring?: SortOrderInput | SortOrder
    sub_impact?: SortOrderInput | SortOrder
    sub_consistency?: SortOrderInput | SortOrder
    sub_wicket_taking?: SortOrderInput | SortOrder
    sub_economy?: SortOrderInput | SortOrder
    sub_efficiency?: SortOrderInput | SortOrder
    sub_batting?: SortOrderInput | SortOrder
    sub_bowling?: SortOrderInput | SortOrder
    sub_versatility?: SortOrderInput | SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _avg?: PlayerAvgOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
    _sum?: PlayerSumOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Player"> | string
    rank?: IntWithAggregatesFilter<"Player"> | number
    name?: StringWithAggregatesFilter<"Player"> | string
    team?: StringWithAggregatesFilter<"Player"> | string
    role?: StringWithAggregatesFilter<"Player"> | string
    category?: EnumCategoryWithAggregatesFilter<"Player"> | $Enums.Category
    pool?: EnumPoolWithAggregatesFilter<"Player"> | $Enums.Pool
    grade?: EnumGradeWithAggregatesFilter<"Player"> | $Enums.Grade
    rating?: IntWithAggregatesFilter<"Player"> | number
    nationality?: EnumNationalityWithAggregatesFilter<"Player"> | $Enums.Nationality
    nationality_raw?: StringNullableWithAggregatesFilter<"Player"> | string | null
    base_price?: DecimalWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string
    legacy?: IntWithAggregatesFilter<"Player"> | number
    url?: StringNullableWithAggregatesFilter<"Player"> | string | null
    image_url?: StringNullableWithAggregatesFilter<"Player"> | string | null
    is_riddle?: BoolWithAggregatesFilter<"Player"> | boolean
    matches?: IntNullableWithAggregatesFilter<"Player"> | number | null
    bat_runs?: IntNullableWithAggregatesFilter<"Player"> | number | null
    bat_sr?: DecimalNullableWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bat_average?: DecimalNullableWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: IntNullableWithAggregatesFilter<"Player"> | number | null
    bowl_eco?: DecimalNullableWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: DecimalNullableWithAggregatesFilter<"Player"> | Decimal | DecimalJsLike | number | string | null
    sub_experience?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_scoring?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_impact?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_consistency?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_wicket_taking?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_economy?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_efficiency?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_batting?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_bowling?: IntNullableWithAggregatesFilter<"Player"> | number | null
    sub_versatility?: IntNullableWithAggregatesFilter<"Player"> | number | null
  }

  export type AuctionPlayerWhereInput = {
    AND?: AuctionPlayerWhereInput | AuctionPlayerWhereInput[]
    OR?: AuctionPlayerWhereInput[]
    NOT?: AuctionPlayerWhereInput | AuctionPlayerWhereInput[]
    id?: StringFilter<"AuctionPlayer"> | string
    player_id?: StringFilter<"AuctionPlayer"> | string
    status?: EnumPlayerAuctionStatusFilter<"AuctionPlayer"> | $Enums.PlayerAuctionStatus
    sold_price?: DecimalNullableFilter<"AuctionPlayer"> | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: StringNullableFilter<"AuctionPlayer"> | string | null
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    sold_to_team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
  }

  export type AuctionPlayerOrderByWithRelationInput = {
    id?: SortOrder
    player_id?: SortOrder
    status?: SortOrder
    sold_price?: SortOrderInput | SortOrder
    sold_to_team_id?: SortOrderInput | SortOrder
    player?: PlayerOrderByWithRelationInput
    sold_to_team?: TeamOrderByWithRelationInput
  }

  export type AuctionPlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    player_id?: string
    AND?: AuctionPlayerWhereInput | AuctionPlayerWhereInput[]
    OR?: AuctionPlayerWhereInput[]
    NOT?: AuctionPlayerWhereInput | AuctionPlayerWhereInput[]
    status?: EnumPlayerAuctionStatusFilter<"AuctionPlayer"> | $Enums.PlayerAuctionStatus
    sold_price?: DecimalNullableFilter<"AuctionPlayer"> | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: StringNullableFilter<"AuctionPlayer"> | string | null
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    sold_to_team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
  }, "id" | "player_id">

  export type AuctionPlayerOrderByWithAggregationInput = {
    id?: SortOrder
    player_id?: SortOrder
    status?: SortOrder
    sold_price?: SortOrderInput | SortOrder
    sold_to_team_id?: SortOrderInput | SortOrder
    _count?: AuctionPlayerCountOrderByAggregateInput
    _avg?: AuctionPlayerAvgOrderByAggregateInput
    _max?: AuctionPlayerMaxOrderByAggregateInput
    _min?: AuctionPlayerMinOrderByAggregateInput
    _sum?: AuctionPlayerSumOrderByAggregateInput
  }

  export type AuctionPlayerScalarWhereWithAggregatesInput = {
    AND?: AuctionPlayerScalarWhereWithAggregatesInput | AuctionPlayerScalarWhereWithAggregatesInput[]
    OR?: AuctionPlayerScalarWhereWithAggregatesInput[]
    NOT?: AuctionPlayerScalarWhereWithAggregatesInput | AuctionPlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuctionPlayer"> | string
    player_id?: StringWithAggregatesFilter<"AuctionPlayer"> | string
    status?: EnumPlayerAuctionStatusWithAggregatesFilter<"AuctionPlayer"> | $Enums.PlayerAuctionStatus
    sold_price?: DecimalNullableWithAggregatesFilter<"AuctionPlayer"> | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: StringNullableWithAggregatesFilter<"AuctionPlayer"> | string | null
  }

  export type TeamPlayerWhereInput = {
    AND?: TeamPlayerWhereInput | TeamPlayerWhereInput[]
    OR?: TeamPlayerWhereInput[]
    NOT?: TeamPlayerWhereInput | TeamPlayerWhereInput[]
    id?: StringFilter<"TeamPlayer"> | string
    team_id?: StringFilter<"TeamPlayer"> | string
    player_id?: StringFilter<"TeamPlayer"> | string
    price_paid?: DecimalFilter<"TeamPlayer"> | Decimal | DecimalJsLike | number | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }

  export type TeamPlayerOrderByWithRelationInput = {
    id?: SortOrder
    team_id?: SortOrder
    player_id?: SortOrder
    price_paid?: SortOrder
    team?: TeamOrderByWithRelationInput
    player?: PlayerOrderByWithRelationInput
  }

  export type TeamPlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    team_id_player_id?: TeamPlayerTeam_idPlayer_idCompoundUniqueInput
    AND?: TeamPlayerWhereInput | TeamPlayerWhereInput[]
    OR?: TeamPlayerWhereInput[]
    NOT?: TeamPlayerWhereInput | TeamPlayerWhereInput[]
    team_id?: StringFilter<"TeamPlayer"> | string
    player_id?: StringFilter<"TeamPlayer"> | string
    price_paid?: DecimalFilter<"TeamPlayer"> | Decimal | DecimalJsLike | number | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }, "id" | "team_id_player_id">

  export type TeamPlayerOrderByWithAggregationInput = {
    id?: SortOrder
    team_id?: SortOrder
    player_id?: SortOrder
    price_paid?: SortOrder
    _count?: TeamPlayerCountOrderByAggregateInput
    _avg?: TeamPlayerAvgOrderByAggregateInput
    _max?: TeamPlayerMaxOrderByAggregateInput
    _min?: TeamPlayerMinOrderByAggregateInput
    _sum?: TeamPlayerSumOrderByAggregateInput
  }

  export type TeamPlayerScalarWhereWithAggregatesInput = {
    AND?: TeamPlayerScalarWhereWithAggregatesInput | TeamPlayerScalarWhereWithAggregatesInput[]
    OR?: TeamPlayerScalarWhereWithAggregatesInput[]
    NOT?: TeamPlayerScalarWhereWithAggregatesInput | TeamPlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TeamPlayer"> | string
    team_id?: StringWithAggregatesFilter<"TeamPlayer"> | string
    player_id?: StringWithAggregatesFilter<"TeamPlayer"> | string
    price_paid?: DecimalWithAggregatesFilter<"TeamPlayer"> | Decimal | DecimalJsLike | number | string
  }

  export type AuctionStateWhereInput = {
    AND?: AuctionStateWhereInput | AuctionStateWhereInput[]
    OR?: AuctionStateWhereInput[]
    NOT?: AuctionStateWhereInput | AuctionStateWhereInput[]
    id?: IntFilter<"AuctionState"> | number
    phase?: EnumAuctionPhaseFilter<"AuctionState"> | $Enums.AuctionPhase
    current_player_id?: StringNullableFilter<"AuctionState"> | string | null
    current_bid?: DecimalNullableFilter<"AuctionState"> | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: StringNullableFilter<"AuctionState"> | string | null
    current_sequence_id?: IntNullableFilter<"AuctionState"> | number | null
    current_sequence_index?: IntFilter<"AuctionState"> | number
    bid_frozen_team_id?: StringNullableFilter<"AuctionState"> | string | null
    auction_day?: StringFilter<"AuctionState"> | string
    active_power_card?: StringNullableFilter<"AuctionState"> | string | null
    active_power_card_team?: StringNullableFilter<"AuctionState"> | string | null
    gods_eye_revealed?: BoolFilter<"AuctionState"> | boolean
    bid_history?: JsonFilter<"AuctionState">
    last_sold_player_id?: StringNullableFilter<"AuctionState"> | string | null
    last_sold_price?: DecimalNullableFilter<"AuctionState"> | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: StringNullableFilter<"AuctionState"> | string | null
    last_sold_team_name?: StringNullableFilter<"AuctionState"> | string | null
  }

  export type AuctionStateOrderByWithRelationInput = {
    id?: SortOrder
    phase?: SortOrder
    current_player_id?: SortOrderInput | SortOrder
    current_bid?: SortOrderInput | SortOrder
    highest_bidder_id?: SortOrderInput | SortOrder
    current_sequence_id?: SortOrderInput | SortOrder
    current_sequence_index?: SortOrder
    bid_frozen_team_id?: SortOrderInput | SortOrder
    auction_day?: SortOrder
    active_power_card?: SortOrderInput | SortOrder
    active_power_card_team?: SortOrderInput | SortOrder
    gods_eye_revealed?: SortOrder
    bid_history?: SortOrder
    last_sold_player_id?: SortOrderInput | SortOrder
    last_sold_price?: SortOrderInput | SortOrder
    last_sold_team_id?: SortOrderInput | SortOrder
    last_sold_team_name?: SortOrderInput | SortOrder
  }

  export type AuctionStateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AuctionStateWhereInput | AuctionStateWhereInput[]
    OR?: AuctionStateWhereInput[]
    NOT?: AuctionStateWhereInput | AuctionStateWhereInput[]
    phase?: EnumAuctionPhaseFilter<"AuctionState"> | $Enums.AuctionPhase
    current_player_id?: StringNullableFilter<"AuctionState"> | string | null
    current_bid?: DecimalNullableFilter<"AuctionState"> | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: StringNullableFilter<"AuctionState"> | string | null
    current_sequence_id?: IntNullableFilter<"AuctionState"> | number | null
    current_sequence_index?: IntFilter<"AuctionState"> | number
    bid_frozen_team_id?: StringNullableFilter<"AuctionState"> | string | null
    auction_day?: StringFilter<"AuctionState"> | string
    active_power_card?: StringNullableFilter<"AuctionState"> | string | null
    active_power_card_team?: StringNullableFilter<"AuctionState"> | string | null
    gods_eye_revealed?: BoolFilter<"AuctionState"> | boolean
    bid_history?: JsonFilter<"AuctionState">
    last_sold_player_id?: StringNullableFilter<"AuctionState"> | string | null
    last_sold_price?: DecimalNullableFilter<"AuctionState"> | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: StringNullableFilter<"AuctionState"> | string | null
    last_sold_team_name?: StringNullableFilter<"AuctionState"> | string | null
  }, "id">

  export type AuctionStateOrderByWithAggregationInput = {
    id?: SortOrder
    phase?: SortOrder
    current_player_id?: SortOrderInput | SortOrder
    current_bid?: SortOrderInput | SortOrder
    highest_bidder_id?: SortOrderInput | SortOrder
    current_sequence_id?: SortOrderInput | SortOrder
    current_sequence_index?: SortOrder
    bid_frozen_team_id?: SortOrderInput | SortOrder
    auction_day?: SortOrder
    active_power_card?: SortOrderInput | SortOrder
    active_power_card_team?: SortOrderInput | SortOrder
    gods_eye_revealed?: SortOrder
    bid_history?: SortOrder
    last_sold_player_id?: SortOrderInput | SortOrder
    last_sold_price?: SortOrderInput | SortOrder
    last_sold_team_id?: SortOrderInput | SortOrder
    last_sold_team_name?: SortOrderInput | SortOrder
    _count?: AuctionStateCountOrderByAggregateInput
    _avg?: AuctionStateAvgOrderByAggregateInput
    _max?: AuctionStateMaxOrderByAggregateInput
    _min?: AuctionStateMinOrderByAggregateInput
    _sum?: AuctionStateSumOrderByAggregateInput
  }

  export type AuctionStateScalarWhereWithAggregatesInput = {
    AND?: AuctionStateScalarWhereWithAggregatesInput | AuctionStateScalarWhereWithAggregatesInput[]
    OR?: AuctionStateScalarWhereWithAggregatesInput[]
    NOT?: AuctionStateScalarWhereWithAggregatesInput | AuctionStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AuctionState"> | number
    phase?: EnumAuctionPhaseWithAggregatesFilter<"AuctionState"> | $Enums.AuctionPhase
    current_player_id?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    current_bid?: DecimalNullableWithAggregatesFilter<"AuctionState"> | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    current_sequence_id?: IntNullableWithAggregatesFilter<"AuctionState"> | number | null
    current_sequence_index?: IntWithAggregatesFilter<"AuctionState"> | number
    bid_frozen_team_id?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    auction_day?: StringWithAggregatesFilter<"AuctionState"> | string
    active_power_card?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    active_power_card_team?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    gods_eye_revealed?: BoolWithAggregatesFilter<"AuctionState"> | boolean
    bid_history?: JsonWithAggregatesFilter<"AuctionState">
    last_sold_player_id?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    last_sold_price?: DecimalNullableWithAggregatesFilter<"AuctionState"> | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
    last_sold_team_name?: StringNullableWithAggregatesFilter<"AuctionState"> | string | null
  }

  export type AuctionSequenceWhereInput = {
    AND?: AuctionSequenceWhereInput | AuctionSequenceWhereInput[]
    OR?: AuctionSequenceWhereInput[]
    NOT?: AuctionSequenceWhereInput | AuctionSequenceWhereInput[]
    id?: IntFilter<"AuctionSequence"> | number
    name?: StringFilter<"AuctionSequence"> | string
    player_ids?: JsonFilter<"AuctionSequence">
  }

  export type AuctionSequenceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    player_ids?: SortOrder
  }

  export type AuctionSequenceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AuctionSequenceWhereInput | AuctionSequenceWhereInput[]
    OR?: AuctionSequenceWhereInput[]
    NOT?: AuctionSequenceWhereInput | AuctionSequenceWhereInput[]
    name?: StringFilter<"AuctionSequence"> | string
    player_ids?: JsonFilter<"AuctionSequence">
  }, "id">

  export type AuctionSequenceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    player_ids?: SortOrder
    _count?: AuctionSequenceCountOrderByAggregateInput
    _avg?: AuctionSequenceAvgOrderByAggregateInput
    _max?: AuctionSequenceMaxOrderByAggregateInput
    _min?: AuctionSequenceMinOrderByAggregateInput
    _sum?: AuctionSequenceSumOrderByAggregateInput
  }

  export type AuctionSequenceScalarWhereWithAggregatesInput = {
    AND?: AuctionSequenceScalarWhereWithAggregatesInput | AuctionSequenceScalarWhereWithAggregatesInput[]
    OR?: AuctionSequenceScalarWhereWithAggregatesInput[]
    NOT?: AuctionSequenceScalarWhereWithAggregatesInput | AuctionSequenceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AuctionSequence"> | number
    name?: StringWithAggregatesFilter<"AuctionSequence"> | string
    player_ids?: JsonWithAggregatesFilter<"AuctionSequence">
  }

  export type PowerCardWhereInput = {
    AND?: PowerCardWhereInput | PowerCardWhereInput[]
    OR?: PowerCardWhereInput[]
    NOT?: PowerCardWhereInput | PowerCardWhereInput[]
    id?: StringFilter<"PowerCard"> | string
    team_id?: StringFilter<"PowerCard"> | string
    type?: EnumPowerCardTypeFilter<"PowerCard"> | $Enums.PowerCardType
    is_used?: BoolFilter<"PowerCard"> | boolean
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }

  export type PowerCardOrderByWithRelationInput = {
    id?: SortOrder
    team_id?: SortOrder
    type?: SortOrder
    is_used?: SortOrder
    team?: TeamOrderByWithRelationInput
  }

  export type PowerCardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    team_id_type?: PowerCardTeam_idTypeCompoundUniqueInput
    AND?: PowerCardWhereInput | PowerCardWhereInput[]
    OR?: PowerCardWhereInput[]
    NOT?: PowerCardWhereInput | PowerCardWhereInput[]
    team_id?: StringFilter<"PowerCard"> | string
    type?: EnumPowerCardTypeFilter<"PowerCard"> | $Enums.PowerCardType
    is_used?: BoolFilter<"PowerCard"> | boolean
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }, "id" | "team_id_type">

  export type PowerCardOrderByWithAggregationInput = {
    id?: SortOrder
    team_id?: SortOrder
    type?: SortOrder
    is_used?: SortOrder
    _count?: PowerCardCountOrderByAggregateInput
    _max?: PowerCardMaxOrderByAggregateInput
    _min?: PowerCardMinOrderByAggregateInput
  }

  export type PowerCardScalarWhereWithAggregatesInput = {
    AND?: PowerCardScalarWhereWithAggregatesInput | PowerCardScalarWhereWithAggregatesInput[]
    OR?: PowerCardScalarWhereWithAggregatesInput[]
    NOT?: PowerCardScalarWhereWithAggregatesInput | PowerCardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PowerCard"> | string
    team_id?: StringWithAggregatesFilter<"PowerCard"> | string
    type?: EnumPowerCardTypeWithAggregatesFilter<"PowerCard"> | $Enums.PowerCardType
    is_used?: BoolWithAggregatesFilter<"PowerCard"> | boolean
  }

  export type Top11SelectionWhereInput = {
    AND?: Top11SelectionWhereInput | Top11SelectionWhereInput[]
    OR?: Top11SelectionWhereInput[]
    NOT?: Top11SelectionWhereInput | Top11SelectionWhereInput[]
    team_id?: StringFilter<"Top11Selection"> | string
    player_ids?: StringNullableListFilter<"Top11Selection">
    captain_id?: StringFilter<"Top11Selection"> | string
    vice_captain_id?: StringFilter<"Top11Selection"> | string
    submitted_at?: DateTimeFilter<"Top11Selection"> | Date | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }

  export type Top11SelectionOrderByWithRelationInput = {
    team_id?: SortOrder
    player_ids?: SortOrder
    captain_id?: SortOrder
    vice_captain_id?: SortOrder
    submitted_at?: SortOrder
    team?: TeamOrderByWithRelationInput
  }

  export type Top11SelectionWhereUniqueInput = Prisma.AtLeast<{
    team_id?: string
    AND?: Top11SelectionWhereInput | Top11SelectionWhereInput[]
    OR?: Top11SelectionWhereInput[]
    NOT?: Top11SelectionWhereInput | Top11SelectionWhereInput[]
    player_ids?: StringNullableListFilter<"Top11Selection">
    captain_id?: StringFilter<"Top11Selection"> | string
    vice_captain_id?: StringFilter<"Top11Selection"> | string
    submitted_at?: DateTimeFilter<"Top11Selection"> | Date | string
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }, "team_id">

  export type Top11SelectionOrderByWithAggregationInput = {
    team_id?: SortOrder
    player_ids?: SortOrder
    captain_id?: SortOrder
    vice_captain_id?: SortOrder
    submitted_at?: SortOrder
    _count?: Top11SelectionCountOrderByAggregateInput
    _max?: Top11SelectionMaxOrderByAggregateInput
    _min?: Top11SelectionMinOrderByAggregateInput
  }

  export type Top11SelectionScalarWhereWithAggregatesInput = {
    AND?: Top11SelectionScalarWhereWithAggregatesInput | Top11SelectionScalarWhereWithAggregatesInput[]
    OR?: Top11SelectionScalarWhereWithAggregatesInput[]
    NOT?: Top11SelectionScalarWhereWithAggregatesInput | Top11SelectionScalarWhereWithAggregatesInput[]
    team_id?: StringWithAggregatesFilter<"Top11Selection"> | string
    player_ids?: StringNullableListFilter<"Top11Selection">
    captain_id?: StringWithAggregatesFilter<"Top11Selection"> | string
    vice_captain_id?: StringWithAggregatesFilter<"Top11Selection"> | string
    submitted_at?: DateTimeWithAggregatesFilter<"Top11Selection"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    details?: JsonFilter<"AuditLog">
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    action?: StringFilter<"AuditLog"> | string
    details?: JsonFilter<"AuditLog">
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    created_at?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    details?: JsonWithAggregatesFilter<"AuditLog">
    created_at?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type FranchiseWhereInput = {
    AND?: FranchiseWhereInput | FranchiseWhereInput[]
    OR?: FranchiseWhereInput[]
    NOT?: FranchiseWhereInput | FranchiseWhereInput[]
    id?: IntFilter<"Franchise"> | number
    name?: StringFilter<"Franchise"> | string
    short_name?: StringFilter<"Franchise"> | string
    brand_score?: DecimalFilter<"Franchise"> | Decimal | DecimalJsLike | number | string
    logo?: StringNullableFilter<"Franchise"> | string | null
    primary_color?: StringNullableFilter<"Franchise"> | string | null
  }

  export type FranchiseOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    short_name?: SortOrder
    brand_score?: SortOrder
    logo?: SortOrderInput | SortOrder
    primary_color?: SortOrderInput | SortOrder
  }

  export type FranchiseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    short_name?: string
    AND?: FranchiseWhereInput | FranchiseWhereInput[]
    OR?: FranchiseWhereInput[]
    NOT?: FranchiseWhereInput | FranchiseWhereInput[]
    brand_score?: DecimalFilter<"Franchise"> | Decimal | DecimalJsLike | number | string
    logo?: StringNullableFilter<"Franchise"> | string | null
    primary_color?: StringNullableFilter<"Franchise"> | string | null
  }, "id" | "name" | "short_name">

  export type FranchiseOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    short_name?: SortOrder
    brand_score?: SortOrder
    logo?: SortOrderInput | SortOrder
    primary_color?: SortOrderInput | SortOrder
    _count?: FranchiseCountOrderByAggregateInput
    _avg?: FranchiseAvgOrderByAggregateInput
    _max?: FranchiseMaxOrderByAggregateInput
    _min?: FranchiseMinOrderByAggregateInput
    _sum?: FranchiseSumOrderByAggregateInput
  }

  export type FranchiseScalarWhereWithAggregatesInput = {
    AND?: FranchiseScalarWhereWithAggregatesInput | FranchiseScalarWhereWithAggregatesInput[]
    OR?: FranchiseScalarWhereWithAggregatesInput[]
    NOT?: FranchiseScalarWhereWithAggregatesInput | FranchiseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Franchise"> | number
    name?: StringWithAggregatesFilter<"Franchise"> | string
    short_name?: StringWithAggregatesFilter<"Franchise"> | string
    brand_score?: DecimalWithAggregatesFilter<"Franchise"> | Decimal | DecimalJsLike | number | string
    logo?: StringNullableWithAggregatesFilter<"Franchise"> | string | null
    primary_color?: StringNullableWithAggregatesFilter<"Franchise"> | string | null
  }

  export type TeamCreateInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerCreateNestedManyWithoutTeamInput
    power_cards?: PowerCardCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionCreateNestedOneWithoutTeamInput
    auction_players?: AuctionPlayerCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerUncheckedCreateNestedManyWithoutTeamInput
    power_cards?: PowerCardUncheckedCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionUncheckedCreateNestedOneWithoutTeamInput
    auction_players?: AuctionPlayerUncheckedCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUpdateManyWithoutTeamNestedInput
    power_cards?: PowerCardUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUpdateOneWithoutTeamNestedInput
    auction_players?: AuctionPlayerUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput
    power_cards?: PowerCardUncheckedUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUncheckedUpdateOneWithoutTeamNestedInput
    auction_players?: AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerCreateInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
    auction_players?: AuctionPlayerCreateNestedManyWithoutPlayerInput
    team_players?: TeamPlayerCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
    auction_players?: AuctionPlayerUncheckedCreateNestedManyWithoutPlayerInput
    team_players?: TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
    auction_players?: AuctionPlayerUpdateManyWithoutPlayerNestedInput
    team_players?: TeamPlayerUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
    auction_players?: AuctionPlayerUncheckedUpdateManyWithoutPlayerNestedInput
    team_players?: TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerCreateManyInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
  }

  export type PlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AuctionPlayerCreateInput = {
    id?: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    player: PlayerCreateNestedOneWithoutAuction_playersInput
    sold_to_team?: TeamCreateNestedOneWithoutAuction_playersInput
  }

  export type AuctionPlayerUncheckedCreateInput = {
    id?: string
    player_id: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: string | null
  }

  export type AuctionPlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    player?: PlayerUpdateOneRequiredWithoutAuction_playersNestedInput
    sold_to_team?: TeamUpdateOneWithoutAuction_playersNestedInput
  }

  export type AuctionPlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionPlayerCreateManyInput = {
    id?: string
    player_id: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: string | null
  }

  export type AuctionPlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AuctionPlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamPlayerCreateInput = {
    id?: string
    price_paid: Decimal | DecimalJsLike | number | string
    team: TeamCreateNestedOneWithoutTeam_playersInput
    player: PlayerCreateNestedOneWithoutTeam_playersInput
  }

  export type TeamPlayerUncheckedCreateInput = {
    id?: string
    team_id: string
    player_id: string
    price_paid: Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    team?: TeamUpdateOneRequiredWithoutTeam_playersNestedInput
    player?: PlayerUpdateOneRequiredWithoutTeam_playersNestedInput
  }

  export type TeamPlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    team_id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerCreateManyInput = {
    id?: string
    team_id: string
    player_id: string
    price_paid: Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    team_id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type AuctionStateCreateInput = {
    id?: number
    phase?: $Enums.AuctionPhase
    current_player_id?: string | null
    current_bid?: Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: string | null
    current_sequence_id?: number | null
    current_sequence_index?: number
    bid_frozen_team_id?: string | null
    auction_day?: string
    active_power_card?: string | null
    active_power_card_team?: string | null
    gods_eye_revealed?: boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: string | null
    last_sold_price?: Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: string | null
    last_sold_team_name?: string | null
  }

  export type AuctionStateUncheckedCreateInput = {
    id?: number
    phase?: $Enums.AuctionPhase
    current_player_id?: string | null
    current_bid?: Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: string | null
    current_sequence_id?: number | null
    current_sequence_index?: number
    bid_frozen_team_id?: string | null
    auction_day?: string
    active_power_card?: string | null
    active_power_card_team?: string | null
    gods_eye_revealed?: boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: string | null
    last_sold_price?: Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: string | null
    last_sold_team_name?: string | null
  }

  export type AuctionStateUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    phase?: EnumAuctionPhaseFieldUpdateOperationsInput | $Enums.AuctionPhase
    current_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_bid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_sequence_id?: NullableIntFieldUpdateOperationsInput | number | null
    current_sequence_index?: IntFieldUpdateOperationsInput | number
    bid_frozen_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    auction_day?: StringFieldUpdateOperationsInput | string
    active_power_card?: NullableStringFieldUpdateOperationsInput | string | null
    active_power_card_team?: NullableStringFieldUpdateOperationsInput | string | null
    gods_eye_revealed?: BoolFieldUpdateOperationsInput | boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_team_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    phase?: EnumAuctionPhaseFieldUpdateOperationsInput | $Enums.AuctionPhase
    current_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_bid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_sequence_id?: NullableIntFieldUpdateOperationsInput | number | null
    current_sequence_index?: IntFieldUpdateOperationsInput | number
    bid_frozen_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    auction_day?: StringFieldUpdateOperationsInput | string
    active_power_card?: NullableStringFieldUpdateOperationsInput | string | null
    active_power_card_team?: NullableStringFieldUpdateOperationsInput | string | null
    gods_eye_revealed?: BoolFieldUpdateOperationsInput | boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_team_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionStateCreateManyInput = {
    id?: number
    phase?: $Enums.AuctionPhase
    current_player_id?: string | null
    current_bid?: Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: string | null
    current_sequence_id?: number | null
    current_sequence_index?: number
    bid_frozen_team_id?: string | null
    auction_day?: string
    active_power_card?: string | null
    active_power_card_team?: string | null
    gods_eye_revealed?: boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: string | null
    last_sold_price?: Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: string | null
    last_sold_team_name?: string | null
  }

  export type AuctionStateUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    phase?: EnumAuctionPhaseFieldUpdateOperationsInput | $Enums.AuctionPhase
    current_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_bid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_sequence_id?: NullableIntFieldUpdateOperationsInput | number | null
    current_sequence_index?: IntFieldUpdateOperationsInput | number
    bid_frozen_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    auction_day?: StringFieldUpdateOperationsInput | string
    active_power_card?: NullableStringFieldUpdateOperationsInput | string | null
    active_power_card_team?: NullableStringFieldUpdateOperationsInput | string | null
    gods_eye_revealed?: BoolFieldUpdateOperationsInput | boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_team_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    phase?: EnumAuctionPhaseFieldUpdateOperationsInput | $Enums.AuctionPhase
    current_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_bid?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highest_bidder_id?: NullableStringFieldUpdateOperationsInput | string | null
    current_sequence_id?: NullableIntFieldUpdateOperationsInput | number | null
    current_sequence_index?: IntFieldUpdateOperationsInput | number
    bid_frozen_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    auction_day?: StringFieldUpdateOperationsInput | string
    active_power_card?: NullableStringFieldUpdateOperationsInput | string | null
    active_power_card_team?: NullableStringFieldUpdateOperationsInput | string | null
    gods_eye_revealed?: BoolFieldUpdateOperationsInput | boolean
    bid_history?: JsonNullValueInput | InputJsonValue
    last_sold_player_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    last_sold_team_id?: NullableStringFieldUpdateOperationsInput | string | null
    last_sold_team_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionSequenceCreateInput = {
    id: number
    name: string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type AuctionSequenceUncheckedCreateInput = {
    id: number
    name: string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type AuctionSequenceUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type AuctionSequenceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type AuctionSequenceCreateManyInput = {
    id: number
    name: string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type AuctionSequenceUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type AuctionSequenceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    player_ids?: JsonNullValueInput | InputJsonValue
  }

  export type PowerCardCreateInput = {
    id?: string
    type: $Enums.PowerCardType
    is_used?: boolean
    team: TeamCreateNestedOneWithoutPower_cardsInput
  }

  export type PowerCardUncheckedCreateInput = {
    id?: string
    team_id: string
    type: $Enums.PowerCardType
    is_used?: boolean
  }

  export type PowerCardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
    team?: TeamUpdateOneRequiredWithoutPower_cardsNestedInput
  }

  export type PowerCardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    team_id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PowerCardCreateManyInput = {
    id?: string
    team_id: string
    type: $Enums.PowerCardType
    is_used?: boolean
  }

  export type PowerCardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PowerCardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    team_id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type Top11SelectionCreateInput = {
    player_ids?: Top11SelectionCreateplayer_idsInput | string[]
    captain_id: string
    vice_captain_id: string
    submitted_at?: Date | string
    team: TeamCreateNestedOneWithoutTop11_selectionInput
  }

  export type Top11SelectionUncheckedCreateInput = {
    team_id: string
    player_ids?: Top11SelectionCreateplayer_idsInput | string[]
    captain_id: string
    vice_captain_id: string
    submitted_at?: Date | string
  }

  export type Top11SelectionUpdateInput = {
    player_ids?: Top11SelectionUpdateplayer_idsInput | string[]
    captain_id?: StringFieldUpdateOperationsInput | string
    vice_captain_id?: StringFieldUpdateOperationsInput | string
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneRequiredWithoutTop11_selectionNestedInput
  }

  export type Top11SelectionUncheckedUpdateInput = {
    team_id?: StringFieldUpdateOperationsInput | string
    player_ids?: Top11SelectionUpdateplayer_idsInput | string[]
    captain_id?: StringFieldUpdateOperationsInput | string
    vice_captain_id?: StringFieldUpdateOperationsInput | string
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Top11SelectionCreateManyInput = {
    team_id: string
    player_ids?: Top11SelectionCreateplayer_idsInput | string[]
    captain_id: string
    vice_captain_id: string
    submitted_at?: Date | string
  }

  export type Top11SelectionUpdateManyMutationInput = {
    player_ids?: Top11SelectionUpdateplayer_idsInput | string[]
    captain_id?: StringFieldUpdateOperationsInput | string
    vice_captain_id?: StringFieldUpdateOperationsInput | string
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Top11SelectionUncheckedUpdateManyInput = {
    team_id?: StringFieldUpdateOperationsInput | string
    player_ids?: Top11SelectionUpdateplayer_idsInput | string[]
    captain_id?: StringFieldUpdateOperationsInput | string
    vice_captain_id?: StringFieldUpdateOperationsInput | string
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    details: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    action: string
    details: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    action: string
    details: JsonNullValueInput | InputJsonValue
    created_at?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: JsonNullValueInput | InputJsonValue
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FranchiseCreateInput = {
    id: number
    name: string
    short_name: string
    brand_score?: Decimal | DecimalJsLike | number | string
    logo?: string | null
    primary_color?: string | null
  }

  export type FranchiseUncheckedCreateInput = {
    id: number
    name: string
    short_name: string
    brand_score?: Decimal | DecimalJsLike | number | string
    logo?: string | null
    primary_color?: string | null
  }

  export type FranchiseUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    short_name?: StringFieldUpdateOperationsInput | string
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FranchiseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    short_name?: StringFieldUpdateOperationsInput | string
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FranchiseCreateManyInput = {
    id: number
    name: string
    short_name: string
    brand_score?: Decimal | DecimalJsLike | number | string
    logo?: string | null
    primary_color?: string | null
  }

  export type FranchiseUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    short_name?: StringFieldUpdateOperationsInput | string
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FranchiseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    short_name?: StringFieldUpdateOperationsInput | string
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TeamPlayerListRelationFilter = {
    every?: TeamPlayerWhereInput
    some?: TeamPlayerWhereInput
    none?: TeamPlayerWhereInput
  }

  export type PowerCardListRelationFilter = {
    every?: PowerCardWhereInput
    some?: PowerCardWhereInput
    none?: PowerCardWhereInput
  }

  export type Top11SelectionNullableScalarRelationFilter = {
    is?: Top11SelectionWhereInput | null
    isNot?: Top11SelectionWhereInput | null
  }

  export type AuctionPlayerListRelationFilter = {
    every?: AuctionPlayerWhereInput
    some?: AuctionPlayerWhereInput
    none?: AuctionPlayerWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TeamPlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PowerCardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuctionPlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    active_session_id?: SortOrder
    brand_key?: SortOrder
    franchise_name?: SortOrder
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
    purchased_players?: SortOrder
    logo?: SortOrder
    primary_color?: SortOrder
    created_at?: SortOrder
  }

  export type TeamAvgOrderByAggregateInput = {
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    active_session_id?: SortOrder
    brand_key?: SortOrder
    franchise_name?: SortOrder
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
    logo?: SortOrder
    primary_color?: SortOrder
    created_at?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    password_hash?: SortOrder
    active_session_id?: SortOrder
    brand_key?: SortOrder
    franchise_name?: SortOrder
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
    logo?: SortOrder
    primary_color?: SortOrder
    created_at?: SortOrder
  }

  export type TeamSumOrderByAggregateInput = {
    brand_score?: SortOrder
    purse_remaining?: SortOrder
    squad_count?: SortOrder
    overseas_count?: SortOrder
    batsmen_count?: SortOrder
    bowlers_count?: SortOrder
    ar_count?: SortOrder
    wk_count?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCategoryFilter<$PrismaModel> | $Enums.Category
  }

  export type EnumPoolFilter<$PrismaModel = never> = {
    equals?: $Enums.Pool | EnumPoolFieldRefInput<$PrismaModel>
    in?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    not?: NestedEnumPoolFilter<$PrismaModel> | $Enums.Pool
  }

  export type EnumGradeFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel>
    in?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    not?: NestedEnumGradeFilter<$PrismaModel> | $Enums.Grade
  }

  export type EnumNationalityFilter<$PrismaModel = never> = {
    equals?: $Enums.Nationality | EnumNationalityFieldRefInput<$PrismaModel>
    in?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    not?: NestedEnumNationalityFilter<$PrismaModel> | $Enums.Nationality
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder
    rank?: SortOrder
    name?: SortOrder
    team?: SortOrder
    role?: SortOrder
    category?: SortOrder
    pool?: SortOrder
    grade?: SortOrder
    rating?: SortOrder
    nationality?: SortOrder
    nationality_raw?: SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    url?: SortOrder
    image_url?: SortOrder
    is_riddle?: SortOrder
    matches?: SortOrder
    bat_runs?: SortOrder
    bat_sr?: SortOrder
    bat_average?: SortOrder
    bowl_wickets?: SortOrder
    bowl_eco?: SortOrder
    bowl_avg?: SortOrder
    sub_experience?: SortOrder
    sub_scoring?: SortOrder
    sub_impact?: SortOrder
    sub_consistency?: SortOrder
    sub_wicket_taking?: SortOrder
    sub_economy?: SortOrder
    sub_efficiency?: SortOrder
    sub_batting?: SortOrder
    sub_bowling?: SortOrder
    sub_versatility?: SortOrder
  }

  export type PlayerAvgOrderByAggregateInput = {
    rank?: SortOrder
    rating?: SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    matches?: SortOrder
    bat_runs?: SortOrder
    bat_sr?: SortOrder
    bat_average?: SortOrder
    bowl_wickets?: SortOrder
    bowl_eco?: SortOrder
    bowl_avg?: SortOrder
    sub_experience?: SortOrder
    sub_scoring?: SortOrder
    sub_impact?: SortOrder
    sub_consistency?: SortOrder
    sub_wicket_taking?: SortOrder
    sub_economy?: SortOrder
    sub_efficiency?: SortOrder
    sub_batting?: SortOrder
    sub_bowling?: SortOrder
    sub_versatility?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    rank?: SortOrder
    name?: SortOrder
    team?: SortOrder
    role?: SortOrder
    category?: SortOrder
    pool?: SortOrder
    grade?: SortOrder
    rating?: SortOrder
    nationality?: SortOrder
    nationality_raw?: SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    url?: SortOrder
    image_url?: SortOrder
    is_riddle?: SortOrder
    matches?: SortOrder
    bat_runs?: SortOrder
    bat_sr?: SortOrder
    bat_average?: SortOrder
    bowl_wickets?: SortOrder
    bowl_eco?: SortOrder
    bowl_avg?: SortOrder
    sub_experience?: SortOrder
    sub_scoring?: SortOrder
    sub_impact?: SortOrder
    sub_consistency?: SortOrder
    sub_wicket_taking?: SortOrder
    sub_economy?: SortOrder
    sub_efficiency?: SortOrder
    sub_batting?: SortOrder
    sub_bowling?: SortOrder
    sub_versatility?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder
    rank?: SortOrder
    name?: SortOrder
    team?: SortOrder
    role?: SortOrder
    category?: SortOrder
    pool?: SortOrder
    grade?: SortOrder
    rating?: SortOrder
    nationality?: SortOrder
    nationality_raw?: SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    url?: SortOrder
    image_url?: SortOrder
    is_riddle?: SortOrder
    matches?: SortOrder
    bat_runs?: SortOrder
    bat_sr?: SortOrder
    bat_average?: SortOrder
    bowl_wickets?: SortOrder
    bowl_eco?: SortOrder
    bowl_avg?: SortOrder
    sub_experience?: SortOrder
    sub_scoring?: SortOrder
    sub_impact?: SortOrder
    sub_consistency?: SortOrder
    sub_wicket_taking?: SortOrder
    sub_economy?: SortOrder
    sub_efficiency?: SortOrder
    sub_batting?: SortOrder
    sub_bowling?: SortOrder
    sub_versatility?: SortOrder
  }

  export type PlayerSumOrderByAggregateInput = {
    rank?: SortOrder
    rating?: SortOrder
    base_price?: SortOrder
    legacy?: SortOrder
    matches?: SortOrder
    bat_runs?: SortOrder
    bat_sr?: SortOrder
    bat_average?: SortOrder
    bowl_wickets?: SortOrder
    bowl_eco?: SortOrder
    bowl_avg?: SortOrder
    sub_experience?: SortOrder
    sub_scoring?: SortOrder
    sub_impact?: SortOrder
    sub_consistency?: SortOrder
    sub_wicket_taking?: SortOrder
    sub_economy?: SortOrder
    sub_efficiency?: SortOrder
    sub_batting?: SortOrder
    sub_bowling?: SortOrder
    sub_versatility?: SortOrder
  }

  export type EnumCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCategoryWithAggregatesFilter<$PrismaModel> | $Enums.Category
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCategoryFilter<$PrismaModel>
    _max?: NestedEnumCategoryFilter<$PrismaModel>
  }

  export type EnumPoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Pool | EnumPoolFieldRefInput<$PrismaModel>
    in?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    not?: NestedEnumPoolWithAggregatesFilter<$PrismaModel> | $Enums.Pool
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPoolFilter<$PrismaModel>
    _max?: NestedEnumPoolFilter<$PrismaModel>
  }

  export type EnumGradeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel>
    in?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    not?: NestedEnumGradeWithAggregatesFilter<$PrismaModel> | $Enums.Grade
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGradeFilter<$PrismaModel>
    _max?: NestedEnumGradeFilter<$PrismaModel>
  }

  export type EnumNationalityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Nationality | EnumNationalityFieldRefInput<$PrismaModel>
    in?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    not?: NestedEnumNationalityWithAggregatesFilter<$PrismaModel> | $Enums.Nationality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNationalityFilter<$PrismaModel>
    _max?: NestedEnumNationalityFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumPlayerAuctionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerAuctionStatus | EnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerAuctionStatusFilter<$PrismaModel> | $Enums.PlayerAuctionStatus
  }

  export type PlayerScalarRelationFilter = {
    is?: PlayerWhereInput
    isNot?: PlayerWhereInput
  }

  export type TeamNullableScalarRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
  }

  export type AuctionPlayerCountOrderByAggregateInput = {
    id?: SortOrder
    player_id?: SortOrder
    status?: SortOrder
    sold_price?: SortOrder
    sold_to_team_id?: SortOrder
  }

  export type AuctionPlayerAvgOrderByAggregateInput = {
    sold_price?: SortOrder
  }

  export type AuctionPlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    player_id?: SortOrder
    status?: SortOrder
    sold_price?: SortOrder
    sold_to_team_id?: SortOrder
  }

  export type AuctionPlayerMinOrderByAggregateInput = {
    id?: SortOrder
    player_id?: SortOrder
    status?: SortOrder
    sold_price?: SortOrder
    sold_to_team_id?: SortOrder
  }

  export type AuctionPlayerSumOrderByAggregateInput = {
    sold_price?: SortOrder
  }

  export type EnumPlayerAuctionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerAuctionStatus | EnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerAuctionStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlayerAuctionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerAuctionStatusFilter<$PrismaModel>
    _max?: NestedEnumPlayerAuctionStatusFilter<$PrismaModel>
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type TeamPlayerTeam_idPlayer_idCompoundUniqueInput = {
    team_id: string
    player_id: string
  }

  export type TeamPlayerCountOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    player_id?: SortOrder
    price_paid?: SortOrder
  }

  export type TeamPlayerAvgOrderByAggregateInput = {
    price_paid?: SortOrder
  }

  export type TeamPlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    player_id?: SortOrder
    price_paid?: SortOrder
  }

  export type TeamPlayerMinOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    player_id?: SortOrder
    price_paid?: SortOrder
  }

  export type TeamPlayerSumOrderByAggregateInput = {
    price_paid?: SortOrder
  }

  export type EnumAuctionPhaseFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionPhase | EnumAuctionPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionPhaseFilter<$PrismaModel> | $Enums.AuctionPhase
  }

  export type AuctionStateCountOrderByAggregateInput = {
    id?: SortOrder
    phase?: SortOrder
    current_player_id?: SortOrder
    current_bid?: SortOrder
    highest_bidder_id?: SortOrder
    current_sequence_id?: SortOrder
    current_sequence_index?: SortOrder
    bid_frozen_team_id?: SortOrder
    auction_day?: SortOrder
    active_power_card?: SortOrder
    active_power_card_team?: SortOrder
    gods_eye_revealed?: SortOrder
    bid_history?: SortOrder
    last_sold_player_id?: SortOrder
    last_sold_price?: SortOrder
    last_sold_team_id?: SortOrder
    last_sold_team_name?: SortOrder
  }

  export type AuctionStateAvgOrderByAggregateInput = {
    id?: SortOrder
    current_bid?: SortOrder
    current_sequence_id?: SortOrder
    current_sequence_index?: SortOrder
    last_sold_price?: SortOrder
  }

  export type AuctionStateMaxOrderByAggregateInput = {
    id?: SortOrder
    phase?: SortOrder
    current_player_id?: SortOrder
    current_bid?: SortOrder
    highest_bidder_id?: SortOrder
    current_sequence_id?: SortOrder
    current_sequence_index?: SortOrder
    bid_frozen_team_id?: SortOrder
    auction_day?: SortOrder
    active_power_card?: SortOrder
    active_power_card_team?: SortOrder
    gods_eye_revealed?: SortOrder
    last_sold_player_id?: SortOrder
    last_sold_price?: SortOrder
    last_sold_team_id?: SortOrder
    last_sold_team_name?: SortOrder
  }

  export type AuctionStateMinOrderByAggregateInput = {
    id?: SortOrder
    phase?: SortOrder
    current_player_id?: SortOrder
    current_bid?: SortOrder
    highest_bidder_id?: SortOrder
    current_sequence_id?: SortOrder
    current_sequence_index?: SortOrder
    bid_frozen_team_id?: SortOrder
    auction_day?: SortOrder
    active_power_card?: SortOrder
    active_power_card_team?: SortOrder
    gods_eye_revealed?: SortOrder
    last_sold_player_id?: SortOrder
    last_sold_price?: SortOrder
    last_sold_team_id?: SortOrder
    last_sold_team_name?: SortOrder
  }

  export type AuctionStateSumOrderByAggregateInput = {
    id?: SortOrder
    current_bid?: SortOrder
    current_sequence_id?: SortOrder
    current_sequence_index?: SortOrder
    last_sold_price?: SortOrder
  }

  export type EnumAuctionPhaseWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionPhase | EnumAuctionPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionPhaseWithAggregatesFilter<$PrismaModel> | $Enums.AuctionPhase
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuctionPhaseFilter<$PrismaModel>
    _max?: NestedEnumAuctionPhaseFilter<$PrismaModel>
  }

  export type AuctionSequenceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    player_ids?: SortOrder
  }

  export type AuctionSequenceAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AuctionSequenceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type AuctionSequenceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type AuctionSequenceSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumPowerCardTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PowerCardType | EnumPowerCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPowerCardTypeFilter<$PrismaModel> | $Enums.PowerCardType
  }

  export type PowerCardTeam_idTypeCompoundUniqueInput = {
    team_id: string
    type: $Enums.PowerCardType
  }

  export type PowerCardCountOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    type?: SortOrder
    is_used?: SortOrder
  }

  export type PowerCardMaxOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    type?: SortOrder
    is_used?: SortOrder
  }

  export type PowerCardMinOrderByAggregateInput = {
    id?: SortOrder
    team_id?: SortOrder
    type?: SortOrder
    is_used?: SortOrder
  }

  export type EnumPowerCardTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PowerCardType | EnumPowerCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPowerCardTypeWithAggregatesFilter<$PrismaModel> | $Enums.PowerCardType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPowerCardTypeFilter<$PrismaModel>
    _max?: NestedEnumPowerCardTypeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type Top11SelectionCountOrderByAggregateInput = {
    team_id?: SortOrder
    player_ids?: SortOrder
    captain_id?: SortOrder
    vice_captain_id?: SortOrder
    submitted_at?: SortOrder
  }

  export type Top11SelectionMaxOrderByAggregateInput = {
    team_id?: SortOrder
    captain_id?: SortOrder
    vice_captain_id?: SortOrder
    submitted_at?: SortOrder
  }

  export type Top11SelectionMinOrderByAggregateInput = {
    team_id?: SortOrder
    captain_id?: SortOrder
    vice_captain_id?: SortOrder
    submitted_at?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    created_at?: SortOrder
  }

  export type FranchiseCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    short_name?: SortOrder
    brand_score?: SortOrder
    logo?: SortOrder
    primary_color?: SortOrder
  }

  export type FranchiseAvgOrderByAggregateInput = {
    id?: SortOrder
    brand_score?: SortOrder
  }

  export type FranchiseMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    short_name?: SortOrder
    brand_score?: SortOrder
    logo?: SortOrder
    primary_color?: SortOrder
  }

  export type FranchiseMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    short_name?: SortOrder
    brand_score?: SortOrder
    logo?: SortOrder
    primary_color?: SortOrder
  }

  export type FranchiseSumOrderByAggregateInput = {
    id?: SortOrder
    brand_score?: SortOrder
  }

  export type TeamPlayerCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamPlayerCreateWithoutTeamInput, TeamPlayerUncheckedCreateWithoutTeamInput> | TeamPlayerCreateWithoutTeamInput[] | TeamPlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutTeamInput | TeamPlayerCreateOrConnectWithoutTeamInput[]
    createMany?: TeamPlayerCreateManyTeamInputEnvelope
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
  }

  export type PowerCardCreateNestedManyWithoutTeamInput = {
    create?: XOR<PowerCardCreateWithoutTeamInput, PowerCardUncheckedCreateWithoutTeamInput> | PowerCardCreateWithoutTeamInput[] | PowerCardUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PowerCardCreateOrConnectWithoutTeamInput | PowerCardCreateOrConnectWithoutTeamInput[]
    createMany?: PowerCardCreateManyTeamInputEnvelope
    connect?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
  }

  export type Top11SelectionCreateNestedOneWithoutTeamInput = {
    create?: XOR<Top11SelectionCreateWithoutTeamInput, Top11SelectionUncheckedCreateWithoutTeamInput>
    connectOrCreate?: Top11SelectionCreateOrConnectWithoutTeamInput
    connect?: Top11SelectionWhereUniqueInput
  }

  export type AuctionPlayerCreateNestedManyWithoutSold_to_teamInput = {
    create?: XOR<AuctionPlayerCreateWithoutSold_to_teamInput, AuctionPlayerUncheckedCreateWithoutSold_to_teamInput> | AuctionPlayerCreateWithoutSold_to_teamInput[] | AuctionPlayerUncheckedCreateWithoutSold_to_teamInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutSold_to_teamInput | AuctionPlayerCreateOrConnectWithoutSold_to_teamInput[]
    createMany?: AuctionPlayerCreateManySold_to_teamInputEnvelope
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
  }

  export type TeamPlayerUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamPlayerCreateWithoutTeamInput, TeamPlayerUncheckedCreateWithoutTeamInput> | TeamPlayerCreateWithoutTeamInput[] | TeamPlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutTeamInput | TeamPlayerCreateOrConnectWithoutTeamInput[]
    createMany?: TeamPlayerCreateManyTeamInputEnvelope
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
  }

  export type PowerCardUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<PowerCardCreateWithoutTeamInput, PowerCardUncheckedCreateWithoutTeamInput> | PowerCardCreateWithoutTeamInput[] | PowerCardUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PowerCardCreateOrConnectWithoutTeamInput | PowerCardCreateOrConnectWithoutTeamInput[]
    createMany?: PowerCardCreateManyTeamInputEnvelope
    connect?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
  }

  export type Top11SelectionUncheckedCreateNestedOneWithoutTeamInput = {
    create?: XOR<Top11SelectionCreateWithoutTeamInput, Top11SelectionUncheckedCreateWithoutTeamInput>
    connectOrCreate?: Top11SelectionCreateOrConnectWithoutTeamInput
    connect?: Top11SelectionWhereUniqueInput
  }

  export type AuctionPlayerUncheckedCreateNestedManyWithoutSold_to_teamInput = {
    create?: XOR<AuctionPlayerCreateWithoutSold_to_teamInput, AuctionPlayerUncheckedCreateWithoutSold_to_teamInput> | AuctionPlayerCreateWithoutSold_to_teamInput[] | AuctionPlayerUncheckedCreateWithoutSold_to_teamInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutSold_to_teamInput | AuctionPlayerCreateOrConnectWithoutSold_to_teamInput[]
    createMany?: AuctionPlayerCreateManySold_to_teamInputEnvelope
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TeamPlayerUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamPlayerCreateWithoutTeamInput, TeamPlayerUncheckedCreateWithoutTeamInput> | TeamPlayerCreateWithoutTeamInput[] | TeamPlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutTeamInput | TeamPlayerCreateOrConnectWithoutTeamInput[]
    upsert?: TeamPlayerUpsertWithWhereUniqueWithoutTeamInput | TeamPlayerUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamPlayerCreateManyTeamInputEnvelope
    set?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    disconnect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    delete?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    update?: TeamPlayerUpdateWithWhereUniqueWithoutTeamInput | TeamPlayerUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamPlayerUpdateManyWithWhereWithoutTeamInput | TeamPlayerUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamPlayerScalarWhereInput | TeamPlayerScalarWhereInput[]
  }

  export type PowerCardUpdateManyWithoutTeamNestedInput = {
    create?: XOR<PowerCardCreateWithoutTeamInput, PowerCardUncheckedCreateWithoutTeamInput> | PowerCardCreateWithoutTeamInput[] | PowerCardUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PowerCardCreateOrConnectWithoutTeamInput | PowerCardCreateOrConnectWithoutTeamInput[]
    upsert?: PowerCardUpsertWithWhereUniqueWithoutTeamInput | PowerCardUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: PowerCardCreateManyTeamInputEnvelope
    set?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    disconnect?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    delete?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    connect?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    update?: PowerCardUpdateWithWhereUniqueWithoutTeamInput | PowerCardUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: PowerCardUpdateManyWithWhereWithoutTeamInput | PowerCardUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: PowerCardScalarWhereInput | PowerCardScalarWhereInput[]
  }

  export type Top11SelectionUpdateOneWithoutTeamNestedInput = {
    create?: XOR<Top11SelectionCreateWithoutTeamInput, Top11SelectionUncheckedCreateWithoutTeamInput>
    connectOrCreate?: Top11SelectionCreateOrConnectWithoutTeamInput
    upsert?: Top11SelectionUpsertWithoutTeamInput
    disconnect?: Top11SelectionWhereInput | boolean
    delete?: Top11SelectionWhereInput | boolean
    connect?: Top11SelectionWhereUniqueInput
    update?: XOR<XOR<Top11SelectionUpdateToOneWithWhereWithoutTeamInput, Top11SelectionUpdateWithoutTeamInput>, Top11SelectionUncheckedUpdateWithoutTeamInput>
  }

  export type AuctionPlayerUpdateManyWithoutSold_to_teamNestedInput = {
    create?: XOR<AuctionPlayerCreateWithoutSold_to_teamInput, AuctionPlayerUncheckedCreateWithoutSold_to_teamInput> | AuctionPlayerCreateWithoutSold_to_teamInput[] | AuctionPlayerUncheckedCreateWithoutSold_to_teamInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutSold_to_teamInput | AuctionPlayerCreateOrConnectWithoutSold_to_teamInput[]
    upsert?: AuctionPlayerUpsertWithWhereUniqueWithoutSold_to_teamInput | AuctionPlayerUpsertWithWhereUniqueWithoutSold_to_teamInput[]
    createMany?: AuctionPlayerCreateManySold_to_teamInputEnvelope
    set?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    disconnect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    delete?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    update?: AuctionPlayerUpdateWithWhereUniqueWithoutSold_to_teamInput | AuctionPlayerUpdateWithWhereUniqueWithoutSold_to_teamInput[]
    updateMany?: AuctionPlayerUpdateManyWithWhereWithoutSold_to_teamInput | AuctionPlayerUpdateManyWithWhereWithoutSold_to_teamInput[]
    deleteMany?: AuctionPlayerScalarWhereInput | AuctionPlayerScalarWhereInput[]
  }

  export type TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamPlayerCreateWithoutTeamInput, TeamPlayerUncheckedCreateWithoutTeamInput> | TeamPlayerCreateWithoutTeamInput[] | TeamPlayerUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutTeamInput | TeamPlayerCreateOrConnectWithoutTeamInput[]
    upsert?: TeamPlayerUpsertWithWhereUniqueWithoutTeamInput | TeamPlayerUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamPlayerCreateManyTeamInputEnvelope
    set?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    disconnect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    delete?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    update?: TeamPlayerUpdateWithWhereUniqueWithoutTeamInput | TeamPlayerUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamPlayerUpdateManyWithWhereWithoutTeamInput | TeamPlayerUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamPlayerScalarWhereInput | TeamPlayerScalarWhereInput[]
  }

  export type PowerCardUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<PowerCardCreateWithoutTeamInput, PowerCardUncheckedCreateWithoutTeamInput> | PowerCardCreateWithoutTeamInput[] | PowerCardUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: PowerCardCreateOrConnectWithoutTeamInput | PowerCardCreateOrConnectWithoutTeamInput[]
    upsert?: PowerCardUpsertWithWhereUniqueWithoutTeamInput | PowerCardUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: PowerCardCreateManyTeamInputEnvelope
    set?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    disconnect?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    delete?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    connect?: PowerCardWhereUniqueInput | PowerCardWhereUniqueInput[]
    update?: PowerCardUpdateWithWhereUniqueWithoutTeamInput | PowerCardUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: PowerCardUpdateManyWithWhereWithoutTeamInput | PowerCardUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: PowerCardScalarWhereInput | PowerCardScalarWhereInput[]
  }

  export type Top11SelectionUncheckedUpdateOneWithoutTeamNestedInput = {
    create?: XOR<Top11SelectionCreateWithoutTeamInput, Top11SelectionUncheckedCreateWithoutTeamInput>
    connectOrCreate?: Top11SelectionCreateOrConnectWithoutTeamInput
    upsert?: Top11SelectionUpsertWithoutTeamInput
    disconnect?: Top11SelectionWhereInput | boolean
    delete?: Top11SelectionWhereInput | boolean
    connect?: Top11SelectionWhereUniqueInput
    update?: XOR<XOR<Top11SelectionUpdateToOneWithWhereWithoutTeamInput, Top11SelectionUpdateWithoutTeamInput>, Top11SelectionUncheckedUpdateWithoutTeamInput>
  }

  export type AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamNestedInput = {
    create?: XOR<AuctionPlayerCreateWithoutSold_to_teamInput, AuctionPlayerUncheckedCreateWithoutSold_to_teamInput> | AuctionPlayerCreateWithoutSold_to_teamInput[] | AuctionPlayerUncheckedCreateWithoutSold_to_teamInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutSold_to_teamInput | AuctionPlayerCreateOrConnectWithoutSold_to_teamInput[]
    upsert?: AuctionPlayerUpsertWithWhereUniqueWithoutSold_to_teamInput | AuctionPlayerUpsertWithWhereUniqueWithoutSold_to_teamInput[]
    createMany?: AuctionPlayerCreateManySold_to_teamInputEnvelope
    set?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    disconnect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    delete?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    update?: AuctionPlayerUpdateWithWhereUniqueWithoutSold_to_teamInput | AuctionPlayerUpdateWithWhereUniqueWithoutSold_to_teamInput[]
    updateMany?: AuctionPlayerUpdateManyWithWhereWithoutSold_to_teamInput | AuctionPlayerUpdateManyWithWhereWithoutSold_to_teamInput[]
    deleteMany?: AuctionPlayerScalarWhereInput | AuctionPlayerScalarWhereInput[]
  }

  export type AuctionPlayerCreateNestedManyWithoutPlayerInput = {
    create?: XOR<AuctionPlayerCreateWithoutPlayerInput, AuctionPlayerUncheckedCreateWithoutPlayerInput> | AuctionPlayerCreateWithoutPlayerInput[] | AuctionPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutPlayerInput | AuctionPlayerCreateOrConnectWithoutPlayerInput[]
    createMany?: AuctionPlayerCreateManyPlayerInputEnvelope
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
  }

  export type TeamPlayerCreateNestedManyWithoutPlayerInput = {
    create?: XOR<TeamPlayerCreateWithoutPlayerInput, TeamPlayerUncheckedCreateWithoutPlayerInput> | TeamPlayerCreateWithoutPlayerInput[] | TeamPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutPlayerInput | TeamPlayerCreateOrConnectWithoutPlayerInput[]
    createMany?: TeamPlayerCreateManyPlayerInputEnvelope
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
  }

  export type AuctionPlayerUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<AuctionPlayerCreateWithoutPlayerInput, AuctionPlayerUncheckedCreateWithoutPlayerInput> | AuctionPlayerCreateWithoutPlayerInput[] | AuctionPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutPlayerInput | AuctionPlayerCreateOrConnectWithoutPlayerInput[]
    createMany?: AuctionPlayerCreateManyPlayerInputEnvelope
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
  }

  export type TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<TeamPlayerCreateWithoutPlayerInput, TeamPlayerUncheckedCreateWithoutPlayerInput> | TeamPlayerCreateWithoutPlayerInput[] | TeamPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutPlayerInput | TeamPlayerCreateOrConnectWithoutPlayerInput[]
    createMany?: TeamPlayerCreateManyPlayerInputEnvelope
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
  }

  export type EnumCategoryFieldUpdateOperationsInput = {
    set?: $Enums.Category
  }

  export type EnumPoolFieldUpdateOperationsInput = {
    set?: $Enums.Pool
  }

  export type EnumGradeFieldUpdateOperationsInput = {
    set?: $Enums.Grade
  }

  export type EnumNationalityFieldUpdateOperationsInput = {
    set?: $Enums.Nationality
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type AuctionPlayerUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<AuctionPlayerCreateWithoutPlayerInput, AuctionPlayerUncheckedCreateWithoutPlayerInput> | AuctionPlayerCreateWithoutPlayerInput[] | AuctionPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutPlayerInput | AuctionPlayerCreateOrConnectWithoutPlayerInput[]
    upsert?: AuctionPlayerUpsertWithWhereUniqueWithoutPlayerInput | AuctionPlayerUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: AuctionPlayerCreateManyPlayerInputEnvelope
    set?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    disconnect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    delete?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    update?: AuctionPlayerUpdateWithWhereUniqueWithoutPlayerInput | AuctionPlayerUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: AuctionPlayerUpdateManyWithWhereWithoutPlayerInput | AuctionPlayerUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: AuctionPlayerScalarWhereInput | AuctionPlayerScalarWhereInput[]
  }

  export type TeamPlayerUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<TeamPlayerCreateWithoutPlayerInput, TeamPlayerUncheckedCreateWithoutPlayerInput> | TeamPlayerCreateWithoutPlayerInput[] | TeamPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutPlayerInput | TeamPlayerCreateOrConnectWithoutPlayerInput[]
    upsert?: TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput | TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: TeamPlayerCreateManyPlayerInputEnvelope
    set?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    disconnect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    delete?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    update?: TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput | TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: TeamPlayerUpdateManyWithWhereWithoutPlayerInput | TeamPlayerUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: TeamPlayerScalarWhereInput | TeamPlayerScalarWhereInput[]
  }

  export type AuctionPlayerUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<AuctionPlayerCreateWithoutPlayerInput, AuctionPlayerUncheckedCreateWithoutPlayerInput> | AuctionPlayerCreateWithoutPlayerInput[] | AuctionPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: AuctionPlayerCreateOrConnectWithoutPlayerInput | AuctionPlayerCreateOrConnectWithoutPlayerInput[]
    upsert?: AuctionPlayerUpsertWithWhereUniqueWithoutPlayerInput | AuctionPlayerUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: AuctionPlayerCreateManyPlayerInputEnvelope
    set?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    disconnect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    delete?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    connect?: AuctionPlayerWhereUniqueInput | AuctionPlayerWhereUniqueInput[]
    update?: AuctionPlayerUpdateWithWhereUniqueWithoutPlayerInput | AuctionPlayerUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: AuctionPlayerUpdateManyWithWhereWithoutPlayerInput | AuctionPlayerUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: AuctionPlayerScalarWhereInput | AuctionPlayerScalarWhereInput[]
  }

  export type TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<TeamPlayerCreateWithoutPlayerInput, TeamPlayerUncheckedCreateWithoutPlayerInput> | TeamPlayerCreateWithoutPlayerInput[] | TeamPlayerUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: TeamPlayerCreateOrConnectWithoutPlayerInput | TeamPlayerCreateOrConnectWithoutPlayerInput[]
    upsert?: TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput | TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: TeamPlayerCreateManyPlayerInputEnvelope
    set?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    disconnect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    delete?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    connect?: TeamPlayerWhereUniqueInput | TeamPlayerWhereUniqueInput[]
    update?: TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput | TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: TeamPlayerUpdateManyWithWhereWithoutPlayerInput | TeamPlayerUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: TeamPlayerScalarWhereInput | TeamPlayerScalarWhereInput[]
  }

  export type PlayerCreateNestedOneWithoutAuction_playersInput = {
    create?: XOR<PlayerCreateWithoutAuction_playersInput, PlayerUncheckedCreateWithoutAuction_playersInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutAuction_playersInput
    connect?: PlayerWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutAuction_playersInput = {
    create?: XOR<TeamCreateWithoutAuction_playersInput, TeamUncheckedCreateWithoutAuction_playersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutAuction_playersInput
    connect?: TeamWhereUniqueInput
  }

  export type EnumPlayerAuctionStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlayerAuctionStatus
  }

  export type PlayerUpdateOneRequiredWithoutAuction_playersNestedInput = {
    create?: XOR<PlayerCreateWithoutAuction_playersInput, PlayerUncheckedCreateWithoutAuction_playersInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutAuction_playersInput
    upsert?: PlayerUpsertWithoutAuction_playersInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutAuction_playersInput, PlayerUpdateWithoutAuction_playersInput>, PlayerUncheckedUpdateWithoutAuction_playersInput>
  }

  export type TeamUpdateOneWithoutAuction_playersNestedInput = {
    create?: XOR<TeamCreateWithoutAuction_playersInput, TeamUncheckedCreateWithoutAuction_playersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutAuction_playersInput
    upsert?: TeamUpsertWithoutAuction_playersInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutAuction_playersInput, TeamUpdateWithoutAuction_playersInput>, TeamUncheckedUpdateWithoutAuction_playersInput>
  }

  export type TeamCreateNestedOneWithoutTeam_playersInput = {
    create?: XOR<TeamCreateWithoutTeam_playersInput, TeamUncheckedCreateWithoutTeam_playersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutTeam_playersInput
    connect?: TeamWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutTeam_playersInput = {
    create?: XOR<PlayerCreateWithoutTeam_playersInput, PlayerUncheckedCreateWithoutTeam_playersInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutTeam_playersInput
    connect?: PlayerWhereUniqueInput
  }

  export type TeamUpdateOneRequiredWithoutTeam_playersNestedInput = {
    create?: XOR<TeamCreateWithoutTeam_playersInput, TeamUncheckedCreateWithoutTeam_playersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutTeam_playersInput
    upsert?: TeamUpsertWithoutTeam_playersInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutTeam_playersInput, TeamUpdateWithoutTeam_playersInput>, TeamUncheckedUpdateWithoutTeam_playersInput>
  }

  export type PlayerUpdateOneRequiredWithoutTeam_playersNestedInput = {
    create?: XOR<PlayerCreateWithoutTeam_playersInput, PlayerUncheckedCreateWithoutTeam_playersInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutTeam_playersInput
    upsert?: PlayerUpsertWithoutTeam_playersInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutTeam_playersInput, PlayerUpdateWithoutTeam_playersInput>, PlayerUncheckedUpdateWithoutTeam_playersInput>
  }

  export type EnumAuctionPhaseFieldUpdateOperationsInput = {
    set?: $Enums.AuctionPhase
  }

  export type TeamCreateNestedOneWithoutPower_cardsInput = {
    create?: XOR<TeamCreateWithoutPower_cardsInput, TeamUncheckedCreateWithoutPower_cardsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutPower_cardsInput
    connect?: TeamWhereUniqueInput
  }

  export type EnumPowerCardTypeFieldUpdateOperationsInput = {
    set?: $Enums.PowerCardType
  }

  export type TeamUpdateOneRequiredWithoutPower_cardsNestedInput = {
    create?: XOR<TeamCreateWithoutPower_cardsInput, TeamUncheckedCreateWithoutPower_cardsInput>
    connectOrCreate?: TeamCreateOrConnectWithoutPower_cardsInput
    upsert?: TeamUpsertWithoutPower_cardsInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutPower_cardsInput, TeamUpdateWithoutPower_cardsInput>, TeamUncheckedUpdateWithoutPower_cardsInput>
  }

  export type Top11SelectionCreateplayer_idsInput = {
    set: string[]
  }

  export type TeamCreateNestedOneWithoutTop11_selectionInput = {
    create?: XOR<TeamCreateWithoutTop11_selectionInput, TeamUncheckedCreateWithoutTop11_selectionInput>
    connectOrCreate?: TeamCreateOrConnectWithoutTop11_selectionInput
    connect?: TeamWhereUniqueInput
  }

  export type Top11SelectionUpdateplayer_idsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TeamUpdateOneRequiredWithoutTop11_selectionNestedInput = {
    create?: XOR<TeamCreateWithoutTop11_selectionInput, TeamUncheckedCreateWithoutTop11_selectionInput>
    connectOrCreate?: TeamCreateOrConnectWithoutTop11_selectionInput
    upsert?: TeamUpsertWithoutTop11_selectionInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutTop11_selectionInput, TeamUpdateWithoutTop11_selectionInput>, TeamUncheckedUpdateWithoutTop11_selectionInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCategoryFilter<$PrismaModel> | $Enums.Category
  }

  export type NestedEnumPoolFilter<$PrismaModel = never> = {
    equals?: $Enums.Pool | EnumPoolFieldRefInput<$PrismaModel>
    in?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    not?: NestedEnumPoolFilter<$PrismaModel> | $Enums.Pool
  }

  export type NestedEnumGradeFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel>
    in?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    not?: NestedEnumGradeFilter<$PrismaModel> | $Enums.Grade
  }

  export type NestedEnumNationalityFilter<$PrismaModel = never> = {
    equals?: $Enums.Nationality | EnumNationalityFieldRefInput<$PrismaModel>
    in?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    not?: NestedEnumNationalityFilter<$PrismaModel> | $Enums.Nationality
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Category | EnumCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.Category[] | ListEnumCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCategoryWithAggregatesFilter<$PrismaModel> | $Enums.Category
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCategoryFilter<$PrismaModel>
    _max?: NestedEnumCategoryFilter<$PrismaModel>
  }

  export type NestedEnumPoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Pool | EnumPoolFieldRefInput<$PrismaModel>
    in?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    notIn?: $Enums.Pool[] | ListEnumPoolFieldRefInput<$PrismaModel>
    not?: NestedEnumPoolWithAggregatesFilter<$PrismaModel> | $Enums.Pool
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPoolFilter<$PrismaModel>
    _max?: NestedEnumPoolFilter<$PrismaModel>
  }

  export type NestedEnumGradeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Grade | EnumGradeFieldRefInput<$PrismaModel>
    in?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Grade[] | ListEnumGradeFieldRefInput<$PrismaModel>
    not?: NestedEnumGradeWithAggregatesFilter<$PrismaModel> | $Enums.Grade
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGradeFilter<$PrismaModel>
    _max?: NestedEnumGradeFilter<$PrismaModel>
  }

  export type NestedEnumNationalityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Nationality | EnumNationalityFieldRefInput<$PrismaModel>
    in?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Nationality[] | ListEnumNationalityFieldRefInput<$PrismaModel>
    not?: NestedEnumNationalityWithAggregatesFilter<$PrismaModel> | $Enums.Nationality
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNationalityFilter<$PrismaModel>
    _max?: NestedEnumNationalityFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumPlayerAuctionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerAuctionStatus | EnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerAuctionStatusFilter<$PrismaModel> | $Enums.PlayerAuctionStatus
  }

  export type NestedEnumPlayerAuctionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerAuctionStatus | EnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerAuctionStatus[] | ListEnumPlayerAuctionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerAuctionStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlayerAuctionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerAuctionStatusFilter<$PrismaModel>
    _max?: NestedEnumPlayerAuctionStatusFilter<$PrismaModel>
  }

  export type NestedEnumAuctionPhaseFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionPhase | EnumAuctionPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionPhaseFilter<$PrismaModel> | $Enums.AuctionPhase
  }

  export type NestedEnumAuctionPhaseWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuctionPhase | EnumAuctionPhaseFieldRefInput<$PrismaModel>
    in?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuctionPhase[] | ListEnumAuctionPhaseFieldRefInput<$PrismaModel>
    not?: NestedEnumAuctionPhaseWithAggregatesFilter<$PrismaModel> | $Enums.AuctionPhase
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuctionPhaseFilter<$PrismaModel>
    _max?: NestedEnumAuctionPhaseFilter<$PrismaModel>
  }

  export type NestedEnumPowerCardTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PowerCardType | EnumPowerCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPowerCardTypeFilter<$PrismaModel> | $Enums.PowerCardType
  }

  export type NestedEnumPowerCardTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PowerCardType | EnumPowerCardTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PowerCardType[] | ListEnumPowerCardTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPowerCardTypeWithAggregatesFilter<$PrismaModel> | $Enums.PowerCardType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPowerCardTypeFilter<$PrismaModel>
    _max?: NestedEnumPowerCardTypeFilter<$PrismaModel>
  }

  export type TeamPlayerCreateWithoutTeamInput = {
    id?: string
    price_paid: Decimal | DecimalJsLike | number | string
    player: PlayerCreateNestedOneWithoutTeam_playersInput
  }

  export type TeamPlayerUncheckedCreateWithoutTeamInput = {
    id?: string
    player_id: string
    price_paid: Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerCreateOrConnectWithoutTeamInput = {
    where: TeamPlayerWhereUniqueInput
    create: XOR<TeamPlayerCreateWithoutTeamInput, TeamPlayerUncheckedCreateWithoutTeamInput>
  }

  export type TeamPlayerCreateManyTeamInputEnvelope = {
    data: TeamPlayerCreateManyTeamInput | TeamPlayerCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type PowerCardCreateWithoutTeamInput = {
    id?: string
    type: $Enums.PowerCardType
    is_used?: boolean
  }

  export type PowerCardUncheckedCreateWithoutTeamInput = {
    id?: string
    type: $Enums.PowerCardType
    is_used?: boolean
  }

  export type PowerCardCreateOrConnectWithoutTeamInput = {
    where: PowerCardWhereUniqueInput
    create: XOR<PowerCardCreateWithoutTeamInput, PowerCardUncheckedCreateWithoutTeamInput>
  }

  export type PowerCardCreateManyTeamInputEnvelope = {
    data: PowerCardCreateManyTeamInput | PowerCardCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type Top11SelectionCreateWithoutTeamInput = {
    player_ids?: Top11SelectionCreateplayer_idsInput | string[]
    captain_id: string
    vice_captain_id: string
    submitted_at?: Date | string
  }

  export type Top11SelectionUncheckedCreateWithoutTeamInput = {
    player_ids?: Top11SelectionCreateplayer_idsInput | string[]
    captain_id: string
    vice_captain_id: string
    submitted_at?: Date | string
  }

  export type Top11SelectionCreateOrConnectWithoutTeamInput = {
    where: Top11SelectionWhereUniqueInput
    create: XOR<Top11SelectionCreateWithoutTeamInput, Top11SelectionUncheckedCreateWithoutTeamInput>
  }

  export type AuctionPlayerCreateWithoutSold_to_teamInput = {
    id?: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    player: PlayerCreateNestedOneWithoutAuction_playersInput
  }

  export type AuctionPlayerUncheckedCreateWithoutSold_to_teamInput = {
    id?: string
    player_id: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
  }

  export type AuctionPlayerCreateOrConnectWithoutSold_to_teamInput = {
    where: AuctionPlayerWhereUniqueInput
    create: XOR<AuctionPlayerCreateWithoutSold_to_teamInput, AuctionPlayerUncheckedCreateWithoutSold_to_teamInput>
  }

  export type AuctionPlayerCreateManySold_to_teamInputEnvelope = {
    data: AuctionPlayerCreateManySold_to_teamInput | AuctionPlayerCreateManySold_to_teamInput[]
    skipDuplicates?: boolean
  }

  export type TeamPlayerUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamPlayerWhereUniqueInput
    update: XOR<TeamPlayerUpdateWithoutTeamInput, TeamPlayerUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamPlayerCreateWithoutTeamInput, TeamPlayerUncheckedCreateWithoutTeamInput>
  }

  export type TeamPlayerUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamPlayerWhereUniqueInput
    data: XOR<TeamPlayerUpdateWithoutTeamInput, TeamPlayerUncheckedUpdateWithoutTeamInput>
  }

  export type TeamPlayerUpdateManyWithWhereWithoutTeamInput = {
    where: TeamPlayerScalarWhereInput
    data: XOR<TeamPlayerUpdateManyMutationInput, TeamPlayerUncheckedUpdateManyWithoutTeamInput>
  }

  export type TeamPlayerScalarWhereInput = {
    AND?: TeamPlayerScalarWhereInput | TeamPlayerScalarWhereInput[]
    OR?: TeamPlayerScalarWhereInput[]
    NOT?: TeamPlayerScalarWhereInput | TeamPlayerScalarWhereInput[]
    id?: StringFilter<"TeamPlayer"> | string
    team_id?: StringFilter<"TeamPlayer"> | string
    player_id?: StringFilter<"TeamPlayer"> | string
    price_paid?: DecimalFilter<"TeamPlayer"> | Decimal | DecimalJsLike | number | string
  }

  export type PowerCardUpsertWithWhereUniqueWithoutTeamInput = {
    where: PowerCardWhereUniqueInput
    update: XOR<PowerCardUpdateWithoutTeamInput, PowerCardUncheckedUpdateWithoutTeamInput>
    create: XOR<PowerCardCreateWithoutTeamInput, PowerCardUncheckedCreateWithoutTeamInput>
  }

  export type PowerCardUpdateWithWhereUniqueWithoutTeamInput = {
    where: PowerCardWhereUniqueInput
    data: XOR<PowerCardUpdateWithoutTeamInput, PowerCardUncheckedUpdateWithoutTeamInput>
  }

  export type PowerCardUpdateManyWithWhereWithoutTeamInput = {
    where: PowerCardScalarWhereInput
    data: XOR<PowerCardUpdateManyMutationInput, PowerCardUncheckedUpdateManyWithoutTeamInput>
  }

  export type PowerCardScalarWhereInput = {
    AND?: PowerCardScalarWhereInput | PowerCardScalarWhereInput[]
    OR?: PowerCardScalarWhereInput[]
    NOT?: PowerCardScalarWhereInput | PowerCardScalarWhereInput[]
    id?: StringFilter<"PowerCard"> | string
    team_id?: StringFilter<"PowerCard"> | string
    type?: EnumPowerCardTypeFilter<"PowerCard"> | $Enums.PowerCardType
    is_used?: BoolFilter<"PowerCard"> | boolean
  }

  export type Top11SelectionUpsertWithoutTeamInput = {
    update: XOR<Top11SelectionUpdateWithoutTeamInput, Top11SelectionUncheckedUpdateWithoutTeamInput>
    create: XOR<Top11SelectionCreateWithoutTeamInput, Top11SelectionUncheckedCreateWithoutTeamInput>
    where?: Top11SelectionWhereInput
  }

  export type Top11SelectionUpdateToOneWithWhereWithoutTeamInput = {
    where?: Top11SelectionWhereInput
    data: XOR<Top11SelectionUpdateWithoutTeamInput, Top11SelectionUncheckedUpdateWithoutTeamInput>
  }

  export type Top11SelectionUpdateWithoutTeamInput = {
    player_ids?: Top11SelectionUpdateplayer_idsInput | string[]
    captain_id?: StringFieldUpdateOperationsInput | string
    vice_captain_id?: StringFieldUpdateOperationsInput | string
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Top11SelectionUncheckedUpdateWithoutTeamInput = {
    player_ids?: Top11SelectionUpdateplayer_idsInput | string[]
    captain_id?: StringFieldUpdateOperationsInput | string
    vice_captain_id?: StringFieldUpdateOperationsInput | string
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuctionPlayerUpsertWithWhereUniqueWithoutSold_to_teamInput = {
    where: AuctionPlayerWhereUniqueInput
    update: XOR<AuctionPlayerUpdateWithoutSold_to_teamInput, AuctionPlayerUncheckedUpdateWithoutSold_to_teamInput>
    create: XOR<AuctionPlayerCreateWithoutSold_to_teamInput, AuctionPlayerUncheckedCreateWithoutSold_to_teamInput>
  }

  export type AuctionPlayerUpdateWithWhereUniqueWithoutSold_to_teamInput = {
    where: AuctionPlayerWhereUniqueInput
    data: XOR<AuctionPlayerUpdateWithoutSold_to_teamInput, AuctionPlayerUncheckedUpdateWithoutSold_to_teamInput>
  }

  export type AuctionPlayerUpdateManyWithWhereWithoutSold_to_teamInput = {
    where: AuctionPlayerScalarWhereInput
    data: XOR<AuctionPlayerUpdateManyMutationInput, AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamInput>
  }

  export type AuctionPlayerScalarWhereInput = {
    AND?: AuctionPlayerScalarWhereInput | AuctionPlayerScalarWhereInput[]
    OR?: AuctionPlayerScalarWhereInput[]
    NOT?: AuctionPlayerScalarWhereInput | AuctionPlayerScalarWhereInput[]
    id?: StringFilter<"AuctionPlayer"> | string
    player_id?: StringFilter<"AuctionPlayer"> | string
    status?: EnumPlayerAuctionStatusFilter<"AuctionPlayer"> | $Enums.PlayerAuctionStatus
    sold_price?: DecimalNullableFilter<"AuctionPlayer"> | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: StringNullableFilter<"AuctionPlayer"> | string | null
  }

  export type AuctionPlayerCreateWithoutPlayerInput = {
    id?: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    sold_to_team?: TeamCreateNestedOneWithoutAuction_playersInput
  }

  export type AuctionPlayerUncheckedCreateWithoutPlayerInput = {
    id?: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: string | null
  }

  export type AuctionPlayerCreateOrConnectWithoutPlayerInput = {
    where: AuctionPlayerWhereUniqueInput
    create: XOR<AuctionPlayerCreateWithoutPlayerInput, AuctionPlayerUncheckedCreateWithoutPlayerInput>
  }

  export type AuctionPlayerCreateManyPlayerInputEnvelope = {
    data: AuctionPlayerCreateManyPlayerInput | AuctionPlayerCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type TeamPlayerCreateWithoutPlayerInput = {
    id?: string
    price_paid: Decimal | DecimalJsLike | number | string
    team: TeamCreateNestedOneWithoutTeam_playersInput
  }

  export type TeamPlayerUncheckedCreateWithoutPlayerInput = {
    id?: string
    team_id: string
    price_paid: Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerCreateOrConnectWithoutPlayerInput = {
    where: TeamPlayerWhereUniqueInput
    create: XOR<TeamPlayerCreateWithoutPlayerInput, TeamPlayerUncheckedCreateWithoutPlayerInput>
  }

  export type TeamPlayerCreateManyPlayerInputEnvelope = {
    data: TeamPlayerCreateManyPlayerInput | TeamPlayerCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type AuctionPlayerUpsertWithWhereUniqueWithoutPlayerInput = {
    where: AuctionPlayerWhereUniqueInput
    update: XOR<AuctionPlayerUpdateWithoutPlayerInput, AuctionPlayerUncheckedUpdateWithoutPlayerInput>
    create: XOR<AuctionPlayerCreateWithoutPlayerInput, AuctionPlayerUncheckedCreateWithoutPlayerInput>
  }

  export type AuctionPlayerUpdateWithWhereUniqueWithoutPlayerInput = {
    where: AuctionPlayerWhereUniqueInput
    data: XOR<AuctionPlayerUpdateWithoutPlayerInput, AuctionPlayerUncheckedUpdateWithoutPlayerInput>
  }

  export type AuctionPlayerUpdateManyWithWhereWithoutPlayerInput = {
    where: AuctionPlayerScalarWhereInput
    data: XOR<AuctionPlayerUpdateManyMutationInput, AuctionPlayerUncheckedUpdateManyWithoutPlayerInput>
  }

  export type TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput = {
    where: TeamPlayerWhereUniqueInput
    update: XOR<TeamPlayerUpdateWithoutPlayerInput, TeamPlayerUncheckedUpdateWithoutPlayerInput>
    create: XOR<TeamPlayerCreateWithoutPlayerInput, TeamPlayerUncheckedCreateWithoutPlayerInput>
  }

  export type TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput = {
    where: TeamPlayerWhereUniqueInput
    data: XOR<TeamPlayerUpdateWithoutPlayerInput, TeamPlayerUncheckedUpdateWithoutPlayerInput>
  }

  export type TeamPlayerUpdateManyWithWhereWithoutPlayerInput = {
    where: TeamPlayerScalarWhereInput
    data: XOR<TeamPlayerUpdateManyMutationInput, TeamPlayerUncheckedUpdateManyWithoutPlayerInput>
  }

  export type PlayerCreateWithoutAuction_playersInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
    team_players?: TeamPlayerCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutAuction_playersInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
    team_players?: TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutAuction_playersInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutAuction_playersInput, PlayerUncheckedCreateWithoutAuction_playersInput>
  }

  export type TeamCreateWithoutAuction_playersInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerCreateNestedManyWithoutTeamInput
    power_cards?: PowerCardCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionCreateNestedOneWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutAuction_playersInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerUncheckedCreateNestedManyWithoutTeamInput
    power_cards?: PowerCardUncheckedCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionUncheckedCreateNestedOneWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutAuction_playersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutAuction_playersInput, TeamUncheckedCreateWithoutAuction_playersInput>
  }

  export type PlayerUpsertWithoutAuction_playersInput = {
    update: XOR<PlayerUpdateWithoutAuction_playersInput, PlayerUncheckedUpdateWithoutAuction_playersInput>
    create: XOR<PlayerCreateWithoutAuction_playersInput, PlayerUncheckedCreateWithoutAuction_playersInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutAuction_playersInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutAuction_playersInput, PlayerUncheckedUpdateWithoutAuction_playersInput>
  }

  export type PlayerUpdateWithoutAuction_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
    team_players?: TeamPlayerUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutAuction_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
    team_players?: TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type TeamUpsertWithoutAuction_playersInput = {
    update: XOR<TeamUpdateWithoutAuction_playersInput, TeamUncheckedUpdateWithoutAuction_playersInput>
    create: XOR<TeamCreateWithoutAuction_playersInput, TeamUncheckedCreateWithoutAuction_playersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutAuction_playersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutAuction_playersInput, TeamUncheckedUpdateWithoutAuction_playersInput>
  }

  export type TeamUpdateWithoutAuction_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUpdateManyWithoutTeamNestedInput
    power_cards?: PowerCardUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUpdateOneWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutAuction_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput
    power_cards?: PowerCardUncheckedUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUncheckedUpdateOneWithoutTeamNestedInput
  }

  export type TeamCreateWithoutTeam_playersInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    power_cards?: PowerCardCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionCreateNestedOneWithoutTeamInput
    auction_players?: AuctionPlayerCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamUncheckedCreateWithoutTeam_playersInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    power_cards?: PowerCardUncheckedCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionUncheckedCreateNestedOneWithoutTeamInput
    auction_players?: AuctionPlayerUncheckedCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamCreateOrConnectWithoutTeam_playersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutTeam_playersInput, TeamUncheckedCreateWithoutTeam_playersInput>
  }

  export type PlayerCreateWithoutTeam_playersInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
    auction_players?: AuctionPlayerCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutTeam_playersInput = {
    id?: string
    rank: number
    name: string
    team: string
    role: string
    category: $Enums.Category
    pool: $Enums.Pool
    grade: $Enums.Grade
    rating: number
    nationality: $Enums.Nationality
    nationality_raw?: string | null
    base_price: Decimal | DecimalJsLike | number | string
    legacy?: number
    url?: string | null
    image_url?: string | null
    is_riddle?: boolean
    matches?: number | null
    bat_runs?: number | null
    bat_sr?: Decimal | DecimalJsLike | number | string | null
    bat_average?: Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: number | null
    bowl_eco?: Decimal | DecimalJsLike | number | string | null
    bowl_avg?: Decimal | DecimalJsLike | number | string | null
    sub_experience?: number | null
    sub_scoring?: number | null
    sub_impact?: number | null
    sub_consistency?: number | null
    sub_wicket_taking?: number | null
    sub_economy?: number | null
    sub_efficiency?: number | null
    sub_batting?: number | null
    sub_bowling?: number | null
    sub_versatility?: number | null
    auction_players?: AuctionPlayerUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutTeam_playersInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutTeam_playersInput, PlayerUncheckedCreateWithoutTeam_playersInput>
  }

  export type TeamUpsertWithoutTeam_playersInput = {
    update: XOR<TeamUpdateWithoutTeam_playersInput, TeamUncheckedUpdateWithoutTeam_playersInput>
    create: XOR<TeamCreateWithoutTeam_playersInput, TeamUncheckedCreateWithoutTeam_playersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutTeam_playersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutTeam_playersInput, TeamUncheckedUpdateWithoutTeam_playersInput>
  }

  export type TeamUpdateWithoutTeam_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    power_cards?: PowerCardUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUpdateOneWithoutTeamNestedInput
    auction_players?: AuctionPlayerUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamUncheckedUpdateWithoutTeam_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    power_cards?: PowerCardUncheckedUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUncheckedUpdateOneWithoutTeamNestedInput
    auction_players?: AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamNestedInput
  }

  export type PlayerUpsertWithoutTeam_playersInput = {
    update: XOR<PlayerUpdateWithoutTeam_playersInput, PlayerUncheckedUpdateWithoutTeam_playersInput>
    create: XOR<PlayerCreateWithoutTeam_playersInput, PlayerUncheckedCreateWithoutTeam_playersInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutTeam_playersInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutTeam_playersInput, PlayerUncheckedUpdateWithoutTeam_playersInput>
  }

  export type PlayerUpdateWithoutTeam_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
    auction_players?: AuctionPlayerUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutTeam_playersInput = {
    id?: StringFieldUpdateOperationsInput | string
    rank?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryFieldUpdateOperationsInput | $Enums.Category
    pool?: EnumPoolFieldUpdateOperationsInput | $Enums.Pool
    grade?: EnumGradeFieldUpdateOperationsInput | $Enums.Grade
    rating?: IntFieldUpdateOperationsInput | number
    nationality?: EnumNationalityFieldUpdateOperationsInput | $Enums.Nationality
    nationality_raw?: NullableStringFieldUpdateOperationsInput | string | null
    base_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    legacy?: IntFieldUpdateOperationsInput | number
    url?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    is_riddle?: BoolFieldUpdateOperationsInput | boolean
    matches?: NullableIntFieldUpdateOperationsInput | number | null
    bat_runs?: NullableIntFieldUpdateOperationsInput | number | null
    bat_sr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bat_average?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_wickets?: NullableIntFieldUpdateOperationsInput | number | null
    bowl_eco?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    bowl_avg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sub_experience?: NullableIntFieldUpdateOperationsInput | number | null
    sub_scoring?: NullableIntFieldUpdateOperationsInput | number | null
    sub_impact?: NullableIntFieldUpdateOperationsInput | number | null
    sub_consistency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_wicket_taking?: NullableIntFieldUpdateOperationsInput | number | null
    sub_economy?: NullableIntFieldUpdateOperationsInput | number | null
    sub_efficiency?: NullableIntFieldUpdateOperationsInput | number | null
    sub_batting?: NullableIntFieldUpdateOperationsInput | number | null
    sub_bowling?: NullableIntFieldUpdateOperationsInput | number | null
    sub_versatility?: NullableIntFieldUpdateOperationsInput | number | null
    auction_players?: AuctionPlayerUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type TeamCreateWithoutPower_cardsInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionCreateNestedOneWithoutTeamInput
    auction_players?: AuctionPlayerCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamUncheckedCreateWithoutPower_cardsInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerUncheckedCreateNestedManyWithoutTeamInput
    top11_selection?: Top11SelectionUncheckedCreateNestedOneWithoutTeamInput
    auction_players?: AuctionPlayerUncheckedCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamCreateOrConnectWithoutPower_cardsInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutPower_cardsInput, TeamUncheckedCreateWithoutPower_cardsInput>
  }

  export type TeamUpsertWithoutPower_cardsInput = {
    update: XOR<TeamUpdateWithoutPower_cardsInput, TeamUncheckedUpdateWithoutPower_cardsInput>
    create: XOR<TeamCreateWithoutPower_cardsInput, TeamUncheckedCreateWithoutPower_cardsInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutPower_cardsInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutPower_cardsInput, TeamUncheckedUpdateWithoutPower_cardsInput>
  }

  export type TeamUpdateWithoutPower_cardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUpdateOneWithoutTeamNestedInput
    auction_players?: AuctionPlayerUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamUncheckedUpdateWithoutPower_cardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput
    top11_selection?: Top11SelectionUncheckedUpdateOneWithoutTeamNestedInput
    auction_players?: AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamCreateWithoutTop11_selectionInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerCreateNestedManyWithoutTeamInput
    power_cards?: PowerCardCreateNestedManyWithoutTeamInput
    auction_players?: AuctionPlayerCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamUncheckedCreateWithoutTop11_selectionInput = {
    id?: string
    name: string
    password_hash: string
    active_session_id?: string | null
    brand_key?: string | null
    franchise_name?: string | null
    brand_score?: Decimal | DecimalJsLike | number | string
    purse_remaining?: Decimal | DecimalJsLike | number | string
    squad_count?: number
    overseas_count?: number
    batsmen_count?: number
    bowlers_count?: number
    ar_count?: number
    wk_count?: number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: string | null
    primary_color?: string | null
    created_at?: Date | string
    team_players?: TeamPlayerUncheckedCreateNestedManyWithoutTeamInput
    power_cards?: PowerCardUncheckedCreateNestedManyWithoutTeamInput
    auction_players?: AuctionPlayerUncheckedCreateNestedManyWithoutSold_to_teamInput
  }

  export type TeamCreateOrConnectWithoutTop11_selectionInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutTop11_selectionInput, TeamUncheckedCreateWithoutTop11_selectionInput>
  }

  export type TeamUpsertWithoutTop11_selectionInput = {
    update: XOR<TeamUpdateWithoutTop11_selectionInput, TeamUncheckedUpdateWithoutTop11_selectionInput>
    create: XOR<TeamCreateWithoutTop11_selectionInput, TeamUncheckedCreateWithoutTop11_selectionInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutTop11_selectionInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutTop11_selectionInput, TeamUncheckedUpdateWithoutTop11_selectionInput>
  }

  export type TeamUpdateWithoutTop11_selectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUpdateManyWithoutTeamNestedInput
    power_cards?: PowerCardUpdateManyWithoutTeamNestedInput
    auction_players?: AuctionPlayerUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamUncheckedUpdateWithoutTop11_selectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    active_session_id?: NullableStringFieldUpdateOperationsInput | string | null
    brand_key?: NullableStringFieldUpdateOperationsInput | string | null
    franchise_name?: NullableStringFieldUpdateOperationsInput | string | null
    brand_score?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purse_remaining?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    squad_count?: IntFieldUpdateOperationsInput | number
    overseas_count?: IntFieldUpdateOperationsInput | number
    batsmen_count?: IntFieldUpdateOperationsInput | number
    bowlers_count?: IntFieldUpdateOperationsInput | number
    ar_count?: IntFieldUpdateOperationsInput | number
    wk_count?: IntFieldUpdateOperationsInput | number
    purchased_players?: JsonNullValueInput | InputJsonValue
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    primary_color?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    team_players?: TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput
    power_cards?: PowerCardUncheckedUpdateManyWithoutTeamNestedInput
    auction_players?: AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamNestedInput
  }

  export type TeamPlayerCreateManyTeamInput = {
    id?: string
    player_id: string
    price_paid: Decimal | DecimalJsLike | number | string
  }

  export type PowerCardCreateManyTeamInput = {
    id?: string
    type: $Enums.PowerCardType
    is_used?: boolean
  }

  export type AuctionPlayerCreateManySold_to_teamInput = {
    id?: string
    player_id: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
  }

  export type TeamPlayerUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    player?: PlayerUpdateOneRequiredWithoutTeam_playersNestedInput
  }

  export type TeamPlayerUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PowerCardUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PowerCardUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PowerCardUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumPowerCardTypeFieldUpdateOperationsInput | $Enums.PowerCardType
    is_used?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuctionPlayerUpdateWithoutSold_to_teamInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    player?: PlayerUpdateOneRequiredWithoutAuction_playersNestedInput
  }

  export type AuctionPlayerUncheckedUpdateWithoutSold_to_teamInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AuctionPlayerUncheckedUpdateManyWithoutSold_to_teamInput = {
    id?: StringFieldUpdateOperationsInput | string
    player_id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type AuctionPlayerCreateManyPlayerInput = {
    id?: string
    status?: $Enums.PlayerAuctionStatus
    sold_price?: Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: string | null
  }

  export type TeamPlayerCreateManyPlayerInput = {
    id?: string
    team_id: string
    price_paid: Decimal | DecimalJsLike | number | string
  }

  export type AuctionPlayerUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sold_to_team?: TeamUpdateOneWithoutAuction_playersNestedInput
  }

  export type AuctionPlayerUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuctionPlayerUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumPlayerAuctionStatusFieldUpdateOperationsInput | $Enums.PlayerAuctionStatus
    sold_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sold_to_team_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamPlayerUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    team?: TeamUpdateOneRequiredWithoutTeam_playersNestedInput
  }

  export type TeamPlayerUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    team_id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type TeamPlayerUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    team_id?: StringFieldUpdateOperationsInput | string
    price_paid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
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