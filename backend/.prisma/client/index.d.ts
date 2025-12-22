
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductImages
 * 
 */
export type ProductImages = $Result.DefaultSelection<Prisma.$ProductImagesPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model BreadVanLocation
 * 
 */
export type BreadVanLocation = $Result.DefaultSelection<Prisma.$BreadVanLocationPayload>
/**
 * Model ContactInfo
 * 
 */
export type ContactInfo = $Result.DefaultSelection<Prisma.$ContactInfoPayload>
/**
 * Model Media
 * 
 */
export type Media = $Result.DefaultSelection<Prisma.$MediaPayload>
/**
 * Model ArticleImages
 * 
 */
export type ArticleImages = $Result.DefaultSelection<Prisma.$ArticleImagesPayload>
/**
 * Model BlogItem
 * 
 */
export type BlogItem = $Result.DefaultSelection<Prisma.$BlogItemPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  BLOGGER: 'BLOGGER',
  VIEWER: 'VIEWER'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productImages`: Exposes CRUD operations for the **ProductImages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductImages
    * const productImages = await prisma.productImages.findMany()
    * ```
    */
  get productImages(): Prisma.ProductImagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.breadVanLocation`: Exposes CRUD operations for the **BreadVanLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BreadVanLocations
    * const breadVanLocations = await prisma.breadVanLocation.findMany()
    * ```
    */
  get breadVanLocation(): Prisma.BreadVanLocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contactInfo`: Exposes CRUD operations for the **ContactInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactInfos
    * const contactInfos = await prisma.contactInfo.findMany()
    * ```
    */
  get contactInfo(): Prisma.ContactInfoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.media`: Exposes CRUD operations for the **Media** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Media
    * const media = await prisma.media.findMany()
    * ```
    */
  get media(): Prisma.MediaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleImages`: Exposes CRUD operations for the **ArticleImages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleImages
    * const articleImages = await prisma.articleImages.findMany()
    * ```
    */
  get articleImages(): Prisma.ArticleImagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.blogItem`: Exposes CRUD operations for the **BlogItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BlogItems
    * const blogItems = await prisma.blogItem.findMany()
    * ```
    */
  get blogItem(): Prisma.BlogItemDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
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
    User: 'User',
    Category: 'Category',
    Product: 'Product',
    ProductImages: 'ProductImages',
    Location: 'Location',
    BreadVanLocation: 'BreadVanLocation',
    ContactInfo: 'ContactInfo',
    Media: 'Media',
    ArticleImages: 'ArticleImages',
    BlogItem: 'BlogItem'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "category" | "product" | "productImages" | "location" | "breadVanLocation" | "contactInfo" | "media" | "articleImages" | "blogItem"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductImages: {
        payload: Prisma.$ProductImagesPayload<ExtArgs>
        fields: Prisma.ProductImagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductImagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductImagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>
          }
          findFirst: {
            args: Prisma.ProductImagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductImagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>
          }
          findMany: {
            args: Prisma.ProductImagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>[]
          }
          create: {
            args: Prisma.ProductImagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>
          }
          createMany: {
            args: Prisma.ProductImagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductImagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>
          }
          update: {
            args: Prisma.ProductImagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>
          }
          deleteMany: {
            args: Prisma.ProductImagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductImagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductImagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagesPayload>
          }
          aggregate: {
            args: Prisma.ProductImagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductImages>
          }
          groupBy: {
            args: Prisma.ProductImagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductImagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductImagesCountArgs<ExtArgs>
            result: $Utils.Optional<ProductImagesCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      BreadVanLocation: {
        payload: Prisma.$BreadVanLocationPayload<ExtArgs>
        fields: Prisma.BreadVanLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BreadVanLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BreadVanLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>
          }
          findFirst: {
            args: Prisma.BreadVanLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BreadVanLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>
          }
          findMany: {
            args: Prisma.BreadVanLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>[]
          }
          create: {
            args: Prisma.BreadVanLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>
          }
          createMany: {
            args: Prisma.BreadVanLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BreadVanLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>
          }
          update: {
            args: Prisma.BreadVanLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>
          }
          deleteMany: {
            args: Prisma.BreadVanLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BreadVanLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BreadVanLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BreadVanLocationPayload>
          }
          aggregate: {
            args: Prisma.BreadVanLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBreadVanLocation>
          }
          groupBy: {
            args: Prisma.BreadVanLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<BreadVanLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.BreadVanLocationCountArgs<ExtArgs>
            result: $Utils.Optional<BreadVanLocationCountAggregateOutputType> | number
          }
        }
      }
      ContactInfo: {
        payload: Prisma.$ContactInfoPayload<ExtArgs>
        fields: Prisma.ContactInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          findFirst: {
            args: Prisma.ContactInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          findMany: {
            args: Prisma.ContactInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>[]
          }
          create: {
            args: Prisma.ContactInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          createMany: {
            args: Prisma.ContactInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ContactInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          update: {
            args: Prisma.ContactInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          deleteMany: {
            args: Prisma.ContactInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ContactInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactInfoPayload>
          }
          aggregate: {
            args: Prisma.ContactInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactInfo>
          }
          groupBy: {
            args: Prisma.ContactInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactInfoCountArgs<ExtArgs>
            result: $Utils.Optional<ContactInfoCountAggregateOutputType> | number
          }
        }
      }
      Media: {
        payload: Prisma.$MediaPayload<ExtArgs>
        fields: Prisma.MediaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          findFirst: {
            args: Prisma.MediaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          findMany: {
            args: Prisma.MediaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          create: {
            args: Prisma.MediaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          createMany: {
            args: Prisma.MediaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MediaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          update: {
            args: Prisma.MediaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          deleteMany: {
            args: Prisma.MediaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MediaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          aggregate: {
            args: Prisma.MediaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedia>
          }
          groupBy: {
            args: Prisma.MediaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MediaCountArgs<ExtArgs>
            result: $Utils.Optional<MediaCountAggregateOutputType> | number
          }
        }
      }
      ArticleImages: {
        payload: Prisma.$ArticleImagesPayload<ExtArgs>
        fields: Prisma.ArticleImagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleImagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleImagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>
          }
          findFirst: {
            args: Prisma.ArticleImagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleImagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>
          }
          findMany: {
            args: Prisma.ArticleImagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>[]
          }
          create: {
            args: Prisma.ArticleImagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>
          }
          createMany: {
            args: Prisma.ArticleImagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ArticleImagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>
          }
          update: {
            args: Prisma.ArticleImagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>
          }
          deleteMany: {
            args: Prisma.ArticleImagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleImagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ArticleImagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleImagesPayload>
          }
          aggregate: {
            args: Prisma.ArticleImagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleImages>
          }
          groupBy: {
            args: Prisma.ArticleImagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleImagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleImagesCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleImagesCountAggregateOutputType> | number
          }
        }
      }
      BlogItem: {
        payload: Prisma.$BlogItemPayload<ExtArgs>
        fields: Prisma.BlogItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BlogItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BlogItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>
          }
          findFirst: {
            args: Prisma.BlogItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BlogItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>
          }
          findMany: {
            args: Prisma.BlogItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>[]
          }
          create: {
            args: Prisma.BlogItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>
          }
          createMany: {
            args: Prisma.BlogItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BlogItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>
          }
          update: {
            args: Prisma.BlogItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>
          }
          deleteMany: {
            args: Prisma.BlogItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BlogItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BlogItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BlogItemPayload>
          }
          aggregate: {
            args: Prisma.BlogItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBlogItem>
          }
          groupBy: {
            args: Prisma.BlogItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<BlogItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.BlogItemCountArgs<ExtArgs>
            result: $Utils.Optional<BlogItemCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
    adapter?: runtime.SqlDriverAdapterFactory | null
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
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    category?: CategoryOmit
    product?: ProductOmit
    productImages?: ProductImagesOmit
    location?: LocationOmit
    breadVanLocation?: BreadVanLocationOmit
    contactInfo?: ContactInfoOmit
    media?: MediaOmit
    articleImages?: ArticleImagesOmit
    blogItem?: BlogItemOmit
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
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    products: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | CategoryCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    images: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | ProductCountOutputTypeCountImagesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductImagesWhereInput
  }


  /**
   * Count Type ContactInfoCountOutputType
   */

  export type ContactInfoCountOutputType = {
    media: number
    locations: number
  }

  export type ContactInfoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | ContactInfoCountOutputTypeCountMediaArgs
    locations?: boolean | ContactInfoCountOutputTypeCountLocationsArgs
  }

  // Custom InputTypes
  /**
   * ContactInfoCountOutputType without action
   */
  export type ContactInfoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfoCountOutputType
     */
    select?: ContactInfoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContactInfoCountOutputType without action
   */
  export type ContactInfoCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
  }

  /**
   * ContactInfoCountOutputType without action
   */
  export type ContactInfoCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
  }


  /**
   * Count Type BlogItemCountOutputType
   */

  export type BlogItemCountOutputType = {
    images: number
  }

  export type BlogItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | BlogItemCountOutputTypeCountImagesArgs
  }

  // Custom InputTypes
  /**
   * BlogItemCountOutputType without action
   */
  export type BlogItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItemCountOutputType
     */
    select?: BlogItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BlogItemCountOutputType without action
   */
  export type BlogItemCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleImagesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    role: $Enums.Role | null
    login: string | null
    password: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    role: $Enums.Role | null
    login: string | null
    password: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    role: number
    login: number
    password: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    role?: true
    login?: true
    password?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    role?: true
    login?: true
    password?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    role?: true
    login?: true
    password?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    role: $Enums.Role
    login: string
    password: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    login?: boolean
    password?: boolean
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    role?: boolean
    login?: boolean
    password?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "login" | "password", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: $Enums.Role
      login: string
      password: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly login: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>



  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
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
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Category$productsArgs<ExtArgs> = {}>(args?: Subset<T, Category$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.products
   */
  export type Category$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    price: number | null
  }

  export type ProductSumAggregateOutputType = {
    price: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    price: number | null
    isSeasonal: boolean | null
    isActive: boolean | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    price: number | null
    isSeasonal: boolean | null
    isActive: boolean | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    description: number
    price: number
    isSeasonal: number
    isActive: number
    categoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    price?: true
  }

  export type ProductSumAggregateInputType = {
    price?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    isSeasonal?: true
    isActive?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    isSeasonal?: true
    isActive?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    isSeasonal?: true
    isActive?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive: boolean | null
    categoryId: string
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    isSeasonal?: boolean
    isActive?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    images?: boolean | Product$imagesArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>



  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    isSeasonal?: boolean
    isActive?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "price" | "isSeasonal" | "isActive" | "categoryId" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | Product$imagesArgs<ExtArgs>
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      images: Prisma.$ProductImagesPayload<ExtArgs>[]
      category: Prisma.$CategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      price: number
      isSeasonal: boolean
      isActive: boolean | null
      categoryId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
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
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    images<T extends Product$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Product$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly price: FieldRef<"Product", 'Float'>
    readonly isSeasonal: FieldRef<"Product", 'Boolean'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly categoryId: FieldRef<"Product", 'String'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.images
   */
  export type Product$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    where?: ProductImagesWhereInput
    orderBy?: ProductImagesOrderByWithRelationInput | ProductImagesOrderByWithRelationInput[]
    cursor?: ProductImagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductImagesScalarFieldEnum | ProductImagesScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductImages
   */

  export type AggregateProductImages = {
    _count: ProductImagesCountAggregateOutputType | null
    _min: ProductImagesMinAggregateOutputType | null
    _max: ProductImagesMaxAggregateOutputType | null
  }

  export type ProductImagesMinAggregateOutputType = {
    id: string | null
    imgUrl: string | null
    productId: string | null
  }

  export type ProductImagesMaxAggregateOutputType = {
    id: string | null
    imgUrl: string | null
    productId: string | null
  }

  export type ProductImagesCountAggregateOutputType = {
    id: number
    imgUrl: number
    productId: number
    _all: number
  }


  export type ProductImagesMinAggregateInputType = {
    id?: true
    imgUrl?: true
    productId?: true
  }

  export type ProductImagesMaxAggregateInputType = {
    id?: true
    imgUrl?: true
    productId?: true
  }

  export type ProductImagesCountAggregateInputType = {
    id?: true
    imgUrl?: true
    productId?: true
    _all?: true
  }

  export type ProductImagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductImages to aggregate.
     */
    where?: ProductImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImagesOrderByWithRelationInput | ProductImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductImages
    **/
    _count?: true | ProductImagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductImagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductImagesMaxAggregateInputType
  }

  export type GetProductImagesAggregateType<T extends ProductImagesAggregateArgs> = {
        [P in keyof T & keyof AggregateProductImages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductImages[P]>
      : GetScalarType<T[P], AggregateProductImages[P]>
  }




  export type ProductImagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductImagesWhereInput
    orderBy?: ProductImagesOrderByWithAggregationInput | ProductImagesOrderByWithAggregationInput[]
    by: ProductImagesScalarFieldEnum[] | ProductImagesScalarFieldEnum
    having?: ProductImagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductImagesCountAggregateInputType | true
    _min?: ProductImagesMinAggregateInputType
    _max?: ProductImagesMaxAggregateInputType
  }

  export type ProductImagesGroupByOutputType = {
    id: string
    imgUrl: string
    productId: string
    _count: ProductImagesCountAggregateOutputType | null
    _min: ProductImagesMinAggregateOutputType | null
    _max: ProductImagesMaxAggregateOutputType | null
  }

  type GetProductImagesGroupByPayload<T extends ProductImagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductImagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductImagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductImagesGroupByOutputType[P]>
            : GetScalarType<T[P], ProductImagesGroupByOutputType[P]>
        }
      >
    >


  export type ProductImagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imgUrl?: boolean
    productId?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImages"]>



  export type ProductImagesSelectScalar = {
    id?: boolean
    imgUrl?: boolean
    productId?: boolean
  }

  export type ProductImagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imgUrl" | "productId", ExtArgs["result"]["productImages"]>
  export type ProductImagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductImagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductImages"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imgUrl: string
      productId: string
    }, ExtArgs["result"]["productImages"]>
    composites: {}
  }

  type ProductImagesGetPayload<S extends boolean | null | undefined | ProductImagesDefaultArgs> = $Result.GetResult<Prisma.$ProductImagesPayload, S>

  type ProductImagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductImagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductImagesCountAggregateInputType | true
    }

  export interface ProductImagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductImages'], meta: { name: 'ProductImages' } }
    /**
     * Find zero or one ProductImages that matches the filter.
     * @param {ProductImagesFindUniqueArgs} args - Arguments to find a ProductImages
     * @example
     * // Get one ProductImages
     * const productImages = await prisma.productImages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductImagesFindUniqueArgs>(args: SelectSubset<T, ProductImagesFindUniqueArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductImages that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductImagesFindUniqueOrThrowArgs} args - Arguments to find a ProductImages
     * @example
     * // Get one ProductImages
     * const productImages = await prisma.productImages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductImagesFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductImagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesFindFirstArgs} args - Arguments to find a ProductImages
     * @example
     * // Get one ProductImages
     * const productImages = await prisma.productImages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductImagesFindFirstArgs>(args?: SelectSubset<T, ProductImagesFindFirstArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductImages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesFindFirstOrThrowArgs} args - Arguments to find a ProductImages
     * @example
     * // Get one ProductImages
     * const productImages = await prisma.productImages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductImagesFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductImagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductImages
     * const productImages = await prisma.productImages.findMany()
     * 
     * // Get first 10 ProductImages
     * const productImages = await prisma.productImages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productImagesWithIdOnly = await prisma.productImages.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductImagesFindManyArgs>(args?: SelectSubset<T, ProductImagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductImages.
     * @param {ProductImagesCreateArgs} args - Arguments to create a ProductImages.
     * @example
     * // Create one ProductImages
     * const ProductImages = await prisma.productImages.create({
     *   data: {
     *     // ... data to create a ProductImages
     *   }
     * })
     * 
     */
    create<T extends ProductImagesCreateArgs>(args: SelectSubset<T, ProductImagesCreateArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductImages.
     * @param {ProductImagesCreateManyArgs} args - Arguments to create many ProductImages.
     * @example
     * // Create many ProductImages
     * const productImages = await prisma.productImages.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductImagesCreateManyArgs>(args?: SelectSubset<T, ProductImagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProductImages.
     * @param {ProductImagesDeleteArgs} args - Arguments to delete one ProductImages.
     * @example
     * // Delete one ProductImages
     * const ProductImages = await prisma.productImages.delete({
     *   where: {
     *     // ... filter to delete one ProductImages
     *   }
     * })
     * 
     */
    delete<T extends ProductImagesDeleteArgs>(args: SelectSubset<T, ProductImagesDeleteArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductImages.
     * @param {ProductImagesUpdateArgs} args - Arguments to update one ProductImages.
     * @example
     * // Update one ProductImages
     * const productImages = await prisma.productImages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductImagesUpdateArgs>(args: SelectSubset<T, ProductImagesUpdateArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductImages.
     * @param {ProductImagesDeleteManyArgs} args - Arguments to filter ProductImages to delete.
     * @example
     * // Delete a few ProductImages
     * const { count } = await prisma.productImages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductImagesDeleteManyArgs>(args?: SelectSubset<T, ProductImagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductImages
     * const productImages = await prisma.productImages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductImagesUpdateManyArgs>(args: SelectSubset<T, ProductImagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProductImages.
     * @param {ProductImagesUpsertArgs} args - Arguments to update or create a ProductImages.
     * @example
     * // Update or create a ProductImages
     * const productImages = await prisma.productImages.upsert({
     *   create: {
     *     // ... data to create a ProductImages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductImages we want to update
     *   }
     * })
     */
    upsert<T extends ProductImagesUpsertArgs>(args: SelectSubset<T, ProductImagesUpsertArgs<ExtArgs>>): Prisma__ProductImagesClient<$Result.GetResult<Prisma.$ProductImagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesCountArgs} args - Arguments to filter ProductImages to count.
     * @example
     * // Count the number of ProductImages
     * const count = await prisma.productImages.count({
     *   where: {
     *     // ... the filter for the ProductImages we want to count
     *   }
     * })
    **/
    count<T extends ProductImagesCountArgs>(
      args?: Subset<T, ProductImagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductImagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductImagesAggregateArgs>(args: Subset<T, ProductImagesAggregateArgs>): Prisma.PrismaPromise<GetProductImagesAggregateType<T>>

    /**
     * Group by ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImagesGroupByArgs} args - Group by arguments.
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
      T extends ProductImagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductImagesGroupByArgs['orderBy'] }
        : { orderBy?: ProductImagesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductImagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductImagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductImages model
   */
  readonly fields: ProductImagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductImages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductImagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProductImages model
   */
  interface ProductImagesFieldRefs {
    readonly id: FieldRef<"ProductImages", 'String'>
    readonly imgUrl: FieldRef<"ProductImages", 'String'>
    readonly productId: FieldRef<"ProductImages", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProductImages findUnique
   */
  export type ProductImagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where: ProductImagesWhereUniqueInput
  }

  /**
   * ProductImages findUniqueOrThrow
   */
  export type ProductImagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where: ProductImagesWhereUniqueInput
  }

  /**
   * ProductImages findFirst
   */
  export type ProductImagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where?: ProductImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImagesOrderByWithRelationInput | ProductImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductImages.
     */
    cursor?: ProductImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImagesScalarFieldEnum | ProductImagesScalarFieldEnum[]
  }

  /**
   * ProductImages findFirstOrThrow
   */
  export type ProductImagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where?: ProductImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImagesOrderByWithRelationInput | ProductImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductImages.
     */
    cursor?: ProductImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImagesScalarFieldEnum | ProductImagesScalarFieldEnum[]
  }

  /**
   * ProductImages findMany
   */
  export type ProductImagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where?: ProductImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImagesOrderByWithRelationInput | ProductImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductImages.
     */
    cursor?: ProductImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    distinct?: ProductImagesScalarFieldEnum | ProductImagesScalarFieldEnum[]
  }

  /**
   * ProductImages create
   */
  export type ProductImagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductImages.
     */
    data: XOR<ProductImagesCreateInput, ProductImagesUncheckedCreateInput>
  }

  /**
   * ProductImages createMany
   */
  export type ProductImagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductImages.
     */
    data: ProductImagesCreateManyInput | ProductImagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductImages update
   */
  export type ProductImagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductImages.
     */
    data: XOR<ProductImagesUpdateInput, ProductImagesUncheckedUpdateInput>
    /**
     * Choose, which ProductImages to update.
     */
    where: ProductImagesWhereUniqueInput
  }

  /**
   * ProductImages updateMany
   */
  export type ProductImagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductImages.
     */
    data: XOR<ProductImagesUpdateManyMutationInput, ProductImagesUncheckedUpdateManyInput>
    /**
     * Filter which ProductImages to update
     */
    where?: ProductImagesWhereInput
    /**
     * Limit how many ProductImages to update.
     */
    limit?: number
  }

  /**
   * ProductImages upsert
   */
  export type ProductImagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductImages to update in case it exists.
     */
    where: ProductImagesWhereUniqueInput
    /**
     * In case the ProductImages found by the `where` argument doesn't exist, create a new ProductImages with this data.
     */
    create: XOR<ProductImagesCreateInput, ProductImagesUncheckedCreateInput>
    /**
     * In case the ProductImages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductImagesUpdateInput, ProductImagesUncheckedUpdateInput>
  }

  /**
   * ProductImages delete
   */
  export type ProductImagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
    /**
     * Filter which ProductImages to delete.
     */
    where: ProductImagesWhereUniqueInput
  }

  /**
   * ProductImages deleteMany
   */
  export type ProductImagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductImages to delete
     */
    where?: ProductImagesWhereInput
    /**
     * Limit how many ProductImages to delete.
     */
    limit?: number
  }

  /**
   * ProductImages without action
   */
  export type ProductImagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImages
     */
    select?: ProductImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImages
     */
    omit?: ProductImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImagesInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    googleMapsUrl: string | null
    openingHours: string | null
    contactId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    googleMapsUrl: string | null
    openingHours: string | null
    contactId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    name: number
    address: number
    googleMapsUrl: number
    openingHours: number
    contactId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocationMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    googleMapsUrl?: true
    openingHours?: true
    contactId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    googleMapsUrl?: true
    openingHours?: true
    contactId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    googleMapsUrl?: true
    openingHours?: true
    contactId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: string
    name: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    contactId: string
    createdAt: Date
    updatedAt: Date
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    googleMapsUrl?: boolean
    openingHours?: boolean
    contactId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>



  export type LocationSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    googleMapsUrl?: boolean
    openingHours?: boolean
    contactId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "googleMapsUrl" | "openingHours" | "contactId" | "createdAt" | "updatedAt", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactInfoDefaultArgs<ExtArgs>
  }

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      contact: Prisma.$ContactInfoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      address: string
      googleMapsUrl: string
      openingHours: string
      contactId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
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
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactInfoDefaultArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'String'>
    readonly name: FieldRef<"Location", 'String'>
    readonly address: FieldRef<"Location", 'String'>
    readonly googleMapsUrl: FieldRef<"Location", 'String'>
    readonly openingHours: FieldRef<"Location", 'String'>
    readonly contactId: FieldRef<"Location", 'String'>
    readonly createdAt: FieldRef<"Location", 'DateTime'>
    readonly updatedAt: FieldRef<"Location", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model BreadVanLocation
   */

  export type AggregateBreadVanLocation = {
    _count: BreadVanLocationCountAggregateOutputType | null
    _min: BreadVanLocationMinAggregateOutputType | null
    _max: BreadVanLocationMaxAggregateOutputType | null
  }

  export type BreadVanLocationMinAggregateOutputType = {
    id: string | null
    address: string | null
    googleMapsUrl: string | null
    dayOfTheWeek: string | null
    startTime: string | null
    endTime: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BreadVanLocationMaxAggregateOutputType = {
    id: string | null
    address: string | null
    googleMapsUrl: string | null
    dayOfTheWeek: string | null
    startTime: string | null
    endTime: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BreadVanLocationCountAggregateOutputType = {
    id: number
    address: number
    googleMapsUrl: number
    dayOfTheWeek: number
    startTime: number
    endTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BreadVanLocationMinAggregateInputType = {
    id?: true
    address?: true
    googleMapsUrl?: true
    dayOfTheWeek?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BreadVanLocationMaxAggregateInputType = {
    id?: true
    address?: true
    googleMapsUrl?: true
    dayOfTheWeek?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BreadVanLocationCountAggregateInputType = {
    id?: true
    address?: true
    googleMapsUrl?: true
    dayOfTheWeek?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BreadVanLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BreadVanLocation to aggregate.
     */
    where?: BreadVanLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BreadVanLocations to fetch.
     */
    orderBy?: BreadVanLocationOrderByWithRelationInput | BreadVanLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BreadVanLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BreadVanLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BreadVanLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BreadVanLocations
    **/
    _count?: true | BreadVanLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BreadVanLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BreadVanLocationMaxAggregateInputType
  }

  export type GetBreadVanLocationAggregateType<T extends BreadVanLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateBreadVanLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBreadVanLocation[P]>
      : GetScalarType<T[P], AggregateBreadVanLocation[P]>
  }




  export type BreadVanLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BreadVanLocationWhereInput
    orderBy?: BreadVanLocationOrderByWithAggregationInput | BreadVanLocationOrderByWithAggregationInput[]
    by: BreadVanLocationScalarFieldEnum[] | BreadVanLocationScalarFieldEnum
    having?: BreadVanLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BreadVanLocationCountAggregateInputType | true
    _min?: BreadVanLocationMinAggregateInputType
    _max?: BreadVanLocationMaxAggregateInputType
  }

  export type BreadVanLocationGroupByOutputType = {
    id: string
    address: string
    googleMapsUrl: string
    dayOfTheWeek: string
    startTime: string
    endTime: string
    createdAt: Date
    updatedAt: Date
    _count: BreadVanLocationCountAggregateOutputType | null
    _min: BreadVanLocationMinAggregateOutputType | null
    _max: BreadVanLocationMaxAggregateOutputType | null
  }

  type GetBreadVanLocationGroupByPayload<T extends BreadVanLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BreadVanLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BreadVanLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BreadVanLocationGroupByOutputType[P]>
            : GetScalarType<T[P], BreadVanLocationGroupByOutputType[P]>
        }
      >
    >


  export type BreadVanLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    googleMapsUrl?: boolean
    dayOfTheWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["breadVanLocation"]>



  export type BreadVanLocationSelectScalar = {
    id?: boolean
    address?: boolean
    googleMapsUrl?: boolean
    dayOfTheWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BreadVanLocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "address" | "googleMapsUrl" | "dayOfTheWeek" | "startTime" | "endTime" | "createdAt" | "updatedAt", ExtArgs["result"]["breadVanLocation"]>

  export type $BreadVanLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BreadVanLocation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      address: string
      googleMapsUrl: string
      dayOfTheWeek: string
      startTime: string
      endTime: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["breadVanLocation"]>
    composites: {}
  }

  type BreadVanLocationGetPayload<S extends boolean | null | undefined | BreadVanLocationDefaultArgs> = $Result.GetResult<Prisma.$BreadVanLocationPayload, S>

  type BreadVanLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BreadVanLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BreadVanLocationCountAggregateInputType | true
    }

  export interface BreadVanLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BreadVanLocation'], meta: { name: 'BreadVanLocation' } }
    /**
     * Find zero or one BreadVanLocation that matches the filter.
     * @param {BreadVanLocationFindUniqueArgs} args - Arguments to find a BreadVanLocation
     * @example
     * // Get one BreadVanLocation
     * const breadVanLocation = await prisma.breadVanLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BreadVanLocationFindUniqueArgs>(args: SelectSubset<T, BreadVanLocationFindUniqueArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BreadVanLocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BreadVanLocationFindUniqueOrThrowArgs} args - Arguments to find a BreadVanLocation
     * @example
     * // Get one BreadVanLocation
     * const breadVanLocation = await prisma.breadVanLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BreadVanLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, BreadVanLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BreadVanLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationFindFirstArgs} args - Arguments to find a BreadVanLocation
     * @example
     * // Get one BreadVanLocation
     * const breadVanLocation = await prisma.breadVanLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BreadVanLocationFindFirstArgs>(args?: SelectSubset<T, BreadVanLocationFindFirstArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BreadVanLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationFindFirstOrThrowArgs} args - Arguments to find a BreadVanLocation
     * @example
     * // Get one BreadVanLocation
     * const breadVanLocation = await prisma.breadVanLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BreadVanLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, BreadVanLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BreadVanLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BreadVanLocations
     * const breadVanLocations = await prisma.breadVanLocation.findMany()
     * 
     * // Get first 10 BreadVanLocations
     * const breadVanLocations = await prisma.breadVanLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const breadVanLocationWithIdOnly = await prisma.breadVanLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BreadVanLocationFindManyArgs>(args?: SelectSubset<T, BreadVanLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BreadVanLocation.
     * @param {BreadVanLocationCreateArgs} args - Arguments to create a BreadVanLocation.
     * @example
     * // Create one BreadVanLocation
     * const BreadVanLocation = await prisma.breadVanLocation.create({
     *   data: {
     *     // ... data to create a BreadVanLocation
     *   }
     * })
     * 
     */
    create<T extends BreadVanLocationCreateArgs>(args: SelectSubset<T, BreadVanLocationCreateArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BreadVanLocations.
     * @param {BreadVanLocationCreateManyArgs} args - Arguments to create many BreadVanLocations.
     * @example
     * // Create many BreadVanLocations
     * const breadVanLocation = await prisma.breadVanLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BreadVanLocationCreateManyArgs>(args?: SelectSubset<T, BreadVanLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BreadVanLocation.
     * @param {BreadVanLocationDeleteArgs} args - Arguments to delete one BreadVanLocation.
     * @example
     * // Delete one BreadVanLocation
     * const BreadVanLocation = await prisma.breadVanLocation.delete({
     *   where: {
     *     // ... filter to delete one BreadVanLocation
     *   }
     * })
     * 
     */
    delete<T extends BreadVanLocationDeleteArgs>(args: SelectSubset<T, BreadVanLocationDeleteArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BreadVanLocation.
     * @param {BreadVanLocationUpdateArgs} args - Arguments to update one BreadVanLocation.
     * @example
     * // Update one BreadVanLocation
     * const breadVanLocation = await prisma.breadVanLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BreadVanLocationUpdateArgs>(args: SelectSubset<T, BreadVanLocationUpdateArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BreadVanLocations.
     * @param {BreadVanLocationDeleteManyArgs} args - Arguments to filter BreadVanLocations to delete.
     * @example
     * // Delete a few BreadVanLocations
     * const { count } = await prisma.breadVanLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BreadVanLocationDeleteManyArgs>(args?: SelectSubset<T, BreadVanLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BreadVanLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BreadVanLocations
     * const breadVanLocation = await prisma.breadVanLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BreadVanLocationUpdateManyArgs>(args: SelectSubset<T, BreadVanLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BreadVanLocation.
     * @param {BreadVanLocationUpsertArgs} args - Arguments to update or create a BreadVanLocation.
     * @example
     * // Update or create a BreadVanLocation
     * const breadVanLocation = await prisma.breadVanLocation.upsert({
     *   create: {
     *     // ... data to create a BreadVanLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BreadVanLocation we want to update
     *   }
     * })
     */
    upsert<T extends BreadVanLocationUpsertArgs>(args: SelectSubset<T, BreadVanLocationUpsertArgs<ExtArgs>>): Prisma__BreadVanLocationClient<$Result.GetResult<Prisma.$BreadVanLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BreadVanLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationCountArgs} args - Arguments to filter BreadVanLocations to count.
     * @example
     * // Count the number of BreadVanLocations
     * const count = await prisma.breadVanLocation.count({
     *   where: {
     *     // ... the filter for the BreadVanLocations we want to count
     *   }
     * })
    **/
    count<T extends BreadVanLocationCountArgs>(
      args?: Subset<T, BreadVanLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BreadVanLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BreadVanLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BreadVanLocationAggregateArgs>(args: Subset<T, BreadVanLocationAggregateArgs>): Prisma.PrismaPromise<GetBreadVanLocationAggregateType<T>>

    /**
     * Group by BreadVanLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BreadVanLocationGroupByArgs} args - Group by arguments.
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
      T extends BreadVanLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BreadVanLocationGroupByArgs['orderBy'] }
        : { orderBy?: BreadVanLocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BreadVanLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBreadVanLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BreadVanLocation model
   */
  readonly fields: BreadVanLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BreadVanLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BreadVanLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the BreadVanLocation model
   */
  interface BreadVanLocationFieldRefs {
    readonly id: FieldRef<"BreadVanLocation", 'String'>
    readonly address: FieldRef<"BreadVanLocation", 'String'>
    readonly googleMapsUrl: FieldRef<"BreadVanLocation", 'String'>
    readonly dayOfTheWeek: FieldRef<"BreadVanLocation", 'String'>
    readonly startTime: FieldRef<"BreadVanLocation", 'String'>
    readonly endTime: FieldRef<"BreadVanLocation", 'String'>
    readonly createdAt: FieldRef<"BreadVanLocation", 'DateTime'>
    readonly updatedAt: FieldRef<"BreadVanLocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BreadVanLocation findUnique
   */
  export type BreadVanLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * Filter, which BreadVanLocation to fetch.
     */
    where: BreadVanLocationWhereUniqueInput
  }

  /**
   * BreadVanLocation findUniqueOrThrow
   */
  export type BreadVanLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * Filter, which BreadVanLocation to fetch.
     */
    where: BreadVanLocationWhereUniqueInput
  }

  /**
   * BreadVanLocation findFirst
   */
  export type BreadVanLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * Filter, which BreadVanLocation to fetch.
     */
    where?: BreadVanLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BreadVanLocations to fetch.
     */
    orderBy?: BreadVanLocationOrderByWithRelationInput | BreadVanLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BreadVanLocations.
     */
    cursor?: BreadVanLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BreadVanLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BreadVanLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BreadVanLocations.
     */
    distinct?: BreadVanLocationScalarFieldEnum | BreadVanLocationScalarFieldEnum[]
  }

  /**
   * BreadVanLocation findFirstOrThrow
   */
  export type BreadVanLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * Filter, which BreadVanLocation to fetch.
     */
    where?: BreadVanLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BreadVanLocations to fetch.
     */
    orderBy?: BreadVanLocationOrderByWithRelationInput | BreadVanLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BreadVanLocations.
     */
    cursor?: BreadVanLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BreadVanLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BreadVanLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BreadVanLocations.
     */
    distinct?: BreadVanLocationScalarFieldEnum | BreadVanLocationScalarFieldEnum[]
  }

  /**
   * BreadVanLocation findMany
   */
  export type BreadVanLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * Filter, which BreadVanLocations to fetch.
     */
    where?: BreadVanLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BreadVanLocations to fetch.
     */
    orderBy?: BreadVanLocationOrderByWithRelationInput | BreadVanLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BreadVanLocations.
     */
    cursor?: BreadVanLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BreadVanLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BreadVanLocations.
     */
    skip?: number
    distinct?: BreadVanLocationScalarFieldEnum | BreadVanLocationScalarFieldEnum[]
  }

  /**
   * BreadVanLocation create
   */
  export type BreadVanLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * The data needed to create a BreadVanLocation.
     */
    data: XOR<BreadVanLocationCreateInput, BreadVanLocationUncheckedCreateInput>
  }

  /**
   * BreadVanLocation createMany
   */
  export type BreadVanLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BreadVanLocations.
     */
    data: BreadVanLocationCreateManyInput | BreadVanLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BreadVanLocation update
   */
  export type BreadVanLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * The data needed to update a BreadVanLocation.
     */
    data: XOR<BreadVanLocationUpdateInput, BreadVanLocationUncheckedUpdateInput>
    /**
     * Choose, which BreadVanLocation to update.
     */
    where: BreadVanLocationWhereUniqueInput
  }

  /**
   * BreadVanLocation updateMany
   */
  export type BreadVanLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BreadVanLocations.
     */
    data: XOR<BreadVanLocationUpdateManyMutationInput, BreadVanLocationUncheckedUpdateManyInput>
    /**
     * Filter which BreadVanLocations to update
     */
    where?: BreadVanLocationWhereInput
    /**
     * Limit how many BreadVanLocations to update.
     */
    limit?: number
  }

  /**
   * BreadVanLocation upsert
   */
  export type BreadVanLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * The filter to search for the BreadVanLocation to update in case it exists.
     */
    where: BreadVanLocationWhereUniqueInput
    /**
     * In case the BreadVanLocation found by the `where` argument doesn't exist, create a new BreadVanLocation with this data.
     */
    create: XOR<BreadVanLocationCreateInput, BreadVanLocationUncheckedCreateInput>
    /**
     * In case the BreadVanLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BreadVanLocationUpdateInput, BreadVanLocationUncheckedUpdateInput>
  }

  /**
   * BreadVanLocation delete
   */
  export type BreadVanLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
    /**
     * Filter which BreadVanLocation to delete.
     */
    where: BreadVanLocationWhereUniqueInput
  }

  /**
   * BreadVanLocation deleteMany
   */
  export type BreadVanLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BreadVanLocations to delete
     */
    where?: BreadVanLocationWhereInput
    /**
     * Limit how many BreadVanLocations to delete.
     */
    limit?: number
  }

  /**
   * BreadVanLocation without action
   */
  export type BreadVanLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BreadVanLocation
     */
    select?: BreadVanLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BreadVanLocation
     */
    omit?: BreadVanLocationOmit<ExtArgs> | null
  }


  /**
   * Model ContactInfo
   */

  export type AggregateContactInfo = {
    _count: ContactInfoCountAggregateOutputType | null
    _min: ContactInfoMinAggregateOutputType | null
    _max: ContactInfoMaxAggregateOutputType | null
  }

  export type ContactInfoMinAggregateOutputType = {
    id: string | null
    phone: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContactInfoMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContactInfoCountAggregateOutputType = {
    id: number
    phone: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContactInfoMinAggregateInputType = {
    id?: true
    phone?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContactInfoMaxAggregateInputType = {
    id?: true
    phone?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContactInfoCountAggregateInputType = {
    id?: true
    phone?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContactInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactInfo to aggregate.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactInfos
    **/
    _count?: true | ContactInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactInfoMaxAggregateInputType
  }

  export type GetContactInfoAggregateType<T extends ContactInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateContactInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactInfo[P]>
      : GetScalarType<T[P], AggregateContactInfo[P]>
  }




  export type ContactInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactInfoWhereInput
    orderBy?: ContactInfoOrderByWithAggregationInput | ContactInfoOrderByWithAggregationInput[]
    by: ContactInfoScalarFieldEnum[] | ContactInfoScalarFieldEnum
    having?: ContactInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactInfoCountAggregateInputType | true
    _min?: ContactInfoMinAggregateInputType
    _max?: ContactInfoMaxAggregateInputType
  }

  export type ContactInfoGroupByOutputType = {
    id: string
    phone: string
    email: string
    createdAt: Date
    updatedAt: Date
    _count: ContactInfoCountAggregateOutputType | null
    _min: ContactInfoMinAggregateOutputType | null
    _max: ContactInfoMaxAggregateOutputType | null
  }

  type GetContactInfoGroupByPayload<T extends ContactInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactInfoGroupByOutputType[P]>
            : GetScalarType<T[P], ContactInfoGroupByOutputType[P]>
        }
      >
    >


  export type ContactInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    media?: boolean | ContactInfo$mediaArgs<ExtArgs>
    locations?: boolean | ContactInfo$locationsArgs<ExtArgs>
    _count?: boolean | ContactInfoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contactInfo"]>



  export type ContactInfoSelectScalar = {
    id?: boolean
    phone?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContactInfoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["contactInfo"]>
  export type ContactInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    media?: boolean | ContactInfo$mediaArgs<ExtArgs>
    locations?: boolean | ContactInfo$locationsArgs<ExtArgs>
    _count?: boolean | ContactInfoCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ContactInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactInfo"
    objects: {
      media: Prisma.$MediaPayload<ExtArgs>[]
      locations: Prisma.$LocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      email: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["contactInfo"]>
    composites: {}
  }

  type ContactInfoGetPayload<S extends boolean | null | undefined | ContactInfoDefaultArgs> = $Result.GetResult<Prisma.$ContactInfoPayload, S>

  type ContactInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactInfoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactInfoCountAggregateInputType | true
    }

  export interface ContactInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactInfo'], meta: { name: 'ContactInfo' } }
    /**
     * Find zero or one ContactInfo that matches the filter.
     * @param {ContactInfoFindUniqueArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactInfoFindUniqueArgs>(args: SelectSubset<T, ContactInfoFindUniqueArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContactInfo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactInfoFindUniqueOrThrowArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoFindFirstArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactInfoFindFirstArgs>(args?: SelectSubset<T, ContactInfoFindFirstArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoFindFirstOrThrowArgs} args - Arguments to find a ContactInfo
     * @example
     * // Get one ContactInfo
     * const contactInfo = await prisma.contactInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContactInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactInfos
     * const contactInfos = await prisma.contactInfo.findMany()
     * 
     * // Get first 10 ContactInfos
     * const contactInfos = await prisma.contactInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactInfoWithIdOnly = await prisma.contactInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactInfoFindManyArgs>(args?: SelectSubset<T, ContactInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContactInfo.
     * @param {ContactInfoCreateArgs} args - Arguments to create a ContactInfo.
     * @example
     * // Create one ContactInfo
     * const ContactInfo = await prisma.contactInfo.create({
     *   data: {
     *     // ... data to create a ContactInfo
     *   }
     * })
     * 
     */
    create<T extends ContactInfoCreateArgs>(args: SelectSubset<T, ContactInfoCreateArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContactInfos.
     * @param {ContactInfoCreateManyArgs} args - Arguments to create many ContactInfos.
     * @example
     * // Create many ContactInfos
     * const contactInfo = await prisma.contactInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactInfoCreateManyArgs>(args?: SelectSubset<T, ContactInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ContactInfo.
     * @param {ContactInfoDeleteArgs} args - Arguments to delete one ContactInfo.
     * @example
     * // Delete one ContactInfo
     * const ContactInfo = await prisma.contactInfo.delete({
     *   where: {
     *     // ... filter to delete one ContactInfo
     *   }
     * })
     * 
     */
    delete<T extends ContactInfoDeleteArgs>(args: SelectSubset<T, ContactInfoDeleteArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContactInfo.
     * @param {ContactInfoUpdateArgs} args - Arguments to update one ContactInfo.
     * @example
     * // Update one ContactInfo
     * const contactInfo = await prisma.contactInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactInfoUpdateArgs>(args: SelectSubset<T, ContactInfoUpdateArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContactInfos.
     * @param {ContactInfoDeleteManyArgs} args - Arguments to filter ContactInfos to delete.
     * @example
     * // Delete a few ContactInfos
     * const { count } = await prisma.contactInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactInfoDeleteManyArgs>(args?: SelectSubset<T, ContactInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactInfos
     * const contactInfo = await prisma.contactInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactInfoUpdateManyArgs>(args: SelectSubset<T, ContactInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ContactInfo.
     * @param {ContactInfoUpsertArgs} args - Arguments to update or create a ContactInfo.
     * @example
     * // Update or create a ContactInfo
     * const contactInfo = await prisma.contactInfo.upsert({
     *   create: {
     *     // ... data to create a ContactInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactInfo we want to update
     *   }
     * })
     */
    upsert<T extends ContactInfoUpsertArgs>(args: SelectSubset<T, ContactInfoUpsertArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContactInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoCountArgs} args - Arguments to filter ContactInfos to count.
     * @example
     * // Count the number of ContactInfos
     * const count = await prisma.contactInfo.count({
     *   where: {
     *     // ... the filter for the ContactInfos we want to count
     *   }
     * })
    **/
    count<T extends ContactInfoCountArgs>(
      args?: Subset<T, ContactInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContactInfoAggregateArgs>(args: Subset<T, ContactInfoAggregateArgs>): Prisma.PrismaPromise<GetContactInfoAggregateType<T>>

    /**
     * Group by ContactInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactInfoGroupByArgs} args - Group by arguments.
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
      T extends ContactInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactInfoGroupByArgs['orderBy'] }
        : { orderBy?: ContactInfoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContactInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactInfo model
   */
  readonly fields: ContactInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    media<T extends ContactInfo$mediaArgs<ExtArgs> = {}>(args?: Subset<T, ContactInfo$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locations<T extends ContactInfo$locationsArgs<ExtArgs> = {}>(args?: Subset<T, ContactInfo$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ContactInfo model
   */
  interface ContactInfoFieldRefs {
    readonly id: FieldRef<"ContactInfo", 'String'>
    readonly phone: FieldRef<"ContactInfo", 'String'>
    readonly email: FieldRef<"ContactInfo", 'String'>
    readonly createdAt: FieldRef<"ContactInfo", 'DateTime'>
    readonly updatedAt: FieldRef<"ContactInfo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContactInfo findUnique
   */
  export type ContactInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo findUniqueOrThrow
   */
  export type ContactInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo findFirst
   */
  export type ContactInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactInfos.
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactInfos.
     */
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * ContactInfo findFirstOrThrow
   */
  export type ContactInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfo to fetch.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactInfos.
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactInfos.
     */
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * ContactInfo findMany
   */
  export type ContactInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter, which ContactInfos to fetch.
     */
    where?: ContactInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactInfos to fetch.
     */
    orderBy?: ContactInfoOrderByWithRelationInput | ContactInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactInfos.
     */
    cursor?: ContactInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactInfos.
     */
    skip?: number
    distinct?: ContactInfoScalarFieldEnum | ContactInfoScalarFieldEnum[]
  }

  /**
   * ContactInfo create
   */
  export type ContactInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a ContactInfo.
     */
    data: XOR<ContactInfoCreateInput, ContactInfoUncheckedCreateInput>
  }

  /**
   * ContactInfo createMany
   */
  export type ContactInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactInfos.
     */
    data: ContactInfoCreateManyInput | ContactInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactInfo update
   */
  export type ContactInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a ContactInfo.
     */
    data: XOR<ContactInfoUpdateInput, ContactInfoUncheckedUpdateInput>
    /**
     * Choose, which ContactInfo to update.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo updateMany
   */
  export type ContactInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactInfos.
     */
    data: XOR<ContactInfoUpdateManyMutationInput, ContactInfoUncheckedUpdateManyInput>
    /**
     * Filter which ContactInfos to update
     */
    where?: ContactInfoWhereInput
    /**
     * Limit how many ContactInfos to update.
     */
    limit?: number
  }

  /**
   * ContactInfo upsert
   */
  export type ContactInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the ContactInfo to update in case it exists.
     */
    where: ContactInfoWhereUniqueInput
    /**
     * In case the ContactInfo found by the `where` argument doesn't exist, create a new ContactInfo with this data.
     */
    create: XOR<ContactInfoCreateInput, ContactInfoUncheckedCreateInput>
    /**
     * In case the ContactInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactInfoUpdateInput, ContactInfoUncheckedUpdateInput>
  }

  /**
   * ContactInfo delete
   */
  export type ContactInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
    /**
     * Filter which ContactInfo to delete.
     */
    where: ContactInfoWhereUniqueInput
  }

  /**
   * ContactInfo deleteMany
   */
  export type ContactInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactInfos to delete
     */
    where?: ContactInfoWhereInput
    /**
     * Limit how many ContactInfos to delete.
     */
    limit?: number
  }

  /**
   * ContactInfo.media
   */
  export type ContactInfo$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    cursor?: MediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * ContactInfo.locations
   */
  export type ContactInfo$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    cursor?: LocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * ContactInfo without action
   */
  export type ContactInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactInfo
     */
    select?: ContactInfoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactInfo
     */
    omit?: ContactInfoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContactInfoInclude<ExtArgs> | null
  }


  /**
   * Model Media
   */

  export type AggregateMedia = {
    _count: MediaCountAggregateOutputType | null
    _min: MediaMinAggregateOutputType | null
    _max: MediaMaxAggregateOutputType | null
  }

  export type MediaMinAggregateOutputType = {
    id: string | null
    url: string | null
    name: string | null
    contactId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaMaxAggregateOutputType = {
    id: string | null
    url: string | null
    name: string | null
    contactId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaCountAggregateOutputType = {
    id: number
    url: number
    name: number
    contactId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MediaMinAggregateInputType = {
    id?: true
    url?: true
    name?: true
    contactId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaMaxAggregateInputType = {
    id?: true
    url?: true
    name?: true
    contactId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaCountAggregateInputType = {
    id?: true
    url?: true
    name?: true
    contactId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MediaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Media to aggregate.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Media
    **/
    _count?: true | MediaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaMaxAggregateInputType
  }

  export type GetMediaAggregateType<T extends MediaAggregateArgs> = {
        [P in keyof T & keyof AggregateMedia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedia[P]>
      : GetScalarType<T[P], AggregateMedia[P]>
  }




  export type MediaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithAggregationInput | MediaOrderByWithAggregationInput[]
    by: MediaScalarFieldEnum[] | MediaScalarFieldEnum
    having?: MediaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaCountAggregateInputType | true
    _min?: MediaMinAggregateInputType
    _max?: MediaMaxAggregateInputType
  }

  export type MediaGroupByOutputType = {
    id: string
    url: string
    name: string
    contactId: string
    createdAt: Date
    updatedAt: Date
    _count: MediaCountAggregateOutputType | null
    _min: MediaMinAggregateOutputType | null
    _max: MediaMaxAggregateOutputType | null
  }

  type GetMediaGroupByPayload<T extends MediaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaGroupByOutputType[P]>
            : GetScalarType<T[P], MediaGroupByOutputType[P]>
        }
      >
    >


  export type MediaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    name?: boolean
    contactId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    contact?: boolean | ContactInfoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>



  export type MediaSelectScalar = {
    id?: boolean
    url?: boolean
    name?: boolean
    contactId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MediaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "name" | "contactId" | "createdAt" | "updatedAt", ExtArgs["result"]["media"]>
  export type MediaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    contact?: boolean | ContactInfoDefaultArgs<ExtArgs>
  }

  export type $MediaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Media"
    objects: {
      contact: Prisma.$ContactInfoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      name: string
      contactId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["media"]>
    composites: {}
  }

  type MediaGetPayload<S extends boolean | null | undefined | MediaDefaultArgs> = $Result.GetResult<Prisma.$MediaPayload, S>

  type MediaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaCountAggregateInputType | true
    }

  export interface MediaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Media'], meta: { name: 'Media' } }
    /**
     * Find zero or one Media that matches the filter.
     * @param {MediaFindUniqueArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaFindUniqueArgs>(args: SelectSubset<T, MediaFindUniqueArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Media that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaFindUniqueOrThrowArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindFirstArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaFindFirstArgs>(args?: SelectSubset<T, MediaFindFirstArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindFirstOrThrowArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Media that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Media
     * const media = await prisma.media.findMany()
     * 
     * // Get first 10 Media
     * const media = await prisma.media.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaWithIdOnly = await prisma.media.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaFindManyArgs>(args?: SelectSubset<T, MediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Media.
     * @param {MediaCreateArgs} args - Arguments to create a Media.
     * @example
     * // Create one Media
     * const Media = await prisma.media.create({
     *   data: {
     *     // ... data to create a Media
     *   }
     * })
     * 
     */
    create<T extends MediaCreateArgs>(args: SelectSubset<T, MediaCreateArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Media.
     * @param {MediaCreateManyArgs} args - Arguments to create many Media.
     * @example
     * // Create many Media
     * const media = await prisma.media.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaCreateManyArgs>(args?: SelectSubset<T, MediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Media.
     * @param {MediaDeleteArgs} args - Arguments to delete one Media.
     * @example
     * // Delete one Media
     * const Media = await prisma.media.delete({
     *   where: {
     *     // ... filter to delete one Media
     *   }
     * })
     * 
     */
    delete<T extends MediaDeleteArgs>(args: SelectSubset<T, MediaDeleteArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Media.
     * @param {MediaUpdateArgs} args - Arguments to update one Media.
     * @example
     * // Update one Media
     * const media = await prisma.media.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaUpdateArgs>(args: SelectSubset<T, MediaUpdateArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Media.
     * @param {MediaDeleteManyArgs} args - Arguments to filter Media to delete.
     * @example
     * // Delete a few Media
     * const { count } = await prisma.media.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaDeleteManyArgs>(args?: SelectSubset<T, MediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Media
     * const media = await prisma.media.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaUpdateManyArgs>(args: SelectSubset<T, MediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Media.
     * @param {MediaUpsertArgs} args - Arguments to update or create a Media.
     * @example
     * // Update or create a Media
     * const media = await prisma.media.upsert({
     *   create: {
     *     // ... data to create a Media
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Media we want to update
     *   }
     * })
     */
    upsert<T extends MediaUpsertArgs>(args: SelectSubset<T, MediaUpsertArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaCountArgs} args - Arguments to filter Media to count.
     * @example
     * // Count the number of Media
     * const count = await prisma.media.count({
     *   where: {
     *     // ... the filter for the Media we want to count
     *   }
     * })
    **/
    count<T extends MediaCountArgs>(
      args?: Subset<T, MediaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MediaAggregateArgs>(args: Subset<T, MediaAggregateArgs>): Prisma.PrismaPromise<GetMediaAggregateType<T>>

    /**
     * Group by Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaGroupByArgs} args - Group by arguments.
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
      T extends MediaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaGroupByArgs['orderBy'] }
        : { orderBy?: MediaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Media model
   */
  readonly fields: MediaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Media.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    contact<T extends ContactInfoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContactInfoDefaultArgs<ExtArgs>>): Prisma__ContactInfoClient<$Result.GetResult<Prisma.$ContactInfoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Media model
   */
  interface MediaFieldRefs {
    readonly id: FieldRef<"Media", 'String'>
    readonly url: FieldRef<"Media", 'String'>
    readonly name: FieldRef<"Media", 'String'>
    readonly contactId: FieldRef<"Media", 'String'>
    readonly createdAt: FieldRef<"Media", 'DateTime'>
    readonly updatedAt: FieldRef<"Media", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Media findUnique
   */
  export type MediaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media findUniqueOrThrow
   */
  export type MediaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media findFirst
   */
  export type MediaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Media.
     */
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media findFirstOrThrow
   */
  export type MediaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Media.
     */
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media findMany
   */
  export type MediaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media create
   */
  export type MediaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The data needed to create a Media.
     */
    data: XOR<MediaCreateInput, MediaUncheckedCreateInput>
  }

  /**
   * Media createMany
   */
  export type MediaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Media.
     */
    data: MediaCreateManyInput | MediaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Media update
   */
  export type MediaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The data needed to update a Media.
     */
    data: XOR<MediaUpdateInput, MediaUncheckedUpdateInput>
    /**
     * Choose, which Media to update.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media updateMany
   */
  export type MediaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Media.
     */
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyInput>
    /**
     * Filter which Media to update
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to update.
     */
    limit?: number
  }

  /**
   * Media upsert
   */
  export type MediaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The filter to search for the Media to update in case it exists.
     */
    where: MediaWhereUniqueInput
    /**
     * In case the Media found by the `where` argument doesn't exist, create a new Media with this data.
     */
    create: XOR<MediaCreateInput, MediaUncheckedCreateInput>
    /**
     * In case the Media was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaUpdateInput, MediaUncheckedUpdateInput>
  }

  /**
   * Media delete
   */
  export type MediaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter which Media to delete.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media deleteMany
   */
  export type MediaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Media to delete
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to delete.
     */
    limit?: number
  }

  /**
   * Media without action
   */
  export type MediaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
  }


  /**
   * Model ArticleImages
   */

  export type AggregateArticleImages = {
    _count: ArticleImagesCountAggregateOutputType | null
    _min: ArticleImagesMinAggregateOutputType | null
    _max: ArticleImagesMaxAggregateOutputType | null
  }

  export type ArticleImagesMinAggregateOutputType = {
    id: string | null
    imgUrl: string | null
    articleId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleImagesMaxAggregateOutputType = {
    id: string | null
    imgUrl: string | null
    articleId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleImagesCountAggregateOutputType = {
    id: number
    imgUrl: number
    articleId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ArticleImagesMinAggregateInputType = {
    id?: true
    imgUrl?: true
    articleId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleImagesMaxAggregateInputType = {
    id?: true
    imgUrl?: true
    articleId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleImagesCountAggregateInputType = {
    id?: true
    imgUrl?: true
    articleId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ArticleImagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleImages to aggregate.
     */
    where?: ArticleImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleImages to fetch.
     */
    orderBy?: ArticleImagesOrderByWithRelationInput | ArticleImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleImages
    **/
    _count?: true | ArticleImagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleImagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleImagesMaxAggregateInputType
  }

  export type GetArticleImagesAggregateType<T extends ArticleImagesAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleImages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleImages[P]>
      : GetScalarType<T[P], AggregateArticleImages[P]>
  }




  export type ArticleImagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleImagesWhereInput
    orderBy?: ArticleImagesOrderByWithAggregationInput | ArticleImagesOrderByWithAggregationInput[]
    by: ArticleImagesScalarFieldEnum[] | ArticleImagesScalarFieldEnum
    having?: ArticleImagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleImagesCountAggregateInputType | true
    _min?: ArticleImagesMinAggregateInputType
    _max?: ArticleImagesMaxAggregateInputType
  }

  export type ArticleImagesGroupByOutputType = {
    id: string
    imgUrl: string
    articleId: string
    createdAt: Date
    updatedAt: Date
    _count: ArticleImagesCountAggregateOutputType | null
    _min: ArticleImagesMinAggregateOutputType | null
    _max: ArticleImagesMaxAggregateOutputType | null
  }

  type GetArticleImagesGroupByPayload<T extends ArticleImagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleImagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleImagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleImagesGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleImagesGroupByOutputType[P]>
        }
      >
    >


  export type ArticleImagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    imgUrl?: boolean
    articleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    article?: boolean | BlogItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleImages"]>



  export type ArticleImagesSelectScalar = {
    id?: boolean
    imgUrl?: boolean
    articleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ArticleImagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "imgUrl" | "articleId" | "createdAt" | "updatedAt", ExtArgs["result"]["articleImages"]>
  export type ArticleImagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | BlogItemDefaultArgs<ExtArgs>
  }

  export type $ArticleImagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleImages"
    objects: {
      article: Prisma.$BlogItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      imgUrl: string
      articleId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["articleImages"]>
    composites: {}
  }

  type ArticleImagesGetPayload<S extends boolean | null | undefined | ArticleImagesDefaultArgs> = $Result.GetResult<Prisma.$ArticleImagesPayload, S>

  type ArticleImagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleImagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleImagesCountAggregateInputType | true
    }

  export interface ArticleImagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleImages'], meta: { name: 'ArticleImages' } }
    /**
     * Find zero or one ArticleImages that matches the filter.
     * @param {ArticleImagesFindUniqueArgs} args - Arguments to find a ArticleImages
     * @example
     * // Get one ArticleImages
     * const articleImages = await prisma.articleImages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleImagesFindUniqueArgs>(args: SelectSubset<T, ArticleImagesFindUniqueArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleImages that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleImagesFindUniqueOrThrowArgs} args - Arguments to find a ArticleImages
     * @example
     * // Get one ArticleImages
     * const articleImages = await prisma.articleImages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleImagesFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleImagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesFindFirstArgs} args - Arguments to find a ArticleImages
     * @example
     * // Get one ArticleImages
     * const articleImages = await prisma.articleImages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleImagesFindFirstArgs>(args?: SelectSubset<T, ArticleImagesFindFirstArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleImages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesFindFirstOrThrowArgs} args - Arguments to find a ArticleImages
     * @example
     * // Get one ArticleImages
     * const articleImages = await prisma.articleImages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleImagesFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleImagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleImages
     * const articleImages = await prisma.articleImages.findMany()
     * 
     * // Get first 10 ArticleImages
     * const articleImages = await prisma.articleImages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleImagesWithIdOnly = await prisma.articleImages.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleImagesFindManyArgs>(args?: SelectSubset<T, ArticleImagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleImages.
     * @param {ArticleImagesCreateArgs} args - Arguments to create a ArticleImages.
     * @example
     * // Create one ArticleImages
     * const ArticleImages = await prisma.articleImages.create({
     *   data: {
     *     // ... data to create a ArticleImages
     *   }
     * })
     * 
     */
    create<T extends ArticleImagesCreateArgs>(args: SelectSubset<T, ArticleImagesCreateArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleImages.
     * @param {ArticleImagesCreateManyArgs} args - Arguments to create many ArticleImages.
     * @example
     * // Create many ArticleImages
     * const articleImages = await prisma.articleImages.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleImagesCreateManyArgs>(args?: SelectSubset<T, ArticleImagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ArticleImages.
     * @param {ArticleImagesDeleteArgs} args - Arguments to delete one ArticleImages.
     * @example
     * // Delete one ArticleImages
     * const ArticleImages = await prisma.articleImages.delete({
     *   where: {
     *     // ... filter to delete one ArticleImages
     *   }
     * })
     * 
     */
    delete<T extends ArticleImagesDeleteArgs>(args: SelectSubset<T, ArticleImagesDeleteArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleImages.
     * @param {ArticleImagesUpdateArgs} args - Arguments to update one ArticleImages.
     * @example
     * // Update one ArticleImages
     * const articleImages = await prisma.articleImages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleImagesUpdateArgs>(args: SelectSubset<T, ArticleImagesUpdateArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleImages.
     * @param {ArticleImagesDeleteManyArgs} args - Arguments to filter ArticleImages to delete.
     * @example
     * // Delete a few ArticleImages
     * const { count } = await prisma.articleImages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleImagesDeleteManyArgs>(args?: SelectSubset<T, ArticleImagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleImages
     * const articleImages = await prisma.articleImages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleImagesUpdateManyArgs>(args: SelectSubset<T, ArticleImagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ArticleImages.
     * @param {ArticleImagesUpsertArgs} args - Arguments to update or create a ArticleImages.
     * @example
     * // Update or create a ArticleImages
     * const articleImages = await prisma.articleImages.upsert({
     *   create: {
     *     // ... data to create a ArticleImages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleImages we want to update
     *   }
     * })
     */
    upsert<T extends ArticleImagesUpsertArgs>(args: SelectSubset<T, ArticleImagesUpsertArgs<ExtArgs>>): Prisma__ArticleImagesClient<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesCountArgs} args - Arguments to filter ArticleImages to count.
     * @example
     * // Count the number of ArticleImages
     * const count = await prisma.articleImages.count({
     *   where: {
     *     // ... the filter for the ArticleImages we want to count
     *   }
     * })
    **/
    count<T extends ArticleImagesCountArgs>(
      args?: Subset<T, ArticleImagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleImagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArticleImagesAggregateArgs>(args: Subset<T, ArticleImagesAggregateArgs>): Prisma.PrismaPromise<GetArticleImagesAggregateType<T>>

    /**
     * Group by ArticleImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleImagesGroupByArgs} args - Group by arguments.
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
      T extends ArticleImagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleImagesGroupByArgs['orderBy'] }
        : { orderBy?: ArticleImagesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ArticleImagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleImagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleImages model
   */
  readonly fields: ArticleImagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleImages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleImagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends BlogItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BlogItemDefaultArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ArticleImages model
   */
  interface ArticleImagesFieldRefs {
    readonly id: FieldRef<"ArticleImages", 'String'>
    readonly imgUrl: FieldRef<"ArticleImages", 'String'>
    readonly articleId: FieldRef<"ArticleImages", 'String'>
    readonly createdAt: FieldRef<"ArticleImages", 'DateTime'>
    readonly updatedAt: FieldRef<"ArticleImages", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleImages findUnique
   */
  export type ArticleImagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleImages to fetch.
     */
    where: ArticleImagesWhereUniqueInput
  }

  /**
   * ArticleImages findUniqueOrThrow
   */
  export type ArticleImagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleImages to fetch.
     */
    where: ArticleImagesWhereUniqueInput
  }

  /**
   * ArticleImages findFirst
   */
  export type ArticleImagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleImages to fetch.
     */
    where?: ArticleImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleImages to fetch.
     */
    orderBy?: ArticleImagesOrderByWithRelationInput | ArticleImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleImages.
     */
    cursor?: ArticleImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleImages.
     */
    distinct?: ArticleImagesScalarFieldEnum | ArticleImagesScalarFieldEnum[]
  }

  /**
   * ArticleImages findFirstOrThrow
   */
  export type ArticleImagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleImages to fetch.
     */
    where?: ArticleImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleImages to fetch.
     */
    orderBy?: ArticleImagesOrderByWithRelationInput | ArticleImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleImages.
     */
    cursor?: ArticleImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleImages.
     */
    distinct?: ArticleImagesScalarFieldEnum | ArticleImagesScalarFieldEnum[]
  }

  /**
   * ArticleImages findMany
   */
  export type ArticleImagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleImages to fetch.
     */
    where?: ArticleImagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleImages to fetch.
     */
    orderBy?: ArticleImagesOrderByWithRelationInput | ArticleImagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleImages.
     */
    cursor?: ArticleImagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleImages.
     */
    skip?: number
    distinct?: ArticleImagesScalarFieldEnum | ArticleImagesScalarFieldEnum[]
  }

  /**
   * ArticleImages create
   */
  export type ArticleImagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleImages.
     */
    data: XOR<ArticleImagesCreateInput, ArticleImagesUncheckedCreateInput>
  }

  /**
   * ArticleImages createMany
   */
  export type ArticleImagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleImages.
     */
    data: ArticleImagesCreateManyInput | ArticleImagesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ArticleImages update
   */
  export type ArticleImagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleImages.
     */
    data: XOR<ArticleImagesUpdateInput, ArticleImagesUncheckedUpdateInput>
    /**
     * Choose, which ArticleImages to update.
     */
    where: ArticleImagesWhereUniqueInput
  }

  /**
   * ArticleImages updateMany
   */
  export type ArticleImagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleImages.
     */
    data: XOR<ArticleImagesUpdateManyMutationInput, ArticleImagesUncheckedUpdateManyInput>
    /**
     * Filter which ArticleImages to update
     */
    where?: ArticleImagesWhereInput
    /**
     * Limit how many ArticleImages to update.
     */
    limit?: number
  }

  /**
   * ArticleImages upsert
   */
  export type ArticleImagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleImages to update in case it exists.
     */
    where: ArticleImagesWhereUniqueInput
    /**
     * In case the ArticleImages found by the `where` argument doesn't exist, create a new ArticleImages with this data.
     */
    create: XOR<ArticleImagesCreateInput, ArticleImagesUncheckedCreateInput>
    /**
     * In case the ArticleImages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleImagesUpdateInput, ArticleImagesUncheckedUpdateInput>
  }

  /**
   * ArticleImages delete
   */
  export type ArticleImagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    /**
     * Filter which ArticleImages to delete.
     */
    where: ArticleImagesWhereUniqueInput
  }

  /**
   * ArticleImages deleteMany
   */
  export type ArticleImagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleImages to delete
     */
    where?: ArticleImagesWhereInput
    /**
     * Limit how many ArticleImages to delete.
     */
    limit?: number
  }

  /**
   * ArticleImages without action
   */
  export type ArticleImagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
  }


  /**
   * Model BlogItem
   */

  export type AggregateBlogItem = {
    _count: BlogItemCountAggregateOutputType | null
    _min: BlogItemMinAggregateOutputType | null
    _max: BlogItemMaxAggregateOutputType | null
  }

  export type BlogItemMinAggregateOutputType = {
    id: string | null
    title: string | null
    shortDescription: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BlogItemMaxAggregateOutputType = {
    id: string | null
    title: string | null
    shortDescription: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BlogItemCountAggregateOutputType = {
    id: number
    title: number
    shortDescription: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BlogItemMinAggregateInputType = {
    id?: true
    title?: true
    shortDescription?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BlogItemMaxAggregateInputType = {
    id?: true
    title?: true
    shortDescription?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BlogItemCountAggregateInputType = {
    id?: true
    title?: true
    shortDescription?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BlogItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlogItem to aggregate.
     */
    where?: BlogItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogItems to fetch.
     */
    orderBy?: BlogItemOrderByWithRelationInput | BlogItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BlogItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BlogItems
    **/
    _count?: true | BlogItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BlogItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BlogItemMaxAggregateInputType
  }

  export type GetBlogItemAggregateType<T extends BlogItemAggregateArgs> = {
        [P in keyof T & keyof AggregateBlogItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBlogItem[P]>
      : GetScalarType<T[P], AggregateBlogItem[P]>
  }




  export type BlogItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BlogItemWhereInput
    orderBy?: BlogItemOrderByWithAggregationInput | BlogItemOrderByWithAggregationInput[]
    by: BlogItemScalarFieldEnum[] | BlogItemScalarFieldEnum
    having?: BlogItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BlogItemCountAggregateInputType | true
    _min?: BlogItemMinAggregateInputType
    _max?: BlogItemMaxAggregateInputType
  }

  export type BlogItemGroupByOutputType = {
    id: string
    title: string
    shortDescription: string
    content: string
    createdAt: Date
    updatedAt: Date
    _count: BlogItemCountAggregateOutputType | null
    _min: BlogItemMinAggregateOutputType | null
    _max: BlogItemMaxAggregateOutputType | null
  }

  type GetBlogItemGroupByPayload<T extends BlogItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BlogItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BlogItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BlogItemGroupByOutputType[P]>
            : GetScalarType<T[P], BlogItemGroupByOutputType[P]>
        }
      >
    >


  export type BlogItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    shortDescription?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    images?: boolean | BlogItem$imagesArgs<ExtArgs>
    _count?: boolean | BlogItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["blogItem"]>



  export type BlogItemSelectScalar = {
    id?: boolean
    title?: boolean
    shortDescription?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BlogItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "shortDescription" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["blogItem"]>
  export type BlogItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | BlogItem$imagesArgs<ExtArgs>
    _count?: boolean | BlogItemCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $BlogItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BlogItem"
    objects: {
      images: Prisma.$ArticleImagesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      shortDescription: string
      content: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["blogItem"]>
    composites: {}
  }

  type BlogItemGetPayload<S extends boolean | null | undefined | BlogItemDefaultArgs> = $Result.GetResult<Prisma.$BlogItemPayload, S>

  type BlogItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BlogItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BlogItemCountAggregateInputType | true
    }

  export interface BlogItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BlogItem'], meta: { name: 'BlogItem' } }
    /**
     * Find zero or one BlogItem that matches the filter.
     * @param {BlogItemFindUniqueArgs} args - Arguments to find a BlogItem
     * @example
     * // Get one BlogItem
     * const blogItem = await prisma.blogItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BlogItemFindUniqueArgs>(args: SelectSubset<T, BlogItemFindUniqueArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BlogItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BlogItemFindUniqueOrThrowArgs} args - Arguments to find a BlogItem
     * @example
     * // Get one BlogItem
     * const blogItem = await prisma.blogItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BlogItemFindUniqueOrThrowArgs>(args: SelectSubset<T, BlogItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemFindFirstArgs} args - Arguments to find a BlogItem
     * @example
     * // Get one BlogItem
     * const blogItem = await prisma.blogItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BlogItemFindFirstArgs>(args?: SelectSubset<T, BlogItemFindFirstArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BlogItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemFindFirstOrThrowArgs} args - Arguments to find a BlogItem
     * @example
     * // Get one BlogItem
     * const blogItem = await prisma.blogItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BlogItemFindFirstOrThrowArgs>(args?: SelectSubset<T, BlogItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BlogItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BlogItems
     * const blogItems = await prisma.blogItem.findMany()
     * 
     * // Get first 10 BlogItems
     * const blogItems = await prisma.blogItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const blogItemWithIdOnly = await prisma.blogItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BlogItemFindManyArgs>(args?: SelectSubset<T, BlogItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BlogItem.
     * @param {BlogItemCreateArgs} args - Arguments to create a BlogItem.
     * @example
     * // Create one BlogItem
     * const BlogItem = await prisma.blogItem.create({
     *   data: {
     *     // ... data to create a BlogItem
     *   }
     * })
     * 
     */
    create<T extends BlogItemCreateArgs>(args: SelectSubset<T, BlogItemCreateArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BlogItems.
     * @param {BlogItemCreateManyArgs} args - Arguments to create many BlogItems.
     * @example
     * // Create many BlogItems
     * const blogItem = await prisma.blogItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BlogItemCreateManyArgs>(args?: SelectSubset<T, BlogItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BlogItem.
     * @param {BlogItemDeleteArgs} args - Arguments to delete one BlogItem.
     * @example
     * // Delete one BlogItem
     * const BlogItem = await prisma.blogItem.delete({
     *   where: {
     *     // ... filter to delete one BlogItem
     *   }
     * })
     * 
     */
    delete<T extends BlogItemDeleteArgs>(args: SelectSubset<T, BlogItemDeleteArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BlogItem.
     * @param {BlogItemUpdateArgs} args - Arguments to update one BlogItem.
     * @example
     * // Update one BlogItem
     * const blogItem = await prisma.blogItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BlogItemUpdateArgs>(args: SelectSubset<T, BlogItemUpdateArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BlogItems.
     * @param {BlogItemDeleteManyArgs} args - Arguments to filter BlogItems to delete.
     * @example
     * // Delete a few BlogItems
     * const { count } = await prisma.blogItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BlogItemDeleteManyArgs>(args?: SelectSubset<T, BlogItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BlogItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BlogItems
     * const blogItem = await prisma.blogItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BlogItemUpdateManyArgs>(args: SelectSubset<T, BlogItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BlogItem.
     * @param {BlogItemUpsertArgs} args - Arguments to update or create a BlogItem.
     * @example
     * // Update or create a BlogItem
     * const blogItem = await prisma.blogItem.upsert({
     *   create: {
     *     // ... data to create a BlogItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BlogItem we want to update
     *   }
     * })
     */
    upsert<T extends BlogItemUpsertArgs>(args: SelectSubset<T, BlogItemUpsertArgs<ExtArgs>>): Prisma__BlogItemClient<$Result.GetResult<Prisma.$BlogItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BlogItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemCountArgs} args - Arguments to filter BlogItems to count.
     * @example
     * // Count the number of BlogItems
     * const count = await prisma.blogItem.count({
     *   where: {
     *     // ... the filter for the BlogItems we want to count
     *   }
     * })
    **/
    count<T extends BlogItemCountArgs>(
      args?: Subset<T, BlogItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BlogItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BlogItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BlogItemAggregateArgs>(args: Subset<T, BlogItemAggregateArgs>): Prisma.PrismaPromise<GetBlogItemAggregateType<T>>

    /**
     * Group by BlogItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlogItemGroupByArgs} args - Group by arguments.
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
      T extends BlogItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BlogItemGroupByArgs['orderBy'] }
        : { orderBy?: BlogItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BlogItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlogItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BlogItem model
   */
  readonly fields: BlogItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BlogItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BlogItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    images<T extends BlogItem$imagesArgs<ExtArgs> = {}>(args?: Subset<T, BlogItem$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleImagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the BlogItem model
   */
  interface BlogItemFieldRefs {
    readonly id: FieldRef<"BlogItem", 'String'>
    readonly title: FieldRef<"BlogItem", 'String'>
    readonly shortDescription: FieldRef<"BlogItem", 'String'>
    readonly content: FieldRef<"BlogItem", 'String'>
    readonly createdAt: FieldRef<"BlogItem", 'DateTime'>
    readonly updatedAt: FieldRef<"BlogItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BlogItem findUnique
   */
  export type BlogItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * Filter, which BlogItem to fetch.
     */
    where: BlogItemWhereUniqueInput
  }

  /**
   * BlogItem findUniqueOrThrow
   */
  export type BlogItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * Filter, which BlogItem to fetch.
     */
    where: BlogItemWhereUniqueInput
  }

  /**
   * BlogItem findFirst
   */
  export type BlogItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * Filter, which BlogItem to fetch.
     */
    where?: BlogItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogItems to fetch.
     */
    orderBy?: BlogItemOrderByWithRelationInput | BlogItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlogItems.
     */
    cursor?: BlogItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlogItems.
     */
    distinct?: BlogItemScalarFieldEnum | BlogItemScalarFieldEnum[]
  }

  /**
   * BlogItem findFirstOrThrow
   */
  export type BlogItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * Filter, which BlogItem to fetch.
     */
    where?: BlogItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogItems to fetch.
     */
    orderBy?: BlogItemOrderByWithRelationInput | BlogItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BlogItems.
     */
    cursor?: BlogItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BlogItems.
     */
    distinct?: BlogItemScalarFieldEnum | BlogItemScalarFieldEnum[]
  }

  /**
   * BlogItem findMany
   */
  export type BlogItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * Filter, which BlogItems to fetch.
     */
    where?: BlogItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BlogItems to fetch.
     */
    orderBy?: BlogItemOrderByWithRelationInput | BlogItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BlogItems.
     */
    cursor?: BlogItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BlogItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BlogItems.
     */
    skip?: number
    distinct?: BlogItemScalarFieldEnum | BlogItemScalarFieldEnum[]
  }

  /**
   * BlogItem create
   */
  export type BlogItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * The data needed to create a BlogItem.
     */
    data: XOR<BlogItemCreateInput, BlogItemUncheckedCreateInput>
  }

  /**
   * BlogItem createMany
   */
  export type BlogItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BlogItems.
     */
    data: BlogItemCreateManyInput | BlogItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BlogItem update
   */
  export type BlogItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * The data needed to update a BlogItem.
     */
    data: XOR<BlogItemUpdateInput, BlogItemUncheckedUpdateInput>
    /**
     * Choose, which BlogItem to update.
     */
    where: BlogItemWhereUniqueInput
  }

  /**
   * BlogItem updateMany
   */
  export type BlogItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BlogItems.
     */
    data: XOR<BlogItemUpdateManyMutationInput, BlogItemUncheckedUpdateManyInput>
    /**
     * Filter which BlogItems to update
     */
    where?: BlogItemWhereInput
    /**
     * Limit how many BlogItems to update.
     */
    limit?: number
  }

  /**
   * BlogItem upsert
   */
  export type BlogItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * The filter to search for the BlogItem to update in case it exists.
     */
    where: BlogItemWhereUniqueInput
    /**
     * In case the BlogItem found by the `where` argument doesn't exist, create a new BlogItem with this data.
     */
    create: XOR<BlogItemCreateInput, BlogItemUncheckedCreateInput>
    /**
     * In case the BlogItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BlogItemUpdateInput, BlogItemUncheckedUpdateInput>
  }

  /**
   * BlogItem delete
   */
  export type BlogItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
    /**
     * Filter which BlogItem to delete.
     */
    where: BlogItemWhereUniqueInput
  }

  /**
   * BlogItem deleteMany
   */
  export type BlogItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BlogItems to delete
     */
    where?: BlogItemWhereInput
    /**
     * Limit how many BlogItems to delete.
     */
    limit?: number
  }

  /**
   * BlogItem.images
   */
  export type BlogItem$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleImages
     */
    select?: ArticleImagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleImages
     */
    omit?: ArticleImagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleImagesInclude<ExtArgs> | null
    where?: ArticleImagesWhereInput
    orderBy?: ArticleImagesOrderByWithRelationInput | ArticleImagesOrderByWithRelationInput[]
    cursor?: ArticleImagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleImagesScalarFieldEnum | ArticleImagesScalarFieldEnum[]
  }

  /**
   * BlogItem without action
   */
  export type BlogItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlogItem
     */
    select?: BlogItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BlogItem
     */
    omit?: BlogItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BlogItemInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    role: 'role',
    login: 'login',
    password: 'password'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    isSeasonal: 'isSeasonal',
    isActive: 'isActive',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductImagesScalarFieldEnum: {
    id: 'id',
    imgUrl: 'imgUrl',
    productId: 'productId'
  };

  export type ProductImagesScalarFieldEnum = (typeof ProductImagesScalarFieldEnum)[keyof typeof ProductImagesScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    googleMapsUrl: 'googleMapsUrl',
    openingHours: 'openingHours',
    contactId: 'contactId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const BreadVanLocationScalarFieldEnum: {
    id: 'id',
    address: 'address',
    googleMapsUrl: 'googleMapsUrl',
    dayOfTheWeek: 'dayOfTheWeek',
    startTime: 'startTime',
    endTime: 'endTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BreadVanLocationScalarFieldEnum = (typeof BreadVanLocationScalarFieldEnum)[keyof typeof BreadVanLocationScalarFieldEnum]


  export const ContactInfoScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContactInfoScalarFieldEnum = (typeof ContactInfoScalarFieldEnum)[keyof typeof ContactInfoScalarFieldEnum]


  export const MediaScalarFieldEnum: {
    id: 'id',
    url: 'url',
    name: 'name',
    contactId: 'contactId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MediaScalarFieldEnum = (typeof MediaScalarFieldEnum)[keyof typeof MediaScalarFieldEnum]


  export const ArticleImagesScalarFieldEnum: {
    id: 'id',
    imgUrl: 'imgUrl',
    articleId: 'articleId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ArticleImagesScalarFieldEnum = (typeof ArticleImagesScalarFieldEnum)[keyof typeof ArticleImagesScalarFieldEnum]


  export const BlogItemScalarFieldEnum: {
    id: 'id',
    title: 'title',
    shortDescription: 'shortDescription',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BlogItemScalarFieldEnum = (typeof BlogItemScalarFieldEnum)[keyof typeof BlogItemScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    login: 'login',
    password: 'password'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const CategoryOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const ProductOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    categoryId: 'categoryId'
  };

  export type ProductOrderByRelevanceFieldEnum = (typeof ProductOrderByRelevanceFieldEnum)[keyof typeof ProductOrderByRelevanceFieldEnum]


  export const ProductImagesOrderByRelevanceFieldEnum: {
    id: 'id',
    imgUrl: 'imgUrl',
    productId: 'productId'
  };

  export type ProductImagesOrderByRelevanceFieldEnum = (typeof ProductImagesOrderByRelevanceFieldEnum)[keyof typeof ProductImagesOrderByRelevanceFieldEnum]


  export const LocationOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    googleMapsUrl: 'googleMapsUrl',
    openingHours: 'openingHours',
    contactId: 'contactId'
  };

  export type LocationOrderByRelevanceFieldEnum = (typeof LocationOrderByRelevanceFieldEnum)[keyof typeof LocationOrderByRelevanceFieldEnum]


  export const BreadVanLocationOrderByRelevanceFieldEnum: {
    id: 'id',
    address: 'address',
    googleMapsUrl: 'googleMapsUrl',
    dayOfTheWeek: 'dayOfTheWeek',
    startTime: 'startTime',
    endTime: 'endTime'
  };

  export type BreadVanLocationOrderByRelevanceFieldEnum = (typeof BreadVanLocationOrderByRelevanceFieldEnum)[keyof typeof BreadVanLocationOrderByRelevanceFieldEnum]


  export const ContactInfoOrderByRelevanceFieldEnum: {
    id: 'id',
    phone: 'phone',
    email: 'email'
  };

  export type ContactInfoOrderByRelevanceFieldEnum = (typeof ContactInfoOrderByRelevanceFieldEnum)[keyof typeof ContactInfoOrderByRelevanceFieldEnum]


  export const MediaOrderByRelevanceFieldEnum: {
    id: 'id',
    url: 'url',
    name: 'name',
    contactId: 'contactId'
  };

  export type MediaOrderByRelevanceFieldEnum = (typeof MediaOrderByRelevanceFieldEnum)[keyof typeof MediaOrderByRelevanceFieldEnum]


  export const ArticleImagesOrderByRelevanceFieldEnum: {
    id: 'id',
    imgUrl: 'imgUrl',
    articleId: 'articleId'
  };

  export type ArticleImagesOrderByRelevanceFieldEnum = (typeof ArticleImagesOrderByRelevanceFieldEnum)[keyof typeof ArticleImagesOrderByRelevanceFieldEnum]


  export const BlogItemOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    shortDescription: 'shortDescription',
    content: 'content'
  };

  export type BlogItemOrderByRelevanceFieldEnum = (typeof BlogItemOrderByRelevanceFieldEnum)[keyof typeof BlogItemOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    login?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    login?: SortOrder
    password?: SortOrder
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    login?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    role?: EnumRoleFilter<"User"> | $Enums.Role
    password?: StringFilter<"User"> | string
  }, "id" | "login">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    login?: SortOrder
    password?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    login?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    products?: ProductListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    products?: ProductOrderByRelationAggregateInput
    _relevance?: CategoryOrderByRelevanceInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    name?: StringFilter<"Category"> | string
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    products?: ProductListRelationFilter
  }, "id">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: FloatFilter<"Product"> | number
    isSeasonal?: BoolFilter<"Product"> | boolean
    isActive?: BoolNullableFilter<"Product"> | boolean | null
    categoryId?: StringFilter<"Product"> | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    images?: ProductImagesListRelationFilter
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    isSeasonal?: SortOrder
    isActive?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    images?: ProductImagesOrderByRelationAggregateInput
    category?: CategoryOrderByWithRelationInput
    _relevance?: ProductOrderByRelevanceInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: FloatFilter<"Product"> | number
    isSeasonal?: BoolFilter<"Product"> | boolean
    isActive?: BoolNullableFilter<"Product"> | boolean | null
    categoryId?: StringFilter<"Product"> | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    images?: ProductImagesListRelationFilter
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
  }, "id">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    isSeasonal?: SortOrder
    isActive?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    description?: StringWithAggregatesFilter<"Product"> | string
    price?: FloatWithAggregatesFilter<"Product"> | number
    isSeasonal?: BoolWithAggregatesFilter<"Product"> | boolean
    isActive?: BoolNullableWithAggregatesFilter<"Product"> | boolean | null
    categoryId?: StringWithAggregatesFilter<"Product"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type ProductImagesWhereInput = {
    AND?: ProductImagesWhereInput | ProductImagesWhereInput[]
    OR?: ProductImagesWhereInput[]
    NOT?: ProductImagesWhereInput | ProductImagesWhereInput[]
    id?: StringFilter<"ProductImages"> | string
    imgUrl?: StringFilter<"ProductImages"> | string
    productId?: StringFilter<"ProductImages"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductImagesOrderByWithRelationInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    productId?: SortOrder
    product?: ProductOrderByWithRelationInput
    _relevance?: ProductImagesOrderByRelevanceInput
  }

  export type ProductImagesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductImagesWhereInput | ProductImagesWhereInput[]
    OR?: ProductImagesWhereInput[]
    NOT?: ProductImagesWhereInput | ProductImagesWhereInput[]
    imgUrl?: StringFilter<"ProductImages"> | string
    productId?: StringFilter<"ProductImages"> | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type ProductImagesOrderByWithAggregationInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    productId?: SortOrder
    _count?: ProductImagesCountOrderByAggregateInput
    _max?: ProductImagesMaxOrderByAggregateInput
    _min?: ProductImagesMinOrderByAggregateInput
  }

  export type ProductImagesScalarWhereWithAggregatesInput = {
    AND?: ProductImagesScalarWhereWithAggregatesInput | ProductImagesScalarWhereWithAggregatesInput[]
    OR?: ProductImagesScalarWhereWithAggregatesInput[]
    NOT?: ProductImagesScalarWhereWithAggregatesInput | ProductImagesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductImages"> | string
    imgUrl?: StringWithAggregatesFilter<"ProductImages"> | string
    productId?: StringWithAggregatesFilter<"ProductImages"> | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: StringFilter<"Location"> | string
    name?: StringNullableFilter<"Location"> | string | null
    address?: StringFilter<"Location"> | string
    googleMapsUrl?: StringFilter<"Location"> | string
    openingHours?: StringFilter<"Location"> | string
    contactId?: StringFilter<"Location"> | string
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    contact?: XOR<ContactInfoScalarRelationFilter, ContactInfoWhereInput>
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    openingHours?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contact?: ContactInfoOrderByWithRelationInput
    _relevance?: LocationOrderByRelevanceInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    name?: StringNullableFilter<"Location"> | string | null
    address?: StringFilter<"Location"> | string
    googleMapsUrl?: StringFilter<"Location"> | string
    openingHours?: StringFilter<"Location"> | string
    contactId?: StringFilter<"Location"> | string
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    contact?: XOR<ContactInfoScalarRelationFilter, ContactInfoWhereInput>
  }, "id">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    openingHours?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Location"> | string
    name?: StringNullableWithAggregatesFilter<"Location"> | string | null
    address?: StringWithAggregatesFilter<"Location"> | string
    googleMapsUrl?: StringWithAggregatesFilter<"Location"> | string
    openingHours?: StringWithAggregatesFilter<"Location"> | string
    contactId?: StringWithAggregatesFilter<"Location"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
  }

  export type BreadVanLocationWhereInput = {
    AND?: BreadVanLocationWhereInput | BreadVanLocationWhereInput[]
    OR?: BreadVanLocationWhereInput[]
    NOT?: BreadVanLocationWhereInput | BreadVanLocationWhereInput[]
    id?: StringFilter<"BreadVanLocation"> | string
    address?: StringFilter<"BreadVanLocation"> | string
    googleMapsUrl?: StringFilter<"BreadVanLocation"> | string
    dayOfTheWeek?: StringFilter<"BreadVanLocation"> | string
    startTime?: StringFilter<"BreadVanLocation"> | string
    endTime?: StringFilter<"BreadVanLocation"> | string
    createdAt?: DateTimeFilter<"BreadVanLocation"> | Date | string
    updatedAt?: DateTimeFilter<"BreadVanLocation"> | Date | string
  }

  export type BreadVanLocationOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    dayOfTheWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: BreadVanLocationOrderByRelevanceInput
  }

  export type BreadVanLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BreadVanLocationWhereInput | BreadVanLocationWhereInput[]
    OR?: BreadVanLocationWhereInput[]
    NOT?: BreadVanLocationWhereInput | BreadVanLocationWhereInput[]
    address?: StringFilter<"BreadVanLocation"> | string
    googleMapsUrl?: StringFilter<"BreadVanLocation"> | string
    dayOfTheWeek?: StringFilter<"BreadVanLocation"> | string
    startTime?: StringFilter<"BreadVanLocation"> | string
    endTime?: StringFilter<"BreadVanLocation"> | string
    createdAt?: DateTimeFilter<"BreadVanLocation"> | Date | string
    updatedAt?: DateTimeFilter<"BreadVanLocation"> | Date | string
  }, "id">

  export type BreadVanLocationOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    dayOfTheWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BreadVanLocationCountOrderByAggregateInput
    _max?: BreadVanLocationMaxOrderByAggregateInput
    _min?: BreadVanLocationMinOrderByAggregateInput
  }

  export type BreadVanLocationScalarWhereWithAggregatesInput = {
    AND?: BreadVanLocationScalarWhereWithAggregatesInput | BreadVanLocationScalarWhereWithAggregatesInput[]
    OR?: BreadVanLocationScalarWhereWithAggregatesInput[]
    NOT?: BreadVanLocationScalarWhereWithAggregatesInput | BreadVanLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BreadVanLocation"> | string
    address?: StringWithAggregatesFilter<"BreadVanLocation"> | string
    googleMapsUrl?: StringWithAggregatesFilter<"BreadVanLocation"> | string
    dayOfTheWeek?: StringWithAggregatesFilter<"BreadVanLocation"> | string
    startTime?: StringWithAggregatesFilter<"BreadVanLocation"> | string
    endTime?: StringWithAggregatesFilter<"BreadVanLocation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BreadVanLocation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BreadVanLocation"> | Date | string
  }

  export type ContactInfoWhereInput = {
    AND?: ContactInfoWhereInput | ContactInfoWhereInput[]
    OR?: ContactInfoWhereInput[]
    NOT?: ContactInfoWhereInput | ContactInfoWhereInput[]
    id?: StringFilter<"ContactInfo"> | string
    phone?: StringFilter<"ContactInfo"> | string
    email?: StringFilter<"ContactInfo"> | string
    createdAt?: DateTimeFilter<"ContactInfo"> | Date | string
    updatedAt?: DateTimeFilter<"ContactInfo"> | Date | string
    media?: MediaListRelationFilter
    locations?: LocationListRelationFilter
  }

  export type ContactInfoOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    media?: MediaOrderByRelationAggregateInput
    locations?: LocationOrderByRelationAggregateInput
    _relevance?: ContactInfoOrderByRelevanceInput
  }

  export type ContactInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContactInfoWhereInput | ContactInfoWhereInput[]
    OR?: ContactInfoWhereInput[]
    NOT?: ContactInfoWhereInput | ContactInfoWhereInput[]
    phone?: StringFilter<"ContactInfo"> | string
    email?: StringFilter<"ContactInfo"> | string
    createdAt?: DateTimeFilter<"ContactInfo"> | Date | string
    updatedAt?: DateTimeFilter<"ContactInfo"> | Date | string
    media?: MediaListRelationFilter
    locations?: LocationListRelationFilter
  }, "id">

  export type ContactInfoOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContactInfoCountOrderByAggregateInput
    _max?: ContactInfoMaxOrderByAggregateInput
    _min?: ContactInfoMinOrderByAggregateInput
  }

  export type ContactInfoScalarWhereWithAggregatesInput = {
    AND?: ContactInfoScalarWhereWithAggregatesInput | ContactInfoScalarWhereWithAggregatesInput[]
    OR?: ContactInfoScalarWhereWithAggregatesInput[]
    NOT?: ContactInfoScalarWhereWithAggregatesInput | ContactInfoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContactInfo"> | string
    phone?: StringWithAggregatesFilter<"ContactInfo"> | string
    email?: StringWithAggregatesFilter<"ContactInfo"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ContactInfo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ContactInfo"> | Date | string
  }

  export type MediaWhereInput = {
    AND?: MediaWhereInput | MediaWhereInput[]
    OR?: MediaWhereInput[]
    NOT?: MediaWhereInput | MediaWhereInput[]
    id?: StringFilter<"Media"> | string
    url?: StringFilter<"Media"> | string
    name?: StringFilter<"Media"> | string
    contactId?: StringFilter<"Media"> | string
    createdAt?: DateTimeFilter<"Media"> | Date | string
    updatedAt?: DateTimeFilter<"Media"> | Date | string
    contact?: XOR<ContactInfoScalarRelationFilter, ContactInfoWhereInput>
  }

  export type MediaOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    name?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    contact?: ContactInfoOrderByWithRelationInput
    _relevance?: MediaOrderByRelevanceInput
  }

  export type MediaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MediaWhereInput | MediaWhereInput[]
    OR?: MediaWhereInput[]
    NOT?: MediaWhereInput | MediaWhereInput[]
    url?: StringFilter<"Media"> | string
    name?: StringFilter<"Media"> | string
    contactId?: StringFilter<"Media"> | string
    createdAt?: DateTimeFilter<"Media"> | Date | string
    updatedAt?: DateTimeFilter<"Media"> | Date | string
    contact?: XOR<ContactInfoScalarRelationFilter, ContactInfoWhereInput>
  }, "id">

  export type MediaOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    name?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MediaCountOrderByAggregateInput
    _max?: MediaMaxOrderByAggregateInput
    _min?: MediaMinOrderByAggregateInput
  }

  export type MediaScalarWhereWithAggregatesInput = {
    AND?: MediaScalarWhereWithAggregatesInput | MediaScalarWhereWithAggregatesInput[]
    OR?: MediaScalarWhereWithAggregatesInput[]
    NOT?: MediaScalarWhereWithAggregatesInput | MediaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Media"> | string
    url?: StringWithAggregatesFilter<"Media"> | string
    name?: StringWithAggregatesFilter<"Media"> | string
    contactId?: StringWithAggregatesFilter<"Media"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Media"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Media"> | Date | string
  }

  export type ArticleImagesWhereInput = {
    AND?: ArticleImagesWhereInput | ArticleImagesWhereInput[]
    OR?: ArticleImagesWhereInput[]
    NOT?: ArticleImagesWhereInput | ArticleImagesWhereInput[]
    id?: StringFilter<"ArticleImages"> | string
    imgUrl?: StringFilter<"ArticleImages"> | string
    articleId?: StringFilter<"ArticleImages"> | string
    createdAt?: DateTimeFilter<"ArticleImages"> | Date | string
    updatedAt?: DateTimeFilter<"ArticleImages"> | Date | string
    article?: XOR<BlogItemScalarRelationFilter, BlogItemWhereInput>
  }

  export type ArticleImagesOrderByWithRelationInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    articleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    article?: BlogItemOrderByWithRelationInput
    _relevance?: ArticleImagesOrderByRelevanceInput
  }

  export type ArticleImagesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleImagesWhereInput | ArticleImagesWhereInput[]
    OR?: ArticleImagesWhereInput[]
    NOT?: ArticleImagesWhereInput | ArticleImagesWhereInput[]
    imgUrl?: StringFilter<"ArticleImages"> | string
    articleId?: StringFilter<"ArticleImages"> | string
    createdAt?: DateTimeFilter<"ArticleImages"> | Date | string
    updatedAt?: DateTimeFilter<"ArticleImages"> | Date | string
    article?: XOR<BlogItemScalarRelationFilter, BlogItemWhereInput>
  }, "id">

  export type ArticleImagesOrderByWithAggregationInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    articleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ArticleImagesCountOrderByAggregateInput
    _max?: ArticleImagesMaxOrderByAggregateInput
    _min?: ArticleImagesMinOrderByAggregateInput
  }

  export type ArticleImagesScalarWhereWithAggregatesInput = {
    AND?: ArticleImagesScalarWhereWithAggregatesInput | ArticleImagesScalarWhereWithAggregatesInput[]
    OR?: ArticleImagesScalarWhereWithAggregatesInput[]
    NOT?: ArticleImagesScalarWhereWithAggregatesInput | ArticleImagesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleImages"> | string
    imgUrl?: StringWithAggregatesFilter<"ArticleImages"> | string
    articleId?: StringWithAggregatesFilter<"ArticleImages"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ArticleImages"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ArticleImages"> | Date | string
  }

  export type BlogItemWhereInput = {
    AND?: BlogItemWhereInput | BlogItemWhereInput[]
    OR?: BlogItemWhereInput[]
    NOT?: BlogItemWhereInput | BlogItemWhereInput[]
    id?: StringFilter<"BlogItem"> | string
    title?: StringFilter<"BlogItem"> | string
    shortDescription?: StringFilter<"BlogItem"> | string
    content?: StringFilter<"BlogItem"> | string
    createdAt?: DateTimeFilter<"BlogItem"> | Date | string
    updatedAt?: DateTimeFilter<"BlogItem"> | Date | string
    images?: ArticleImagesListRelationFilter
  }

  export type BlogItemOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    shortDescription?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    images?: ArticleImagesOrderByRelationAggregateInput
    _relevance?: BlogItemOrderByRelevanceInput
  }

  export type BlogItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BlogItemWhereInput | BlogItemWhereInput[]
    OR?: BlogItemWhereInput[]
    NOT?: BlogItemWhereInput | BlogItemWhereInput[]
    title?: StringFilter<"BlogItem"> | string
    shortDescription?: StringFilter<"BlogItem"> | string
    content?: StringFilter<"BlogItem"> | string
    createdAt?: DateTimeFilter<"BlogItem"> | Date | string
    updatedAt?: DateTimeFilter<"BlogItem"> | Date | string
    images?: ArticleImagesListRelationFilter
  }, "id">

  export type BlogItemOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    shortDescription?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BlogItemCountOrderByAggregateInput
    _max?: BlogItemMaxOrderByAggregateInput
    _min?: BlogItemMinOrderByAggregateInput
  }

  export type BlogItemScalarWhereWithAggregatesInput = {
    AND?: BlogItemScalarWhereWithAggregatesInput | BlogItemScalarWhereWithAggregatesInput[]
    OR?: BlogItemScalarWhereWithAggregatesInput[]
    NOT?: BlogItemScalarWhereWithAggregatesInput | BlogItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BlogItem"> | string
    title?: StringWithAggregatesFilter<"BlogItem"> | string
    shortDescription?: StringWithAggregatesFilter<"BlogItem"> | string
    content?: StringWithAggregatesFilter<"BlogItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BlogItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BlogItem"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    role: $Enums.Role
    login: string
    password: string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    role: $Enums.Role
    login: string
    password: string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    login?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    login?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManyInput = {
    id?: string
    role: $Enums.Role
    login: string
    password: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    login?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    login?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImagesCreateNestedManyWithoutProductInput
    category: CategoryCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImagesUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImagesUpdateManyWithoutProductNestedInput
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImagesUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImagesCreateInput = {
    id?: string
    imgUrl: string
    product: ProductCreateNestedOneWithoutImagesInput
  }

  export type ProductImagesUncheckedCreateInput = {
    id?: string
    imgUrl: string
    productId: string
  }

  export type ProductImagesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    product?: ProductUpdateOneRequiredWithoutImagesNestedInput
  }

  export type ProductImagesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
  }

  export type ProductImagesCreateManyInput = {
    id?: string
    imgUrl: string
    productId: string
  }

  export type ProductImagesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
  }

  export type ProductImagesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
  }

  export type LocationCreateInput = {
    id?: string
    name?: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    createdAt?: Date | string
    updatedAt?: Date | string
    contact: ContactInfoCreateNestedOneWithoutLocationsInput
  }

  export type LocationUncheckedCreateInput = {
    id?: string
    name?: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    contactId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactInfoUpdateOneRequiredWithoutLocationsNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationCreateManyInput = {
    id?: string
    name?: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    contactId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BreadVanLocationCreateInput = {
    id?: string
    address: string
    googleMapsUrl: string
    dayOfTheWeek: string
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BreadVanLocationUncheckedCreateInput = {
    id?: string
    address: string
    googleMapsUrl: string
    dayOfTheWeek: string
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BreadVanLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    dayOfTheWeek?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BreadVanLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    dayOfTheWeek?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BreadVanLocationCreateManyInput = {
    id?: string
    address: string
    googleMapsUrl: string
    dayOfTheWeek: string
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BreadVanLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    dayOfTheWeek?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BreadVanLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    dayOfTheWeek?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoCreateInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: MediaCreateNestedManyWithoutContactInput
    locations?: LocationCreateNestedManyWithoutContactInput
  }

  export type ContactInfoUncheckedCreateInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: MediaUncheckedCreateNestedManyWithoutContactInput
    locations?: LocationUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactInfoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUpdateManyWithoutContactNestedInput
    locations?: LocationUpdateManyWithoutContactNestedInput
  }

  export type ContactInfoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUncheckedUpdateManyWithoutContactNestedInput
    locations?: LocationUncheckedUpdateManyWithoutContactNestedInput
  }

  export type ContactInfoCreateManyInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContactInfoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaCreateInput = {
    id?: string
    url: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    contact: ContactInfoCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateInput = {
    id?: string
    url: string
    name: string
    contactId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    contact?: ContactInfoUpdateOneRequiredWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaCreateManyInput = {
    id?: string
    url: string
    name: string
    contactId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesCreateInput = {
    id?: string
    imgUrl: string
    createdAt?: Date | string
    updatedAt?: Date | string
    article: BlogItemCreateNestedOneWithoutImagesInput
  }

  export type ArticleImagesUncheckedCreateInput = {
    id?: string
    imgUrl: string
    articleId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleImagesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: BlogItemUpdateOneRequiredWithoutImagesNestedInput
  }

  export type ArticleImagesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesCreateManyInput = {
    id?: string
    imgUrl: string
    articleId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleImagesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlogItemCreateInput = {
    id?: string
    title: string
    shortDescription: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ArticleImagesCreateNestedManyWithoutArticleInput
  }

  export type BlogItemUncheckedCreateInput = {
    id?: string
    title: string
    shortDescription: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ArticleImagesUncheckedCreateNestedManyWithoutArticleInput
  }

  export type BlogItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    shortDescription?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ArticleImagesUpdateManyWithoutArticleNestedInput
  }

  export type BlogItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    shortDescription?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ArticleImagesUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type BlogItemCreateManyInput = {
    id?: string
    title: string
    shortDescription: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BlogItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    shortDescription?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlogItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    shortDescription?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    login?: SortOrder
    password?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    login?: SortOrder
    password?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    login?: SortOrder
    password?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryOrderByRelevanceInput = {
    fields: CategoryOrderByRelevanceFieldEnum | CategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ProductImagesListRelationFilter = {
    every?: ProductImagesWhereInput
    some?: ProductImagesWhereInput
    none?: ProductImagesWhereInput
  }

  export type CategoryScalarRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductImagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelevanceInput = {
    fields: ProductOrderByRelevanceFieldEnum | ProductOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    isSeasonal?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    isSeasonal?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    isSeasonal?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductImagesOrderByRelevanceInput = {
    fields: ProductImagesOrderByRelevanceFieldEnum | ProductImagesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductImagesCountOrderByAggregateInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    productId?: SortOrder
  }

  export type ProductImagesMaxOrderByAggregateInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    productId?: SortOrder
  }

  export type ProductImagesMinOrderByAggregateInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    productId?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type ContactInfoScalarRelationFilter = {
    is?: ContactInfoWhereInput
    isNot?: ContactInfoWhereInput
  }

  export type LocationOrderByRelevanceInput = {
    fields: LocationOrderByRelevanceFieldEnum | LocationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    openingHours?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    openingHours?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    openingHours?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BreadVanLocationOrderByRelevanceInput = {
    fields: BreadVanLocationOrderByRelevanceFieldEnum | BreadVanLocationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BreadVanLocationCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    dayOfTheWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BreadVanLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    dayOfTheWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BreadVanLocationMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    googleMapsUrl?: SortOrder
    dayOfTheWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaListRelationFilter = {
    every?: MediaWhereInput
    some?: MediaWhereInput
    none?: MediaWhereInput
  }

  export type LocationListRelationFilter = {
    every?: LocationWhereInput
    some?: LocationWhereInput
    none?: LocationWhereInput
  }

  export type MediaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContactInfoOrderByRelevanceInput = {
    fields: ContactInfoOrderByRelevanceFieldEnum | ContactInfoOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ContactInfoCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContactInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContactInfoMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaOrderByRelevanceInput = {
    fields: MediaOrderByRelevanceFieldEnum | MediaOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MediaCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    name?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    name?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    name?: SortOrder
    contactId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BlogItemScalarRelationFilter = {
    is?: BlogItemWhereInput
    isNot?: BlogItemWhereInput
  }

  export type ArticleImagesOrderByRelevanceInput = {
    fields: ArticleImagesOrderByRelevanceFieldEnum | ArticleImagesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ArticleImagesCountOrderByAggregateInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    articleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleImagesMaxOrderByAggregateInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    articleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleImagesMinOrderByAggregateInput = {
    id?: SortOrder
    imgUrl?: SortOrder
    articleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleImagesListRelationFilter = {
    every?: ArticleImagesWhereInput
    some?: ArticleImagesWhereInput
    none?: ArticleImagesWhereInput
  }

  export type ArticleImagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BlogItemOrderByRelevanceInput = {
    fields: BlogItemOrderByRelevanceFieldEnum | BlogItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BlogItemCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    shortDescription?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BlogItemMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    shortDescription?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BlogItemMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    shortDescription?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type ProductCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProductUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductImagesCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductImagesCreateWithoutProductInput, ProductImagesUncheckedCreateWithoutProductInput> | ProductImagesCreateWithoutProductInput[] | ProductImagesUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImagesCreateOrConnectWithoutProductInput | ProductImagesCreateOrConnectWithoutProductInput[]
    createMany?: ProductImagesCreateManyProductInputEnvelope
    connect?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
  }

  export type CategoryCreateNestedOneWithoutProductsInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    connect?: CategoryWhereUniqueInput
  }

  export type ProductImagesUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductImagesCreateWithoutProductInput, ProductImagesUncheckedCreateWithoutProductInput> | ProductImagesCreateWithoutProductInput[] | ProductImagesUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImagesCreateOrConnectWithoutProductInput | ProductImagesCreateOrConnectWithoutProductInput[]
    createMany?: ProductImagesCreateManyProductInputEnvelope
    connect?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type ProductImagesUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductImagesCreateWithoutProductInput, ProductImagesUncheckedCreateWithoutProductInput> | ProductImagesCreateWithoutProductInput[] | ProductImagesUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImagesCreateOrConnectWithoutProductInput | ProductImagesCreateOrConnectWithoutProductInput[]
    upsert?: ProductImagesUpsertWithWhereUniqueWithoutProductInput | ProductImagesUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductImagesCreateManyProductInputEnvelope
    set?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    disconnect?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    delete?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    connect?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    update?: ProductImagesUpdateWithWhereUniqueWithoutProductInput | ProductImagesUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductImagesUpdateManyWithWhereWithoutProductInput | ProductImagesUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductImagesScalarWhereInput | ProductImagesScalarWhereInput[]
  }

  export type CategoryUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    upsert?: CategoryUpsertWithoutProductsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutProductsInput, CategoryUpdateWithoutProductsInput>, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type ProductImagesUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductImagesCreateWithoutProductInput, ProductImagesUncheckedCreateWithoutProductInput> | ProductImagesCreateWithoutProductInput[] | ProductImagesUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImagesCreateOrConnectWithoutProductInput | ProductImagesCreateOrConnectWithoutProductInput[]
    upsert?: ProductImagesUpsertWithWhereUniqueWithoutProductInput | ProductImagesUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductImagesCreateManyProductInputEnvelope
    set?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    disconnect?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    delete?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    connect?: ProductImagesWhereUniqueInput | ProductImagesWhereUniqueInput[]
    update?: ProductImagesUpdateWithWhereUniqueWithoutProductInput | ProductImagesUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductImagesUpdateManyWithWhereWithoutProductInput | ProductImagesUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductImagesScalarWhereInput | ProductImagesScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutImagesInput = {
    create?: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutImagesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutImagesInput
    upsert?: ProductUpsertWithoutImagesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutImagesInput, ProductUpdateWithoutImagesInput>, ProductUncheckedUpdateWithoutImagesInput>
  }

  export type ContactInfoCreateNestedOneWithoutLocationsInput = {
    create?: XOR<ContactInfoCreateWithoutLocationsInput, ContactInfoUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: ContactInfoCreateOrConnectWithoutLocationsInput
    connect?: ContactInfoWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ContactInfoUpdateOneRequiredWithoutLocationsNestedInput = {
    create?: XOR<ContactInfoCreateWithoutLocationsInput, ContactInfoUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: ContactInfoCreateOrConnectWithoutLocationsInput
    upsert?: ContactInfoUpsertWithoutLocationsInput
    connect?: ContactInfoWhereUniqueInput
    update?: XOR<XOR<ContactInfoUpdateToOneWithWhereWithoutLocationsInput, ContactInfoUpdateWithoutLocationsInput>, ContactInfoUncheckedUpdateWithoutLocationsInput>
  }

  export type MediaCreateNestedManyWithoutContactInput = {
    create?: XOR<MediaCreateWithoutContactInput, MediaUncheckedCreateWithoutContactInput> | MediaCreateWithoutContactInput[] | MediaUncheckedCreateWithoutContactInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutContactInput | MediaCreateOrConnectWithoutContactInput[]
    createMany?: MediaCreateManyContactInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type LocationCreateNestedManyWithoutContactInput = {
    create?: XOR<LocationCreateWithoutContactInput, LocationUncheckedCreateWithoutContactInput> | LocationCreateWithoutContactInput[] | LocationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutContactInput | LocationCreateOrConnectWithoutContactInput[]
    createMany?: LocationCreateManyContactInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type MediaUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<MediaCreateWithoutContactInput, MediaUncheckedCreateWithoutContactInput> | MediaCreateWithoutContactInput[] | MediaUncheckedCreateWithoutContactInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutContactInput | MediaCreateOrConnectWithoutContactInput[]
    createMany?: MediaCreateManyContactInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type LocationUncheckedCreateNestedManyWithoutContactInput = {
    create?: XOR<LocationCreateWithoutContactInput, LocationUncheckedCreateWithoutContactInput> | LocationCreateWithoutContactInput[] | LocationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutContactInput | LocationCreateOrConnectWithoutContactInput[]
    createMany?: LocationCreateManyContactInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type MediaUpdateManyWithoutContactNestedInput = {
    create?: XOR<MediaCreateWithoutContactInput, MediaUncheckedCreateWithoutContactInput> | MediaCreateWithoutContactInput[] | MediaUncheckedCreateWithoutContactInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutContactInput | MediaCreateOrConnectWithoutContactInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutContactInput | MediaUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: MediaCreateManyContactInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutContactInput | MediaUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutContactInput | MediaUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type LocationUpdateManyWithoutContactNestedInput = {
    create?: XOR<LocationCreateWithoutContactInput, LocationUncheckedCreateWithoutContactInput> | LocationCreateWithoutContactInput[] | LocationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutContactInput | LocationCreateOrConnectWithoutContactInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutContactInput | LocationUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: LocationCreateManyContactInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutContactInput | LocationUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutContactInput | LocationUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type MediaUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<MediaCreateWithoutContactInput, MediaUncheckedCreateWithoutContactInput> | MediaCreateWithoutContactInput[] | MediaUncheckedCreateWithoutContactInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutContactInput | MediaCreateOrConnectWithoutContactInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutContactInput | MediaUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: MediaCreateManyContactInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutContactInput | MediaUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutContactInput | MediaUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type LocationUncheckedUpdateManyWithoutContactNestedInput = {
    create?: XOR<LocationCreateWithoutContactInput, LocationUncheckedCreateWithoutContactInput> | LocationCreateWithoutContactInput[] | LocationUncheckedCreateWithoutContactInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutContactInput | LocationCreateOrConnectWithoutContactInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutContactInput | LocationUpsertWithWhereUniqueWithoutContactInput[]
    createMany?: LocationCreateManyContactInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutContactInput | LocationUpdateWithWhereUniqueWithoutContactInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutContactInput | LocationUpdateManyWithWhereWithoutContactInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type ContactInfoCreateNestedOneWithoutMediaInput = {
    create?: XOR<ContactInfoCreateWithoutMediaInput, ContactInfoUncheckedCreateWithoutMediaInput>
    connectOrCreate?: ContactInfoCreateOrConnectWithoutMediaInput
    connect?: ContactInfoWhereUniqueInput
  }

  export type ContactInfoUpdateOneRequiredWithoutMediaNestedInput = {
    create?: XOR<ContactInfoCreateWithoutMediaInput, ContactInfoUncheckedCreateWithoutMediaInput>
    connectOrCreate?: ContactInfoCreateOrConnectWithoutMediaInput
    upsert?: ContactInfoUpsertWithoutMediaInput
    connect?: ContactInfoWhereUniqueInput
    update?: XOR<XOR<ContactInfoUpdateToOneWithWhereWithoutMediaInput, ContactInfoUpdateWithoutMediaInput>, ContactInfoUncheckedUpdateWithoutMediaInput>
  }

  export type BlogItemCreateNestedOneWithoutImagesInput = {
    create?: XOR<BlogItemCreateWithoutImagesInput, BlogItemUncheckedCreateWithoutImagesInput>
    connectOrCreate?: BlogItemCreateOrConnectWithoutImagesInput
    connect?: BlogItemWhereUniqueInput
  }

  export type BlogItemUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<BlogItemCreateWithoutImagesInput, BlogItemUncheckedCreateWithoutImagesInput>
    connectOrCreate?: BlogItemCreateOrConnectWithoutImagesInput
    upsert?: BlogItemUpsertWithoutImagesInput
    connect?: BlogItemWhereUniqueInput
    update?: XOR<XOR<BlogItemUpdateToOneWithWhereWithoutImagesInput, BlogItemUpdateWithoutImagesInput>, BlogItemUncheckedUpdateWithoutImagesInput>
  }

  export type ArticleImagesCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleImagesCreateWithoutArticleInput, ArticleImagesUncheckedCreateWithoutArticleInput> | ArticleImagesCreateWithoutArticleInput[] | ArticleImagesUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleImagesCreateOrConnectWithoutArticleInput | ArticleImagesCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleImagesCreateManyArticleInputEnvelope
    connect?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
  }

  export type ArticleImagesUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleImagesCreateWithoutArticleInput, ArticleImagesUncheckedCreateWithoutArticleInput> | ArticleImagesCreateWithoutArticleInput[] | ArticleImagesUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleImagesCreateOrConnectWithoutArticleInput | ArticleImagesCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleImagesCreateManyArticleInputEnvelope
    connect?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
  }

  export type ArticleImagesUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleImagesCreateWithoutArticleInput, ArticleImagesUncheckedCreateWithoutArticleInput> | ArticleImagesCreateWithoutArticleInput[] | ArticleImagesUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleImagesCreateOrConnectWithoutArticleInput | ArticleImagesCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleImagesUpsertWithWhereUniqueWithoutArticleInput | ArticleImagesUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleImagesCreateManyArticleInputEnvelope
    set?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    disconnect?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    delete?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    connect?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    update?: ArticleImagesUpdateWithWhereUniqueWithoutArticleInput | ArticleImagesUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleImagesUpdateManyWithWhereWithoutArticleInput | ArticleImagesUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleImagesScalarWhereInput | ArticleImagesScalarWhereInput[]
  }

  export type ArticleImagesUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleImagesCreateWithoutArticleInput, ArticleImagesUncheckedCreateWithoutArticleInput> | ArticleImagesCreateWithoutArticleInput[] | ArticleImagesUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleImagesCreateOrConnectWithoutArticleInput | ArticleImagesCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleImagesUpsertWithWhereUniqueWithoutArticleInput | ArticleImagesUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleImagesCreateManyArticleInputEnvelope
    set?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    disconnect?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    delete?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    connect?: ArticleImagesWhereUniqueInput | ArticleImagesWhereUniqueInput[]
    update?: ArticleImagesUpdateWithWhereUniqueWithoutArticleInput | ArticleImagesUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleImagesUpdateManyWithWhereWithoutArticleInput | ArticleImagesUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleImagesScalarWhereInput | ArticleImagesScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ProductCreateWithoutCategoryInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImagesCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: ProductImagesUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductCreateManyCategoryInputEnvelope = {
    data: ProductCreateManyCategoryInput | ProductCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
  }

  export type ProductUpdateManyWithWhereWithoutCategoryInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutCategoryInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringFilter<"Product"> | string
    price?: FloatFilter<"Product"> | number
    isSeasonal?: BoolFilter<"Product"> | boolean
    isActive?: BoolNullableFilter<"Product"> | boolean | null
    categoryId?: StringFilter<"Product"> | string
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }

  export type ProductImagesCreateWithoutProductInput = {
    id?: string
    imgUrl: string
  }

  export type ProductImagesUncheckedCreateWithoutProductInput = {
    id?: string
    imgUrl: string
  }

  export type ProductImagesCreateOrConnectWithoutProductInput = {
    where: ProductImagesWhereUniqueInput
    create: XOR<ProductImagesCreateWithoutProductInput, ProductImagesUncheckedCreateWithoutProductInput>
  }

  export type ProductImagesCreateManyProductInputEnvelope = {
    data: ProductImagesCreateManyProductInput | ProductImagesCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type CategoryCreateWithoutProductsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateWithoutProductsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutProductsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
  }

  export type ProductImagesUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductImagesWhereUniqueInput
    update: XOR<ProductImagesUpdateWithoutProductInput, ProductImagesUncheckedUpdateWithoutProductInput>
    create: XOR<ProductImagesCreateWithoutProductInput, ProductImagesUncheckedCreateWithoutProductInput>
  }

  export type ProductImagesUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductImagesWhereUniqueInput
    data: XOR<ProductImagesUpdateWithoutProductInput, ProductImagesUncheckedUpdateWithoutProductInput>
  }

  export type ProductImagesUpdateManyWithWhereWithoutProductInput = {
    where: ProductImagesScalarWhereInput
    data: XOR<ProductImagesUpdateManyMutationInput, ProductImagesUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductImagesScalarWhereInput = {
    AND?: ProductImagesScalarWhereInput | ProductImagesScalarWhereInput[]
    OR?: ProductImagesScalarWhereInput[]
    NOT?: ProductImagesScalarWhereInput | ProductImagesScalarWhereInput[]
    id?: StringFilter<"ProductImages"> | string
    imgUrl?: StringFilter<"ProductImages"> | string
    productId?: StringFilter<"ProductImages"> | string
  }

  export type CategoryUpsertWithoutProductsInput = {
    update: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutProductsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type CategoryUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateWithoutImagesInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: CategoryCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutImagesInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductCreateOrConnectWithoutImagesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
  }

  export type ProductUpsertWithoutImagesInput = {
    update: XOR<ProductUpdateWithoutImagesInput, ProductUncheckedUpdateWithoutImagesInput>
    create: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutImagesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutImagesInput, ProductUncheckedUpdateWithoutImagesInput>
  }

  export type ProductUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactInfoCreateWithoutLocationsInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: MediaCreateNestedManyWithoutContactInput
  }

  export type ContactInfoUncheckedCreateWithoutLocationsInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    media?: MediaUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactInfoCreateOrConnectWithoutLocationsInput = {
    where: ContactInfoWhereUniqueInput
    create: XOR<ContactInfoCreateWithoutLocationsInput, ContactInfoUncheckedCreateWithoutLocationsInput>
  }

  export type ContactInfoUpsertWithoutLocationsInput = {
    update: XOR<ContactInfoUpdateWithoutLocationsInput, ContactInfoUncheckedUpdateWithoutLocationsInput>
    create: XOR<ContactInfoCreateWithoutLocationsInput, ContactInfoUncheckedCreateWithoutLocationsInput>
    where?: ContactInfoWhereInput
  }

  export type ContactInfoUpdateToOneWithWhereWithoutLocationsInput = {
    where?: ContactInfoWhereInput
    data: XOR<ContactInfoUpdateWithoutLocationsInput, ContactInfoUncheckedUpdateWithoutLocationsInput>
  }

  export type ContactInfoUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUpdateManyWithoutContactNestedInput
  }

  export type ContactInfoUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    media?: MediaUncheckedUpdateManyWithoutContactNestedInput
  }

  export type MediaCreateWithoutContactInput = {
    id?: string
    url: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaUncheckedCreateWithoutContactInput = {
    id?: string
    url: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaCreateOrConnectWithoutContactInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutContactInput, MediaUncheckedCreateWithoutContactInput>
  }

  export type MediaCreateManyContactInputEnvelope = {
    data: MediaCreateManyContactInput | MediaCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type LocationCreateWithoutContactInput = {
    id?: string
    name?: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUncheckedCreateWithoutContactInput = {
    id?: string
    name?: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationCreateOrConnectWithoutContactInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutContactInput, LocationUncheckedCreateWithoutContactInput>
  }

  export type LocationCreateManyContactInputEnvelope = {
    data: LocationCreateManyContactInput | LocationCreateManyContactInput[]
    skipDuplicates?: boolean
  }

  export type MediaUpsertWithWhereUniqueWithoutContactInput = {
    where: MediaWhereUniqueInput
    update: XOR<MediaUpdateWithoutContactInput, MediaUncheckedUpdateWithoutContactInput>
    create: XOR<MediaCreateWithoutContactInput, MediaUncheckedCreateWithoutContactInput>
  }

  export type MediaUpdateWithWhereUniqueWithoutContactInput = {
    where: MediaWhereUniqueInput
    data: XOR<MediaUpdateWithoutContactInput, MediaUncheckedUpdateWithoutContactInput>
  }

  export type MediaUpdateManyWithWhereWithoutContactInput = {
    where: MediaScalarWhereInput
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyWithoutContactInput>
  }

  export type MediaScalarWhereInput = {
    AND?: MediaScalarWhereInput | MediaScalarWhereInput[]
    OR?: MediaScalarWhereInput[]
    NOT?: MediaScalarWhereInput | MediaScalarWhereInput[]
    id?: StringFilter<"Media"> | string
    url?: StringFilter<"Media"> | string
    name?: StringFilter<"Media"> | string
    contactId?: StringFilter<"Media"> | string
    createdAt?: DateTimeFilter<"Media"> | Date | string
    updatedAt?: DateTimeFilter<"Media"> | Date | string
  }

  export type LocationUpsertWithWhereUniqueWithoutContactInput = {
    where: LocationWhereUniqueInput
    update: XOR<LocationUpdateWithoutContactInput, LocationUncheckedUpdateWithoutContactInput>
    create: XOR<LocationCreateWithoutContactInput, LocationUncheckedCreateWithoutContactInput>
  }

  export type LocationUpdateWithWhereUniqueWithoutContactInput = {
    where: LocationWhereUniqueInput
    data: XOR<LocationUpdateWithoutContactInput, LocationUncheckedUpdateWithoutContactInput>
  }

  export type LocationUpdateManyWithWhereWithoutContactInput = {
    where: LocationScalarWhereInput
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyWithoutContactInput>
  }

  export type LocationScalarWhereInput = {
    AND?: LocationScalarWhereInput | LocationScalarWhereInput[]
    OR?: LocationScalarWhereInput[]
    NOT?: LocationScalarWhereInput | LocationScalarWhereInput[]
    id?: StringFilter<"Location"> | string
    name?: StringNullableFilter<"Location"> | string | null
    address?: StringFilter<"Location"> | string
    googleMapsUrl?: StringFilter<"Location"> | string
    openingHours?: StringFilter<"Location"> | string
    contactId?: StringFilter<"Location"> | string
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
  }

  export type ContactInfoCreateWithoutMediaInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationCreateNestedManyWithoutContactInput
  }

  export type ContactInfoUncheckedCreateWithoutMediaInput = {
    id: string
    phone: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    locations?: LocationUncheckedCreateNestedManyWithoutContactInput
  }

  export type ContactInfoCreateOrConnectWithoutMediaInput = {
    where: ContactInfoWhereUniqueInput
    create: XOR<ContactInfoCreateWithoutMediaInput, ContactInfoUncheckedCreateWithoutMediaInput>
  }

  export type ContactInfoUpsertWithoutMediaInput = {
    update: XOR<ContactInfoUpdateWithoutMediaInput, ContactInfoUncheckedUpdateWithoutMediaInput>
    create: XOR<ContactInfoCreateWithoutMediaInput, ContactInfoUncheckedCreateWithoutMediaInput>
    where?: ContactInfoWhereInput
  }

  export type ContactInfoUpdateToOneWithWhereWithoutMediaInput = {
    where?: ContactInfoWhereInput
    data: XOR<ContactInfoUpdateWithoutMediaInput, ContactInfoUncheckedUpdateWithoutMediaInput>
  }

  export type ContactInfoUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUpdateManyWithoutContactNestedInput
  }

  export type ContactInfoUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUncheckedUpdateManyWithoutContactNestedInput
  }

  export type BlogItemCreateWithoutImagesInput = {
    id?: string
    title: string
    shortDescription: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BlogItemUncheckedCreateWithoutImagesInput = {
    id?: string
    title: string
    shortDescription: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BlogItemCreateOrConnectWithoutImagesInput = {
    where: BlogItemWhereUniqueInput
    create: XOR<BlogItemCreateWithoutImagesInput, BlogItemUncheckedCreateWithoutImagesInput>
  }

  export type BlogItemUpsertWithoutImagesInput = {
    update: XOR<BlogItemUpdateWithoutImagesInput, BlogItemUncheckedUpdateWithoutImagesInput>
    create: XOR<BlogItemCreateWithoutImagesInput, BlogItemUncheckedCreateWithoutImagesInput>
    where?: BlogItemWhereInput
  }

  export type BlogItemUpdateToOneWithWhereWithoutImagesInput = {
    where?: BlogItemWhereInput
    data: XOR<BlogItemUpdateWithoutImagesInput, BlogItemUncheckedUpdateWithoutImagesInput>
  }

  export type BlogItemUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    shortDescription?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BlogItemUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    shortDescription?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesCreateWithoutArticleInput = {
    id?: string
    imgUrl: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleImagesUncheckedCreateWithoutArticleInput = {
    id?: string
    imgUrl: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleImagesCreateOrConnectWithoutArticleInput = {
    where: ArticleImagesWhereUniqueInput
    create: XOR<ArticleImagesCreateWithoutArticleInput, ArticleImagesUncheckedCreateWithoutArticleInput>
  }

  export type ArticleImagesCreateManyArticleInputEnvelope = {
    data: ArticleImagesCreateManyArticleInput | ArticleImagesCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type ArticleImagesUpsertWithWhereUniqueWithoutArticleInput = {
    where: ArticleImagesWhereUniqueInput
    update: XOR<ArticleImagesUpdateWithoutArticleInput, ArticleImagesUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleImagesCreateWithoutArticleInput, ArticleImagesUncheckedCreateWithoutArticleInput>
  }

  export type ArticleImagesUpdateWithWhereUniqueWithoutArticleInput = {
    where: ArticleImagesWhereUniqueInput
    data: XOR<ArticleImagesUpdateWithoutArticleInput, ArticleImagesUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleImagesUpdateManyWithWhereWithoutArticleInput = {
    where: ArticleImagesScalarWhereInput
    data: XOR<ArticleImagesUpdateManyMutationInput, ArticleImagesUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleImagesScalarWhereInput = {
    AND?: ArticleImagesScalarWhereInput | ArticleImagesScalarWhereInput[]
    OR?: ArticleImagesScalarWhereInput[]
    NOT?: ArticleImagesScalarWhereInput | ArticleImagesScalarWhereInput[]
    id?: StringFilter<"ArticleImages"> | string
    imgUrl?: StringFilter<"ArticleImages"> | string
    articleId?: StringFilter<"ArticleImages"> | string
    createdAt?: DateTimeFilter<"ArticleImages"> | Date | string
    updatedAt?: DateTimeFilter<"ArticleImages"> | Date | string
  }

  export type ProductCreateManyCategoryInput = {
    id?: string
    name: string
    description: string
    price: number
    isSeasonal: boolean
    isActive?: boolean | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImagesUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: ProductImagesUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    isSeasonal?: BoolFieldUpdateOperationsInput | boolean
    isActive?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImagesCreateManyProductInput = {
    id?: string
    imgUrl: string
  }

  export type ProductImagesUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
  }

  export type ProductImagesUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
  }

  export type ProductImagesUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
  }

  export type MediaCreateManyContactInput = {
    id?: string
    url: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationCreateManyContactInput = {
    id?: string
    name?: string | null
    address: string
    googleMapsUrl: string
    openingHours: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateManyWithoutContactInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    googleMapsUrl?: StringFieldUpdateOperationsInput | string
    openingHours?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesCreateManyArticleInput = {
    id?: string
    imgUrl: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleImagesUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleImagesUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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