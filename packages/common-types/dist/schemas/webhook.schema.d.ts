/**
 * Webhook Zod Schemas
 * Defines validation schemas for webhook-related API endpoints
 */
import { z } from "zod";
export declare const WebhookVerificationQuerySchema: z.ZodObject<
  {
    "hub.mode": z.ZodLiteral<"subscribe">;
    "hub.verify_token": z.ZodString;
    "hub.challenge": z.ZodString;
  },
  z.core.$strip
>;
export declare const WebhookCommentValueSchema: z.ZodObject<
  {
    id: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    media: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
        },
        z.core.$strip
      >
    >;
    media_id: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<
      z.ZodObject<
        {
          id: z.ZodString;
          username: z.ZodOptional<z.ZodString>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const WebhookChangeSchema: z.ZodObject<
  {
    field: z.ZodString;
    value: z.ZodObject<
      {
        "~standard": z.ZodStandardSchemaWithJSON<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        shape: {
          id: z.ZodString;
          text: z.ZodOptional<z.ZodString>;
          media: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
              },
              z.core.$strip
            >
          >;
          media_id: z.ZodOptional<z.ZodString>;
          from: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
                username: z.ZodOptional<z.ZodString>;
              },
              z.core.$strip
            >
          >;
        };
        keyof: () => z.ZodEnum<{
          id: "id";
          text: "text";
          from: "from";
          media: "media";
          media_id: "media_id";
        }>;
        catchall: <T extends z.core.SomeType>(
          schema: T,
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$catchall<T>
        >;
        passthrough: () => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$loose
        >;
        loose: () => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$loose
        >;
        strict: () => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strict
        >;
        strip: () => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        extend: <U extends z.core.$ZodLooseShape>(
          shape: U,
        ) => z.ZodObject<
          (
            ("id" | "text" | "from" | "media" | "media_id") &
              keyof U extends never
              ? {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                } & U
              : ({
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                } extends infer T_1 extends z.core.util.SomeObject
                  ? {
                      [K in keyof T_1 as K extends keyof U ? never : K]: T_1[K];
                    }
                  : never) & { [K_1 in keyof U]: U[K_1] }
          ) extends infer T
            ? { [k in keyof T]: T[k] }
            : never,
          z.core.$strip
        >;
        safeExtend: <U extends z.core.$ZodLooseShape>(
          shape: z.SafeExtendShape<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            U
          > &
            Partial<
              Record<
                "id" | "text" | "from" | "media" | "media_id",
                z.core.SomeType
              >
            >,
        ) => z.ZodObject<
          (
            ("id" | "text" | "from" | "media" | "media_id") &
              keyof U extends never
              ? {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                } & U
              : ({
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                } extends infer T_1 extends z.core.util.SomeObject
                  ? {
                      [K in keyof T_1 as K extends keyof U ? never : K]: T_1[K];
                    }
                  : never) & { [K_1 in keyof U]: U[K_1] }
          ) extends infer T
            ? { [k in keyof T]: T[k] }
            : never,
          z.core.$strip
        >;
        merge: <U extends z.ZodObject>(
          other: U,
        ) => z.ZodObject<
          (
            ("id" | "text" | "from" | "media" | "media_id") &
              keyof U["shape"] extends never
              ? {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                } & U["shape"]
              : ({
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                } extends infer T_1 extends z.core.util.SomeObject
                  ? {
                      [K in keyof T_1 as K extends keyof U["shape"]
                        ? never
                        : K]: T_1[K];
                    }
                  : never) &
                  (U["shape"] extends infer T_2 extends z.core.util.SomeObject
                    ? { [K_1 in keyof T_2]: T_2[K_1] }
                    : never)
          ) extends infer T
            ? { [k in keyof T]: T[k] }
            : never,
          U["_zod"]["config"]
        >;
        pick: <
          M extends z.core.util.Mask<
            "id" | "text" | "from" | "media" | "media_id"
          >,
        >(
          mask: M &
            Record<
              Exclude<keyof M, "id" | "text" | "from" | "media" | "media_id">,
              never
            >,
        ) => z.ZodObject<
          Pick<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            | Extract<"id", keyof M>
            | Extract<"text", keyof M>
            | Extract<"from", keyof M>
            | Extract<"media", keyof M>
            | Extract<"media_id", keyof M>
          > extends infer T
            ? { [k in keyof T]: T[k] }
            : never,
          z.core.$strip
        >;
        omit: <
          M extends z.core.util.Mask<
            "id" | "text" | "from" | "media" | "media_id"
          >,
        >(
          mask: M &
            Record<
              Exclude<keyof M, "id" | "text" | "from" | "media" | "media_id">,
              never
            >,
        ) => z.ZodObject<
          Omit<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            | Extract<"id", keyof M>
            | Extract<"text", keyof M>
            | Extract<"from", keyof M>
            | Extract<"media", keyof M>
            | Extract<"media_id", keyof M>
          > extends infer T
            ? { [k in keyof T]: T[k] }
            : never,
          z.core.$strip
        >;
        partial: {
          (): z.ZodObject<
            {
              id: z.ZodOptional<z.ZodString>;
              text: z.ZodOptional<z.ZodOptional<z.ZodString>>;
              media: z.ZodOptional<
                z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >
              >;
              media_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
              from: z.ZodOptional<
                z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >
              >;
            },
            z.core.$strip
          >;
          <
            M extends z.core.util.Mask<
              "id" | "text" | "from" | "media" | "media_id"
            >,
          >(
            mask: M &
              Record<
                Exclude<keyof M, "id" | "text" | "from" | "media" | "media_id">,
                never
              >,
          ): z.ZodObject<
            {
              id: "id" extends infer T
                ? T extends "id"
                  ? T extends keyof M
                    ? z.ZodOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T]
                  : never
                : never;
              text: "text" extends infer T_1
                ? T_1 extends "text"
                  ? T_1 extends keyof M
                    ? z.ZodOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_1]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_1]
                  : never
                : never;
              media: "media" extends infer T_2
                ? T_2 extends "media"
                  ? T_2 extends keyof M
                    ? z.ZodOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_2]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_2]
                  : never
                : never;
              media_id: "media_id" extends infer T_3
                ? T_3 extends "media_id"
                  ? T_3 extends keyof M
                    ? z.ZodOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_3]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_3]
                  : never
                : never;
              from: "from" extends infer T_4
                ? T_4 extends "from"
                  ? T_4 extends keyof M
                    ? z.ZodOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_4]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_4]
                  : never
                : never;
            },
            z.core.$strip
          >;
        };
        required: {
          (): z.ZodObject<
            {
              id: z.ZodNonOptional<z.ZodString>;
              text: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
              media: z.ZodNonOptional<
                z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >
              >;
              media_id: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
              from: z.ZodNonOptional<
                z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >
              >;
            },
            z.core.$strip
          >;
          <
            M extends z.core.util.Mask<
              "id" | "text" | "from" | "media" | "media_id"
            >,
          >(
            mask: M &
              Record<
                Exclude<keyof M, "id" | "text" | "from" | "media" | "media_id">,
                never
              >,
          ): z.ZodObject<
            {
              id: "id" extends infer T
                ? T extends "id"
                  ? T extends keyof M
                    ? z.ZodNonOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T]
                  : never
                : never;
              text: "text" extends infer T_1
                ? T_1 extends "text"
                  ? T_1 extends keyof M
                    ? z.ZodNonOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_1]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_1]
                  : never
                : never;
              media: "media" extends infer T_2
                ? T_2 extends "media"
                  ? T_2 extends keyof M
                    ? z.ZodNonOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_2]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_2]
                  : never
                : never;
              media_id: "media_id" extends infer T_3
                ? T_3 extends "media_id"
                  ? T_3 extends keyof M
                    ? z.ZodNonOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_3]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_3]
                  : never
                : never;
              from: "from" extends infer T_4
                ? T_4 extends "from"
                  ? T_4 extends keyof M
                    ? z.ZodNonOptional<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }[T_4]
                      >
                    : {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      }[T_4]
                  : never
                : never;
            },
            z.core.$strip
          >;
        };
        def: z.core.$ZodObjectDef<{
          id: z.ZodString;
          text: z.ZodOptional<z.ZodString>;
          media: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
              },
              z.core.$strip
            >
          >;
          media_id: z.ZodOptional<z.ZodString>;
          from: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
                username: z.ZodOptional<z.ZodString>;
              },
              z.core.$strip
            >
          >;
        }>;
        type: "object";
        _def: z.core.$ZodObjectDef<{
          id: z.ZodString;
          text: z.ZodOptional<z.ZodString>;
          media: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
              },
              z.core.$strip
            >
          >;
          media_id: z.ZodOptional<z.ZodString>;
          from: z.ZodOptional<
            z.ZodObject<
              {
                id: z.ZodString;
                username: z.ZodOptional<z.ZodString>;
              },
              z.core.$strip
            >
          >;
        }>;
        _output: {
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        };
        _input: {
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        };
        toJSONSchema: (
          params?: z.core.ToJSONSchemaParams,
        ) => z.core.ZodStandardJSONSchemaPayload<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        check: (
          ...checks: (
            | z.core.CheckFn<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>
            | z.core.$ZodCheck<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>
          )[]
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        with: (
          ...checks: (
            | z.core.CheckFn<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>
            | z.core.$ZodCheck<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>
          )[]
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        clone: (
          def?:
            | z.core.$ZodObjectDef<{
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              }>
            | undefined,
          params?:
            | {
                parent: boolean;
              }
            | undefined,
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        register: <R extends z.core.$ZodRegistry>(
          registry: R,
          ...meta: z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          > extends infer T
            ? T extends z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >
              ? T extends R["_schema"]
                ? undefined extends R["_meta"]
                  ? [
                      (
                        | z.core.$replace<
                            R["_meta"],
                            R["_schema"] &
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                },
                                z.core.$strip
                              >
                          >
                        | undefined
                      )?,
                    ]
                  : [
                      z.core.$replace<
                        R["_meta"],
                        R["_schema"] &
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                      >,
                    ]
                : ["Incompatible schema"]
              : never
            : never
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        brand: <
          T extends PropertyKey = PropertyKey,
          Dir extends "in" | "out" | "inout" = "out",
        >(
          value?: T | undefined,
        ) => PropertyKey extends T
          ? z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          : z.core.$ZodBranded<
              z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >,
              T,
              Dir
            >;
        parse: (
          data: unknown,
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => {
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        };
        safeParse: (
          data: unknown,
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => z.ZodSafeParseResult<{
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        }>;
        parseAsync: (
          data: unknown,
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<{
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        }>;
        safeParseAsync: (
          data: unknown,
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<
          z.ZodSafeParseResult<{
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }>
        >;
        spa: (
          data: unknown,
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<
          z.ZodSafeParseResult<{
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }>
        >;
        encode: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => {
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        };
        decode: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => {
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        };
        encodeAsync: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<{
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        }>;
        decodeAsync: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<{
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        }>;
        safeEncode: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => z.ZodSafeParseResult<{
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        }>;
        safeDecode: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => z.ZodSafeParseResult<{
          id: string;
          text?: string | undefined;
          media?:
            | {
                id: string;
              }
            | undefined;
          media_id?: string | undefined;
          from?:
            | {
                id: string;
                username?: string | undefined;
              }
            | undefined;
        }>;
        safeEncodeAsync: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<
          z.ZodSafeParseResult<{
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }>
        >;
        safeDecodeAsync: (
          data: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
          params?: z.core.ParseContext<z.core.$ZodIssue>,
        ) => Promise<
          z.ZodSafeParseResult<{
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }>
        >;
        refine: <
          Ch extends (arg: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }) => unknown | Promise<unknown>,
        >(
          check: Ch,
          params?:
            | string
            | {
                abort?: boolean | undefined | undefined;
                when?:
                  | ((payload: z.core.ParsePayload) => boolean)
                  | undefined
                  | undefined;
                path?: PropertyKey[] | undefined | undefined;
                params?: Record<string, any> | undefined;
                error?:
                  | string
                  | z.core.$ZodErrorMap<NonNullable<z.core.$ZodIssue>>
                  | undefined;
                message?: string | undefined | undefined;
              }
            | undefined,
        ) => Ch extends (arg: any) => arg is infer R
          ? z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            > &
              z.ZodType<
                R,
                {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                z.core.$ZodTypeInternals<
                  R,
                  {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }
                >
              >
          : z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >;
        superRefine: (
          refinement: (
            arg: {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            },
            ctx: z.core.$RefinementCtx<{
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            }>,
          ) => void | Promise<void>,
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        overwrite: (
          fn: (x: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }) => {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          },
        ) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        optional: () => z.ZodOptional<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        exactOptional: () => z.ZodExactOptional<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        nonoptional: (
          params?: string | z.core.$ZodNonOptionalParams,
        ) => z.ZodNonOptional<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        nullable: () => z.ZodNullable<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        nullish: () => z.ZodOptional<
          z.ZodNullable<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >
        >;
        default: {
          (def: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }): z.ZodDefault<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
          (
            def: () => {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            },
          ): z.ZodDefault<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
        };
        prefault: {
          (
            def: () => {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            },
          ): z.ZodPrefault<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
          (def: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }): z.ZodPrefault<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
        };
        array: () => z.ZodArray<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        or: <T extends z.core.SomeType>(
          option: T,
        ) => z.ZodUnion<
          [
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >,
            T,
          ]
        >;
        and: <T extends z.core.SomeType>(
          incoming: T,
        ) => z.ZodIntersection<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >,
          T
        >;
        transform: <NewOut>(
          transform: (
            arg: {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            },
            ctx: z.core.$RefinementCtx<{
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            }>,
          ) => NewOut | Promise<NewOut>,
        ) => z.ZodPipe<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >,
          z.ZodTransform<
            Awaited<NewOut>,
            {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            }
          >
        >;
        catch: {
          (def: {
            id: string;
            text?: string | undefined;
            media?:
              | {
                  id: string;
                }
              | undefined;
            media_id?: string | undefined;
            from?:
              | {
                  id: string;
                  username?: string | undefined;
                }
              | undefined;
          }): z.ZodCatch<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
          (
            def: (ctx: z.core.$ZodCatchCtx) => {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            },
          ): z.ZodCatch<
            z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
        };
        pipe: <
          T extends z.core.$ZodType<
            any,
            {
              id: string;
              text?: string | undefined;
              media?:
                | {
                    id: string;
                  }
                | undefined;
              media_id?: string | undefined;
              from?:
                | {
                    id: string;
                    username?: string | undefined;
                  }
                | undefined;
            },
            z.core.$ZodTypeInternals<
              any,
              {
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }
            >
          >,
        >(
          target:
            | T
            | z.core.$ZodType<
                any,
                {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                z.core.$ZodTypeInternals<
                  any,
                  {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }
                >
              >,
        ) => z.ZodPipe<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >,
          T
        >;
        readonly: () => z.ZodReadonly<
          z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
        describe: (description: string) => z.ZodObject<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
        description?: string | undefined;
        meta: {
          ():
            | {
                [x: string]: unknown;
                id?: string | undefined | undefined;
                title?: string | undefined | undefined;
                description?: string | undefined | undefined;
                deprecated?: boolean | undefined | undefined;
              }
            | undefined;
          (data: {
            [x: string]: unknown;
            id?: string | undefined | undefined;
            title?: string | undefined | undefined;
            description?: string | undefined | undefined;
            deprecated?: boolean | undefined | undefined;
          }): z.ZodObject<
            {
              id: z.ZodString;
              text: z.ZodOptional<z.ZodString>;
              media: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
              media_id: z.ZodOptional<z.ZodString>;
              from: z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    username: z.ZodOptional<z.ZodString>;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >;
        };
        isOptional: () => boolean;
        isNullable: () => boolean;
        apply: <T>(
          fn: (
            schema: z.ZodObject<
              {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >,
          ) => T,
        ) => T;
        _zod: z.core.$ZodObjectInternals<
          {
            id: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            media: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >
            >;
            media_id: z.ZodOptional<z.ZodString>;
            from: z.ZodOptional<
              z.ZodObject<
                {
                  id: z.ZodString;
                  username: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >;
          },
          z.core.$strip
        >;
      },
      z.core.$strip
    >;
  },
  z.core.$strip
>;
export declare const WebhookMessagingEventSchema: z.ZodObject<
  {
    sender: z.ZodObject<
      {
        id: z.ZodString;
      },
      z.core.$strip
    >;
    recipient: z.ZodObject<
      {
        id: z.ZodString;
      },
      z.core.$strip
    >;
    timestamp: z.ZodNumber;
    message: z.ZodOptional<
      z.ZodObject<
        {
          mid: z.ZodString;
          text: z.ZodString;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const WebhookEntryOfPostsSchema: z.ZodObject<
  {
    id: z.ZodOptional<z.ZodString>;
    time: z.ZodNumber;
    changes: z.ZodArray<
      z.ZodObject<
        {
          field: z.ZodString;
          value: z.ZodObject<
            {
              "~standard": z.ZodStandardSchemaWithJSON<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              shape: {
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              };
              keyof: () => z.ZodEnum<{
                id: "id";
                text: "text";
                from: "from";
                media: "media";
                media_id: "media_id";
              }>;
              catchall: <T extends z.core.SomeType>(
                schema: T,
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$catchall<T>
              >;
              passthrough: () => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$loose
              >;
              loose: () => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$loose
              >;
              strict: () => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strict
              >;
              strip: () => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              extend: <U extends z.core.$ZodLooseShape>(
                shape: U,
              ) => z.ZodObject<
                (
                  ("id" | "text" | "from" | "media" | "media_id") &
                    keyof U extends never
                    ? {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      } & U
                    : ({
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      } extends infer T_1 extends z.core.util.SomeObject
                        ? {
                            [K in keyof T_1 as K extends keyof U
                              ? never
                              : K]: T_1[K];
                          }
                        : never) & { [K_1 in keyof U]: U[K_1] }
                ) extends infer T
                  ? { [k in keyof T]: T[k] }
                  : never,
                z.core.$strip
              >;
              safeExtend: <U extends z.core.$ZodLooseShape>(
                shape: z.SafeExtendShape<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  U
                > &
                  Partial<
                    Record<
                      "id" | "text" | "from" | "media" | "media_id",
                      z.core.SomeType
                    >
                  >,
              ) => z.ZodObject<
                (
                  ("id" | "text" | "from" | "media" | "media_id") &
                    keyof U extends never
                    ? {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      } & U
                    : ({
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      } extends infer T_1 extends z.core.util.SomeObject
                        ? {
                            [K in keyof T_1 as K extends keyof U
                              ? never
                              : K]: T_1[K];
                          }
                        : never) & { [K_1 in keyof U]: U[K_1] }
                ) extends infer T
                  ? { [k in keyof T]: T[k] }
                  : never,
                z.core.$strip
              >;
              merge: <U extends z.ZodObject>(
                other: U,
              ) => z.ZodObject<
                (
                  ("id" | "text" | "from" | "media" | "media_id") &
                    keyof U["shape"] extends never
                    ? {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      } & U["shape"]
                    : ({
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      } extends infer T_1 extends z.core.util.SomeObject
                        ? {
                            [K in keyof T_1 as K extends keyof U["shape"]
                              ? never
                              : K]: T_1[K];
                          }
                        : never) &
                        (U["shape"] extends infer T_2 extends
                          z.core.util.SomeObject
                          ? { [K_1 in keyof T_2]: T_2[K_1] }
                          : never)
                ) extends infer T
                  ? { [k in keyof T]: T[k] }
                  : never,
                U["_zod"]["config"]
              >;
              pick: <
                M extends z.core.util.Mask<
                  "id" | "text" | "from" | "media" | "media_id"
                >,
              >(
                mask: M &
                  Record<
                    Exclude<
                      keyof M,
                      "id" | "text" | "from" | "media" | "media_id"
                    >,
                    never
                  >,
              ) => z.ZodObject<
                Pick<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  | Extract<"id", keyof M>
                  | Extract<"text", keyof M>
                  | Extract<"from", keyof M>
                  | Extract<"media", keyof M>
                  | Extract<"media_id", keyof M>
                > extends infer T
                  ? { [k in keyof T]: T[k] }
                  : never,
                z.core.$strip
              >;
              omit: <
                M extends z.core.util.Mask<
                  "id" | "text" | "from" | "media" | "media_id"
                >,
              >(
                mask: M &
                  Record<
                    Exclude<
                      keyof M,
                      "id" | "text" | "from" | "media" | "media_id"
                    >,
                    never
                  >,
              ) => z.ZodObject<
                Omit<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  | Extract<"id", keyof M>
                  | Extract<"text", keyof M>
                  | Extract<"from", keyof M>
                  | Extract<"media", keyof M>
                  | Extract<"media_id", keyof M>
                > extends infer T
                  ? { [k in keyof T]: T[k] }
                  : never,
                z.core.$strip
              >;
              partial: {
                (): z.ZodObject<
                  {
                    id: z.ZodOptional<z.ZodString>;
                    text: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                    media: z.ZodOptional<
                      z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                    from: z.ZodOptional<
                      z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >
                    >;
                  },
                  z.core.$strip
                >;
                <
                  M extends z.core.util.Mask<
                    "id" | "text" | "from" | "media" | "media_id"
                  >,
                >(
                  mask: M &
                    Record<
                      Exclude<
                        keyof M,
                        "id" | "text" | "from" | "media" | "media_id"
                      >,
                      never
                    >,
                ): z.ZodObject<
                  {
                    id: "id" extends infer T
                      ? T extends "id"
                        ? T extends keyof M
                          ? z.ZodOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T]
                        : never
                      : never;
                    text: "text" extends infer T_1
                      ? T_1 extends "text"
                        ? T_1 extends keyof M
                          ? z.ZodOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_1]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_1]
                        : never
                      : never;
                    media: "media" extends infer T_2
                      ? T_2 extends "media"
                        ? T_2 extends keyof M
                          ? z.ZodOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_2]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_2]
                        : never
                      : never;
                    media_id: "media_id" extends infer T_3
                      ? T_3 extends "media_id"
                        ? T_3 extends keyof M
                          ? z.ZodOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_3]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_3]
                        : never
                      : never;
                    from: "from" extends infer T_4
                      ? T_4 extends "from"
                        ? T_4 extends keyof M
                          ? z.ZodOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_4]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_4]
                        : never
                      : never;
                  },
                  z.core.$strip
                >;
              };
              required: {
                (): z.ZodObject<
                  {
                    id: z.ZodNonOptional<z.ZodString>;
                    text: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
                    media: z.ZodNonOptional<
                      z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >
                    >;
                    media_id: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
                    from: z.ZodNonOptional<
                      z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >
                    >;
                  },
                  z.core.$strip
                >;
                <
                  M extends z.core.util.Mask<
                    "id" | "text" | "from" | "media" | "media_id"
                  >,
                >(
                  mask: M &
                    Record<
                      Exclude<
                        keyof M,
                        "id" | "text" | "from" | "media" | "media_id"
                      >,
                      never
                    >,
                ): z.ZodObject<
                  {
                    id: "id" extends infer T
                      ? T extends "id"
                        ? T extends keyof M
                          ? z.ZodNonOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T]
                        : never
                      : never;
                    text: "text" extends infer T_1
                      ? T_1 extends "text"
                        ? T_1 extends keyof M
                          ? z.ZodNonOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_1]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_1]
                        : never
                      : never;
                    media: "media" extends infer T_2
                      ? T_2 extends "media"
                        ? T_2 extends keyof M
                          ? z.ZodNonOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_2]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_2]
                        : never
                      : never;
                    media_id: "media_id" extends infer T_3
                      ? T_3 extends "media_id"
                        ? T_3 extends keyof M
                          ? z.ZodNonOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_3]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_3]
                        : never
                      : never;
                    from: "from" extends infer T_4
                      ? T_4 extends "from"
                        ? T_4 extends keyof M
                          ? z.ZodNonOptional<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }[T_4]
                            >
                          : {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            }[T_4]
                        : never
                      : never;
                  },
                  z.core.$strip
                >;
              };
              def: z.core.$ZodObjectDef<{
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              }>;
              type: "object";
              _def: z.core.$ZodObjectDef<{
                id: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                media: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
                media_id: z.ZodOptional<z.ZodString>;
                from: z.ZodOptional<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      username: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$strip
                  >
                >;
              }>;
              _output: {
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              };
              _input: {
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              };
              toJSONSchema: (
                params?: z.core.ToJSONSchemaParams,
              ) => z.core.ZodStandardJSONSchemaPayload<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              check: (
                ...checks: (
                  | z.core.CheckFn<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                  | z.core.$ZodCheck<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                )[]
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              with: (
                ...checks: (
                  | z.core.CheckFn<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                  | z.core.$ZodCheck<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                )[]
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              clone: (
                def?:
                  | z.core.$ZodObjectDef<{
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    }>
                  | undefined,
                params?:
                  | {
                      parent: boolean;
                    }
                  | undefined,
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              register: <R extends z.core.$ZodRegistry>(
                registry: R,
                ...meta: z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                > extends infer T
                  ? T extends z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                    ? T extends R["_schema"]
                      ? undefined extends R["_meta"]
                        ? [
                            (
                              | z.core.$replace<
                                  R["_meta"],
                                  R["_schema"] &
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      },
                                      z.core.$strip
                                    >
                                >
                              | undefined
                            )?,
                          ]
                        : [
                            z.core.$replace<
                              R["_meta"],
                              R["_schema"] &
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  },
                                  z.core.$strip
                                >
                            >,
                          ]
                      : ["Incompatible schema"]
                    : never
                  : never
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              brand: <
                T extends PropertyKey = PropertyKey,
                Dir extends "in" | "out" | "inout" = "out",
              >(
                value?: T | undefined,
              ) => PropertyKey extends T
                ? z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                : z.core.$ZodBranded<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >,
                    T,
                    Dir
                  >;
              parse: (
                data: unknown,
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => {
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              };
              safeParse: (
                data: unknown,
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => z.ZodSafeParseResult<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>;
              parseAsync: (
                data: unknown,
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>;
              safeParseAsync: (
                data: unknown,
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<
                z.ZodSafeParseResult<{
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }>
              >;
              spa: (
                data: unknown,
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<
                z.ZodSafeParseResult<{
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }>
              >;
              encode: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => {
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              };
              decode: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => {
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              };
              encodeAsync: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>;
              decodeAsync: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>;
              safeEncode: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => z.ZodSafeParseResult<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>;
              safeDecode: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => z.ZodSafeParseResult<{
                id: string;
                text?: string | undefined;
                media?:
                  | {
                      id: string;
                    }
                  | undefined;
                media_id?: string | undefined;
                from?:
                  | {
                      id: string;
                      username?: string | undefined;
                    }
                  | undefined;
              }>;
              safeEncodeAsync: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<
                z.ZodSafeParseResult<{
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }>
              >;
              safeDecodeAsync: (
                data: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
                params?: z.core.ParseContext<z.core.$ZodIssue>,
              ) => Promise<
                z.ZodSafeParseResult<{
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }>
              >;
              refine: <
                Ch extends (arg: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }) => unknown | Promise<unknown>,
              >(
                check: Ch,
                params?:
                  | string
                  | {
                      abort?: boolean | undefined | undefined;
                      when?:
                        | ((payload: z.core.ParsePayload) => boolean)
                        | undefined
                        | undefined;
                      path?: PropertyKey[] | undefined | undefined;
                      params?: Record<string, any> | undefined;
                      error?:
                        | string
                        | z.core.$ZodErrorMap<NonNullable<z.core.$ZodIssue>>
                        | undefined;
                      message?: string | undefined | undefined;
                    }
                  | undefined,
              ) => Ch extends (arg: any) => arg is infer R
                ? z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  > &
                    z.ZodType<
                      R,
                      {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      z.core.$ZodTypeInternals<
                        R,
                        {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }
                      >
                    >
                : z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
              superRefine: (
                refinement: (
                  arg: {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  },
                  ctx: z.core.$RefinementCtx<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>,
                ) => void | Promise<void>,
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              overwrite: (
                fn: (x: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }) => {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                },
              ) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              optional: () => z.ZodOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              exactOptional: () => z.ZodExactOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              nonoptional: (
                params?: string | z.core.$ZodNonOptionalParams,
              ) => z.ZodNonOptional<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              nullable: () => z.ZodNullable<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              nullish: () => z.ZodOptional<
                z.ZodNullable<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >
              >;
              default: {
                (def: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }): z.ZodDefault<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >;
                (
                  def: () => {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  },
                ): z.ZodDefault<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >;
              };
              prefault: {
                (
                  def: () => {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  },
                ): z.ZodPrefault<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >;
                (def: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }): z.ZodPrefault<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >;
              };
              array: () => z.ZodArray<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              or: <T extends z.core.SomeType>(
                option: T,
              ) => z.ZodUnion<
                [
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >,
                  T,
                ]
              >;
              and: <T extends z.core.SomeType>(
                incoming: T,
              ) => z.ZodIntersection<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >,
                T
              >;
              transform: <NewOut>(
                transform: (
                  arg: {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  },
                  ctx: z.core.$RefinementCtx<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>,
                ) => NewOut | Promise<NewOut>,
              ) => z.ZodPipe<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >,
                z.ZodTransform<
                  Awaited<NewOut>,
                  {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }
                >
              >;
              catch: {
                (def: {
                  id: string;
                  text?: string | undefined;
                  media?:
                    | {
                        id: string;
                      }
                    | undefined;
                  media_id?: string | undefined;
                  from?:
                    | {
                        id: string;
                        username?: string | undefined;
                      }
                    | undefined;
                }): z.ZodCatch<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >;
                (
                  def: (ctx: z.core.$ZodCatchCtx) => {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  },
                ): z.ZodCatch<
                  z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >
                >;
              };
              pipe: <
                T extends z.core.$ZodType<
                  any,
                  {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  },
                  z.core.$ZodTypeInternals<
                    any,
                    {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }
                  >
                >,
              >(
                target:
                  | T
                  | z.core.$ZodType<
                      any,
                      {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      z.core.$ZodTypeInternals<
                        any,
                        {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }
                      >
                    >,
              ) => z.ZodPipe<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >,
                T
              >;
              readonly: () => z.ZodReadonly<
                z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
              describe: (description: string) => z.ZodObject<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
              description?: string | undefined;
              meta: {
                ():
                  | {
                      [x: string]: unknown;
                      id?: string | undefined | undefined;
                      title?: string | undefined | undefined;
                      description?: string | undefined | undefined;
                      deprecated?: boolean | undefined | undefined;
                    }
                  | undefined;
                (data: {
                  [x: string]: unknown;
                  id?: string | undefined | undefined;
                  title?: string | undefined | undefined;
                  description?: string | undefined | undefined;
                  deprecated?: boolean | undefined | undefined;
                }): z.ZodObject<
                  {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >;
              };
              isOptional: () => boolean;
              isNullable: () => boolean;
              apply: <T>(
                fn: (
                  schema: z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >,
                ) => T,
              ) => T;
              _zod: z.core.$ZodObjectInternals<
                {
                  id: z.ZodString;
                  text: z.ZodOptional<z.ZodString>;
                  media: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >
                  >;
                  media_id: z.ZodOptional<z.ZodString>;
                  from: z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        username: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$strip
                    >
                  >;
                },
                z.core.$strip
              >;
            },
            z.core.$strip
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const WebhookPayloadOfPostsSchema: z.ZodObject<
  {
    object: z.ZodString;
    entry: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodOptional<z.ZodString>;
          time: z.ZodNumber;
          changes: z.ZodArray<
            z.ZodObject<
              {
                field: z.ZodString;
                value: z.ZodObject<
                  {
                    "~standard": z.ZodStandardSchemaWithJSON<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    shape: {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    };
                    keyof: () => z.ZodEnum<{
                      id: "id";
                      text: "text";
                      from: "from";
                      media: "media";
                      media_id: "media_id";
                    }>;
                    catchall: <T extends z.core.SomeType>(
                      schema: T,
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$catchall<T>
                    >;
                    passthrough: () => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$loose
                    >;
                    loose: () => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$loose
                    >;
                    strict: () => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strict
                    >;
                    strip: () => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    extend: <U extends z.core.$ZodLooseShape>(
                      shape: U,
                    ) => z.ZodObject<
                      (
                        ("id" | "text" | "from" | "media" | "media_id") &
                          keyof U extends never
                          ? {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            } & U
                          : ({
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            } extends infer T_1 extends z.core.util.SomeObject
                              ? {
                                  [K in keyof T_1 as K extends keyof U
                                    ? never
                                    : K]: T_1[K];
                                }
                              : never) & { [K_1 in keyof U]: U[K_1] }
                      ) extends infer T
                        ? { [k in keyof T]: T[k] }
                        : never,
                      z.core.$strip
                    >;
                    safeExtend: <U extends z.core.$ZodLooseShape>(
                      shape: z.SafeExtendShape<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        U
                      > &
                        Partial<
                          Record<
                            "id" | "text" | "from" | "media" | "media_id",
                            z.core.SomeType
                          >
                        >,
                    ) => z.ZodObject<
                      (
                        ("id" | "text" | "from" | "media" | "media_id") &
                          keyof U extends never
                          ? {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            } & U
                          : ({
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            } extends infer T_1 extends z.core.util.SomeObject
                              ? {
                                  [K in keyof T_1 as K extends keyof U
                                    ? never
                                    : K]: T_1[K];
                                }
                              : never) & { [K_1 in keyof U]: U[K_1] }
                      ) extends infer T
                        ? { [k in keyof T]: T[k] }
                        : never,
                      z.core.$strip
                    >;
                    merge: <U extends z.ZodObject>(
                      other: U,
                    ) => z.ZodObject<
                      (
                        ("id" | "text" | "from" | "media" | "media_id") &
                          keyof U["shape"] extends never
                          ? {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            } & U["shape"]
                          : ({
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            } extends infer T_1 extends z.core.util.SomeObject
                              ? {
                                  [K in keyof T_1 as K extends keyof U["shape"]
                                    ? never
                                    : K]: T_1[K];
                                }
                              : never) &
                              (U["shape"] extends infer T_2 extends
                                z.core.util.SomeObject
                                ? { [K_1 in keyof T_2]: T_2[K_1] }
                                : never)
                      ) extends infer T
                        ? { [k in keyof T]: T[k] }
                        : never,
                      U["_zod"]["config"]
                    >;
                    pick: <
                      M extends z.core.util.Mask<
                        "id" | "text" | "from" | "media" | "media_id"
                      >,
                    >(
                      mask: M &
                        Record<
                          Exclude<
                            keyof M,
                            "id" | "text" | "from" | "media" | "media_id"
                          >,
                          never
                        >,
                    ) => z.ZodObject<
                      Pick<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        | Extract<"id", keyof M>
                        | Extract<"text", keyof M>
                        | Extract<"from", keyof M>
                        | Extract<"media", keyof M>
                        | Extract<"media_id", keyof M>
                      > extends infer T
                        ? { [k in keyof T]: T[k] }
                        : never,
                      z.core.$strip
                    >;
                    omit: <
                      M extends z.core.util.Mask<
                        "id" | "text" | "from" | "media" | "media_id"
                      >,
                    >(
                      mask: M &
                        Record<
                          Exclude<
                            keyof M,
                            "id" | "text" | "from" | "media" | "media_id"
                          >,
                          never
                        >,
                    ) => z.ZodObject<
                      Omit<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        | Extract<"id", keyof M>
                        | Extract<"text", keyof M>
                        | Extract<"from", keyof M>
                        | Extract<"media", keyof M>
                        | Extract<"media_id", keyof M>
                      > extends infer T
                        ? { [k in keyof T]: T[k] }
                        : never,
                      z.core.$strip
                    >;
                    partial: {
                      (): z.ZodObject<
                        {
                          id: z.ZodOptional<z.ZodString>;
                          text: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                          media: z.ZodOptional<
                            z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                          from: z.ZodOptional<
                            z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >
                          >;
                        },
                        z.core.$strip
                      >;
                      <
                        M extends z.core.util.Mask<
                          "id" | "text" | "from" | "media" | "media_id"
                        >,
                      >(
                        mask: M &
                          Record<
                            Exclude<
                              keyof M,
                              "id" | "text" | "from" | "media" | "media_id"
                            >,
                            never
                          >,
                      ): z.ZodObject<
                        {
                          id: "id" extends infer T
                            ? T extends "id"
                              ? T extends keyof M
                                ? z.ZodOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T]
                              : never
                            : never;
                          text: "text" extends infer T_1
                            ? T_1 extends "text"
                              ? T_1 extends keyof M
                                ? z.ZodOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_1]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_1]
                              : never
                            : never;
                          media: "media" extends infer T_2
                            ? T_2 extends "media"
                              ? T_2 extends keyof M
                                ? z.ZodOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_2]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_2]
                              : never
                            : never;
                          media_id: "media_id" extends infer T_3
                            ? T_3 extends "media_id"
                              ? T_3 extends keyof M
                                ? z.ZodOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_3]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_3]
                              : never
                            : never;
                          from: "from" extends infer T_4
                            ? T_4 extends "from"
                              ? T_4 extends keyof M
                                ? z.ZodOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_4]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_4]
                              : never
                            : never;
                        },
                        z.core.$strip
                      >;
                    };
                    required: {
                      (): z.ZodObject<
                        {
                          id: z.ZodNonOptional<z.ZodString>;
                          text: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
                          media: z.ZodNonOptional<
                            z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >
                          >;
                          media_id: z.ZodNonOptional<
                            z.ZodOptional<z.ZodString>
                          >;
                          from: z.ZodNonOptional<
                            z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >
                          >;
                        },
                        z.core.$strip
                      >;
                      <
                        M extends z.core.util.Mask<
                          "id" | "text" | "from" | "media" | "media_id"
                        >,
                      >(
                        mask: M &
                          Record<
                            Exclude<
                              keyof M,
                              "id" | "text" | "from" | "media" | "media_id"
                            >,
                            never
                          >,
                      ): z.ZodObject<
                        {
                          id: "id" extends infer T
                            ? T extends "id"
                              ? T extends keyof M
                                ? z.ZodNonOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T]
                              : never
                            : never;
                          text: "text" extends infer T_1
                            ? T_1 extends "text"
                              ? T_1 extends keyof M
                                ? z.ZodNonOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_1]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_1]
                              : never
                            : never;
                          media: "media" extends infer T_2
                            ? T_2 extends "media"
                              ? T_2 extends keyof M
                                ? z.ZodNonOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_2]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_2]
                              : never
                            : never;
                          media_id: "media_id" extends infer T_3
                            ? T_3 extends "media_id"
                              ? T_3 extends keyof M
                                ? z.ZodNonOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_3]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_3]
                              : never
                            : never;
                          from: "from" extends infer T_4
                            ? T_4 extends "from"
                              ? T_4 extends keyof M
                                ? z.ZodNonOptional<
                                    {
                                      id: z.ZodString;
                                      text: z.ZodOptional<z.ZodString>;
                                      media: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                      media_id: z.ZodOptional<z.ZodString>;
                                      from: z.ZodOptional<
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            username: z.ZodOptional<z.ZodString>;
                                          },
                                          z.core.$strip
                                        >
                                      >;
                                    }[T_4]
                                  >
                                : {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_4]
                              : never
                            : never;
                        },
                        z.core.$strip
                      >;
                    };
                    def: z.core.$ZodObjectDef<{
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    }>;
                    type: "object";
                    _def: z.core.$ZodObjectDef<{
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    }>;
                    _output: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    };
                    _input: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    };
                    toJSONSchema: (
                      params?: z.core.ToJSONSchemaParams,
                    ) => z.core.ZodStandardJSONSchemaPayload<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    check: (
                      ...checks: (
                        | z.core.CheckFn<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                        | z.core.$ZodCheck<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                      )[]
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    with: (
                      ...checks: (
                        | z.core.CheckFn<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                        | z.core.$ZodCheck<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                      )[]
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    clone: (
                      def?:
                        | z.core.$ZodObjectDef<{
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          }>
                        | undefined,
                      params?:
                        | {
                            parent: boolean;
                          }
                        | undefined,
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    register: <R extends z.core.$ZodRegistry>(
                      registry: R,
                      ...meta: z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      > extends infer T
                        ? T extends z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                          ? T extends R["_schema"]
                            ? undefined extends R["_meta"]
                              ? [
                                  (
                                    | z.core.$replace<
                                        R["_meta"],
                                        R["_schema"] &
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              text: z.ZodOptional<z.ZodString>;
                                              media: z.ZodOptional<
                                                z.ZodObject<
                                                  {
                                                    id: z.ZodString;
                                                  },
                                                  z.core.$strip
                                                >
                                              >;
                                              media_id: z.ZodOptional<z.ZodString>;
                                              from: z.ZodOptional<
                                                z.ZodObject<
                                                  {
                                                    id: z.ZodString;
                                                    username: z.ZodOptional<z.ZodString>;
                                                  },
                                                  z.core.$strip
                                                >
                                              >;
                                            },
                                            z.core.$strip
                                          >
                                      >
                                    | undefined
                                  )?,
                                ]
                              : [
                                  z.core.$replace<
                                    R["_meta"],
                                    R["_schema"] &
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        },
                                        z.core.$strip
                                      >
                                  >,
                                ]
                            : ["Incompatible schema"]
                          : never
                        : never
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    brand: <
                      T extends PropertyKey = PropertyKey,
                      Dir extends "in" | "out" | "inout" = "out",
                    >(
                      value?: T | undefined,
                    ) => PropertyKey extends T
                      ? z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      : z.core.$ZodBranded<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >,
                          T,
                          Dir
                        >;
                    parse: (
                      data: unknown,
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    };
                    safeParse: (
                      data: unknown,
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>;
                    parseAsync: (
                      data: unknown,
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>;
                    safeParseAsync: (
                      data: unknown,
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<
                      z.ZodSafeParseResult<{
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }>
                    >;
                    spa: (
                      data: unknown,
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<
                      z.ZodSafeParseResult<{
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }>
                    >;
                    encode: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    };
                    decode: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    };
                    encodeAsync: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>;
                    decodeAsync: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>;
                    safeEncode: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>;
                    safeDecode: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>;
                    safeEncodeAsync: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<
                      z.ZodSafeParseResult<{
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }>
                    >;
                    safeDecodeAsync: (
                      data: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      params?: z.core.ParseContext<z.core.$ZodIssue>,
                    ) => Promise<
                      z.ZodSafeParseResult<{
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }>
                    >;
                    refine: <
                      Ch extends (arg: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }) => unknown | Promise<unknown>,
                    >(
                      check: Ch,
                      params?:
                        | string
                        | {
                            abort?: boolean | undefined | undefined;
                            when?:
                              | ((payload: z.core.ParsePayload) => boolean)
                              | undefined
                              | undefined;
                            path?: PropertyKey[] | undefined | undefined;
                            params?: Record<string, any> | undefined;
                            error?:
                              | string
                              | z.core.$ZodErrorMap<
                                  NonNullable<z.core.$ZodIssue>
                                >
                              | undefined;
                            message?: string | undefined | undefined;
                          }
                        | undefined,
                    ) => Ch extends (arg: any) => arg is infer R
                      ? z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        > &
                          z.ZodType<
                            R,
                            {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                            z.core.$ZodTypeInternals<
                              R,
                              {
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }
                            >
                          >
                      : z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                    superRefine: (
                      refinement: (
                        arg: {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        },
                        ctx: z.core.$RefinementCtx<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>,
                      ) => void | Promise<void>,
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    overwrite: (
                      fn: (x: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }) => {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                    ) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    optional: () => z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    exactOptional: () => z.ZodExactOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    nonoptional: (
                      params?: string | z.core.$ZodNonOptionalParams,
                    ) => z.ZodNonOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    nullable: () => z.ZodNullable<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    nullish: () => z.ZodOptional<
                      z.ZodNullable<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >
                    >;
                    default: {
                      (def: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }): z.ZodDefault<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >;
                      (
                        def: () => {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        },
                      ): z.ZodDefault<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >;
                    };
                    prefault: {
                      (
                        def: () => {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        },
                      ): z.ZodPrefault<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >;
                      (def: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }): z.ZodPrefault<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >;
                    };
                    array: () => z.ZodArray<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    or: <T extends z.core.SomeType>(
                      option: T,
                    ) => z.ZodUnion<
                      [
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >,
                        T,
                      ]
                    >;
                    and: <T extends z.core.SomeType>(
                      incoming: T,
                    ) => z.ZodIntersection<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >,
                      T
                    >;
                    transform: <NewOut>(
                      transform: (
                        arg: {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        },
                        ctx: z.core.$RefinementCtx<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>,
                      ) => NewOut | Promise<NewOut>,
                    ) => z.ZodPipe<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >,
                      z.ZodTransform<
                        Awaited<NewOut>,
                        {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }
                      >
                    >;
                    catch: {
                      (def: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }): z.ZodCatch<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >;
                      (
                        def: (ctx: z.core.$ZodCatchCtx) => {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        },
                      ): z.ZodCatch<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                      >;
                    };
                    pipe: <
                      T extends z.core.$ZodType<
                        any,
                        {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        },
                        z.core.$ZodTypeInternals<
                          any,
                          {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }
                        >
                      >,
                    >(
                      target:
                        | T
                        | z.core.$ZodType<
                            any,
                            {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                            z.core.$ZodTypeInternals<
                              any,
                              {
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }
                            >
                          >,
                    ) => z.ZodPipe<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >,
                      T
                    >;
                    readonly: () => z.ZodReadonly<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    describe: (description: string) => z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    description?: string | undefined;
                    meta: {
                      ():
                        | {
                            [x: string]: unknown;
                            id?: string | undefined | undefined;
                            title?: string | undefined | undefined;
                            description?: string | undefined | undefined;
                            deprecated?: boolean | undefined | undefined;
                          }
                        | undefined;
                      (data: {
                        [x: string]: unknown;
                        id?: string | undefined | undefined;
                        title?: string | undefined | undefined;
                        description?: string | undefined | undefined;
                        deprecated?: boolean | undefined | undefined;
                      }): z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >;
                    };
                    isOptional: () => boolean;
                    isNullable: () => boolean;
                    apply: <T>(
                      fn: (
                        schema: z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >,
                      ) => T,
                    ) => T;
                    _zod: z.core.$ZodObjectInternals<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                  },
                  z.core.$strip
                >;
              },
              z.core.$strip
            >
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const WebhookEntryOfStoriesSchema: z.ZodObject<
  {
    id: z.ZodOptional<z.ZodString>;
    time: z.ZodNumber;
    messaging: z.ZodArray<
      z.ZodObject<
        {
          sender: z.ZodObject<
            {
              id: z.ZodString;
            },
            z.core.$strip
          >;
          recipient: z.ZodObject<
            {
              id: z.ZodString;
            },
            z.core.$strip
          >;
          timestamp: z.ZodNumber;
          message: z.ZodOptional<
            z.ZodObject<
              {
                mid: z.ZodString;
                text: z.ZodString;
              },
              z.core.$strip
            >
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const WebhookPayloadOfStoriesSchema: z.ZodObject<
  {
    object: z.ZodString;
    entry: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodOptional<z.ZodString>;
          time: z.ZodNumber;
          messaging: z.ZodArray<
            z.ZodObject<
              {
                sender: z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >;
                recipient: z.ZodObject<
                  {
                    id: z.ZodString;
                  },
                  z.core.$strip
                >;
                timestamp: z.ZodNumber;
                message: z.ZodOptional<
                  z.ZodObject<
                    {
                      mid: z.ZodString;
                      text: z.ZodString;
                    },
                    z.core.$strip
                  >
                >;
              },
              z.core.$strip
            >
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const WebhookEntrySchema: z.ZodUnion<
  readonly [
    z.ZodObject<
      {
        id: z.ZodOptional<z.ZodString>;
        time: z.ZodNumber;
        changes: z.ZodArray<
          z.ZodObject<
            {
              field: z.ZodString;
              value: z.ZodObject<
                {
                  "~standard": z.ZodStandardSchemaWithJSON<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  shape: {
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  };
                  keyof: () => z.ZodEnum<{
                    id: "id";
                    text: "text";
                    from: "from";
                    media: "media";
                    media_id: "media_id";
                  }>;
                  catchall: <T extends z.core.SomeType>(
                    schema: T,
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$catchall<T>
                  >;
                  passthrough: () => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$loose
                  >;
                  loose: () => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$loose
                  >;
                  strict: () => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strict
                  >;
                  strip: () => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  extend: <U extends z.core.$ZodLooseShape>(
                    shape: U,
                  ) => z.ZodObject<
                    (
                      ("id" | "text" | "from" | "media" | "media_id") &
                        keyof U extends never
                        ? {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          } & U
                        : ({
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          } extends infer T_1 extends z.core.util.SomeObject
                            ? {
                                [K in keyof T_1 as K extends keyof U
                                  ? never
                                  : K]: T_1[K];
                              }
                            : never) & { [K_1 in keyof U]: U[K_1] }
                    ) extends infer T
                      ? { [k in keyof T]: T[k] }
                      : never,
                    z.core.$strip
                  >;
                  safeExtend: <U extends z.core.$ZodLooseShape>(
                    shape: z.SafeExtendShape<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      U
                    > &
                      Partial<
                        Record<
                          "id" | "text" | "from" | "media" | "media_id",
                          z.core.SomeType
                        >
                      >,
                  ) => z.ZodObject<
                    (
                      ("id" | "text" | "from" | "media" | "media_id") &
                        keyof U extends never
                        ? {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          } & U
                        : ({
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          } extends infer T_1 extends z.core.util.SomeObject
                            ? {
                                [K in keyof T_1 as K extends keyof U
                                  ? never
                                  : K]: T_1[K];
                              }
                            : never) & { [K_1 in keyof U]: U[K_1] }
                    ) extends infer T
                      ? { [k in keyof T]: T[k] }
                      : never,
                    z.core.$strip
                  >;
                  merge: <U extends z.ZodObject>(
                    other: U,
                  ) => z.ZodObject<
                    (
                      ("id" | "text" | "from" | "media" | "media_id") &
                        keyof U["shape"] extends never
                        ? {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          } & U["shape"]
                        : ({
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          } extends infer T_1 extends z.core.util.SomeObject
                            ? {
                                [K in keyof T_1 as K extends keyof U["shape"]
                                  ? never
                                  : K]: T_1[K];
                              }
                            : never) &
                            (U["shape"] extends infer T_2 extends
                              z.core.util.SomeObject
                              ? { [K_1 in keyof T_2]: T_2[K_1] }
                              : never)
                    ) extends infer T
                      ? { [k in keyof T]: T[k] }
                      : never,
                    U["_zod"]["config"]
                  >;
                  pick: <
                    M extends z.core.util.Mask<
                      "id" | "text" | "from" | "media" | "media_id"
                    >,
                  >(
                    mask: M &
                      Record<
                        Exclude<
                          keyof M,
                          "id" | "text" | "from" | "media" | "media_id"
                        >,
                        never
                      >,
                  ) => z.ZodObject<
                    Pick<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      | Extract<"id", keyof M>
                      | Extract<"text", keyof M>
                      | Extract<"from", keyof M>
                      | Extract<"media", keyof M>
                      | Extract<"media_id", keyof M>
                    > extends infer T
                      ? { [k in keyof T]: T[k] }
                      : never,
                    z.core.$strip
                  >;
                  omit: <
                    M extends z.core.util.Mask<
                      "id" | "text" | "from" | "media" | "media_id"
                    >,
                  >(
                    mask: M &
                      Record<
                        Exclude<
                          keyof M,
                          "id" | "text" | "from" | "media" | "media_id"
                        >,
                        never
                      >,
                  ) => z.ZodObject<
                    Omit<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      | Extract<"id", keyof M>
                      | Extract<"text", keyof M>
                      | Extract<"from", keyof M>
                      | Extract<"media", keyof M>
                      | Extract<"media_id", keyof M>
                    > extends infer T
                      ? { [k in keyof T]: T[k] }
                      : never,
                    z.core.$strip
                  >;
                  partial: {
                    (): z.ZodObject<
                      {
                        id: z.ZodOptional<z.ZodString>;
                        text: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        media: z.ZodOptional<
                          z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                        from: z.ZodOptional<
                          z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    <
                      M extends z.core.util.Mask<
                        "id" | "text" | "from" | "media" | "media_id"
                      >,
                    >(
                      mask: M &
                        Record<
                          Exclude<
                            keyof M,
                            "id" | "text" | "from" | "media" | "media_id"
                          >,
                          never
                        >,
                    ): z.ZodObject<
                      {
                        id: "id" extends infer T
                          ? T extends "id"
                            ? T extends keyof M
                              ? z.ZodOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T]
                            : never
                          : never;
                        text: "text" extends infer T_1
                          ? T_1 extends "text"
                            ? T_1 extends keyof M
                              ? z.ZodOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_1]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_1]
                            : never
                          : never;
                        media: "media" extends infer T_2
                          ? T_2 extends "media"
                            ? T_2 extends keyof M
                              ? z.ZodOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_2]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_2]
                            : never
                          : never;
                        media_id: "media_id" extends infer T_3
                          ? T_3 extends "media_id"
                            ? T_3 extends keyof M
                              ? z.ZodOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_3]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_3]
                            : never
                          : never;
                        from: "from" extends infer T_4
                          ? T_4 extends "from"
                            ? T_4 extends keyof M
                              ? z.ZodOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_4]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_4]
                            : never
                          : never;
                      },
                      z.core.$strip
                    >;
                  };
                  required: {
                    (): z.ZodObject<
                      {
                        id: z.ZodNonOptional<z.ZodString>;
                        text: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
                        media: z.ZodNonOptional<
                          z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >
                        >;
                        media_id: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
                        from: z.ZodNonOptional<
                          z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                    <
                      M extends z.core.util.Mask<
                        "id" | "text" | "from" | "media" | "media_id"
                      >,
                    >(
                      mask: M &
                        Record<
                          Exclude<
                            keyof M,
                            "id" | "text" | "from" | "media" | "media_id"
                          >,
                          never
                        >,
                    ): z.ZodObject<
                      {
                        id: "id" extends infer T
                          ? T extends "id"
                            ? T extends keyof M
                              ? z.ZodNonOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T]
                            : never
                          : never;
                        text: "text" extends infer T_1
                          ? T_1 extends "text"
                            ? T_1 extends keyof M
                              ? z.ZodNonOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_1]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_1]
                            : never
                          : never;
                        media: "media" extends infer T_2
                          ? T_2 extends "media"
                            ? T_2 extends keyof M
                              ? z.ZodNonOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_2]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_2]
                            : never
                          : never;
                        media_id: "media_id" extends infer T_3
                          ? T_3 extends "media_id"
                            ? T_3 extends keyof M
                              ? z.ZodNonOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_3]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_3]
                            : never
                          : never;
                        from: "from" extends infer T_4
                          ? T_4 extends "from"
                            ? T_4 extends keyof M
                              ? z.ZodNonOptional<
                                  {
                                    id: z.ZodString;
                                    text: z.ZodOptional<z.ZodString>;
                                    media: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                    media_id: z.ZodOptional<z.ZodString>;
                                    from: z.ZodOptional<
                                      z.ZodObject<
                                        {
                                          id: z.ZodString;
                                          username: z.ZodOptional<z.ZodString>;
                                        },
                                        z.core.$strip
                                      >
                                    >;
                                  }[T_4]
                                >
                              : {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                }[T_4]
                            : never
                          : never;
                      },
                      z.core.$strip
                    >;
                  };
                  def: z.core.$ZodObjectDef<{
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  }>;
                  type: "object";
                  _def: z.core.$ZodObjectDef<{
                    id: z.ZodString;
                    text: z.ZodOptional<z.ZodString>;
                    media: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                    media_id: z.ZodOptional<z.ZodString>;
                    from: z.ZodOptional<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          username: z.ZodOptional<z.ZodString>;
                        },
                        z.core.$strip
                      >
                    >;
                  }>;
                  _output: {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  };
                  _input: {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  };
                  toJSONSchema: (
                    params?: z.core.ToJSONSchemaParams,
                  ) => z.core.ZodStandardJSONSchemaPayload<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  check: (
                    ...checks: (
                      | z.core.CheckFn<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>
                      | z.core.$ZodCheck<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>
                    )[]
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  with: (
                    ...checks: (
                      | z.core.CheckFn<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>
                      | z.core.$ZodCheck<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>
                    )[]
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  clone: (
                    def?:
                      | z.core.$ZodObjectDef<{
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }>
                      | undefined,
                    params?:
                      | {
                          parent: boolean;
                        }
                      | undefined,
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  register: <R extends z.core.$ZodRegistry>(
                    registry: R,
                    ...meta: z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    > extends infer T
                      ? T extends z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >
                        ? T extends R["_schema"]
                          ? undefined extends R["_meta"]
                            ? [
                                (
                                  | z.core.$replace<
                                      R["_meta"],
                                      R["_schema"] &
                                        z.ZodObject<
                                          {
                                            id: z.ZodString;
                                            text: z.ZodOptional<z.ZodString>;
                                            media: z.ZodOptional<
                                              z.ZodObject<
                                                {
                                                  id: z.ZodString;
                                                },
                                                z.core.$strip
                                              >
                                            >;
                                            media_id: z.ZodOptional<z.ZodString>;
                                            from: z.ZodOptional<
                                              z.ZodObject<
                                                {
                                                  id: z.ZodString;
                                                  username: z.ZodOptional<z.ZodString>;
                                                },
                                                z.core.$strip
                                              >
                                            >;
                                          },
                                          z.core.$strip
                                        >
                                    >
                                  | undefined
                                )?,
                              ]
                            : [
                                z.core.$replace<
                                  R["_meta"],
                                  R["_schema"] &
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      },
                                      z.core.$strip
                                    >
                                >,
                              ]
                          : ["Incompatible schema"]
                        : never
                      : never
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  brand: <
                    T extends PropertyKey = PropertyKey,
                    Dir extends "in" | "out" | "inout" = "out",
                  >(
                    value?: T | undefined,
                  ) => PropertyKey extends T
                    ? z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    : z.core.$ZodBranded<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >,
                        T,
                        Dir
                      >;
                  parse: (
                    data: unknown,
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  };
                  safeParse: (
                    data: unknown,
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => z.ZodSafeParseResult<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>;
                  parseAsync: (
                    data: unknown,
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>;
                  safeParseAsync: (
                    data: unknown,
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<
                    z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                  >;
                  spa: (
                    data: unknown,
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<
                    z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                  >;
                  encode: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  };
                  decode: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => {
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  };
                  encodeAsync: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>;
                  decodeAsync: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>;
                  safeEncode: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => z.ZodSafeParseResult<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>;
                  safeDecode: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => z.ZodSafeParseResult<{
                    id: string;
                    text?: string | undefined;
                    media?:
                      | {
                          id: string;
                        }
                      | undefined;
                    media_id?: string | undefined;
                    from?:
                      | {
                          id: string;
                          username?: string | undefined;
                        }
                      | undefined;
                  }>;
                  safeEncodeAsync: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<
                    z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                  >;
                  safeDecodeAsync: (
                    data: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                    params?: z.core.ParseContext<z.core.$ZodIssue>,
                  ) => Promise<
                    z.ZodSafeParseResult<{
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }>
                  >;
                  refine: <
                    Ch extends (arg: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }) => unknown | Promise<unknown>,
                  >(
                    check: Ch,
                    params?:
                      | string
                      | {
                          abort?: boolean | undefined | undefined;
                          when?:
                            | ((payload: z.core.ParsePayload) => boolean)
                            | undefined
                            | undefined;
                          path?: PropertyKey[] | undefined | undefined;
                          params?: Record<string, any> | undefined;
                          error?:
                            | string
                            | z.core.$ZodErrorMap<NonNullable<z.core.$ZodIssue>>
                            | undefined;
                          message?: string | undefined | undefined;
                        }
                      | undefined,
                  ) => Ch extends (arg: any) => arg is infer R
                    ? z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      > &
                        z.ZodType<
                          R,
                          {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          z.core.$ZodTypeInternals<
                            R,
                            {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            }
                          >
                        >
                    : z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >;
                  superRefine: (
                    refinement: (
                      arg: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      ctx: z.core.$RefinementCtx<{
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }>,
                    ) => void | Promise<void>,
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  overwrite: (
                    fn: (x: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }) => {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    },
                  ) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  optional: () => z.ZodOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  exactOptional: () => z.ZodExactOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  nonoptional: (
                    params?: string | z.core.$ZodNonOptionalParams,
                  ) => z.ZodNonOptional<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  nullable: () => z.ZodNullable<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  nullish: () => z.ZodOptional<
                    z.ZodNullable<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >
                  >;
                  default: {
                    (def: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }): z.ZodDefault<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    (
                      def: () => {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                    ): z.ZodDefault<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                  };
                  prefault: {
                    (
                      def: () => {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                    ): z.ZodPrefault<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    (def: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }): z.ZodPrefault<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                  };
                  array: () => z.ZodArray<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  or: <T extends z.core.SomeType>(
                    option: T,
                  ) => z.ZodUnion<
                    [
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >,
                      T,
                    ]
                  >;
                  and: <T extends z.core.SomeType>(
                    incoming: T,
                  ) => z.ZodIntersection<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >,
                    T
                  >;
                  transform: <NewOut>(
                    transform: (
                      arg: {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      ctx: z.core.$RefinementCtx<{
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }>,
                    ) => NewOut | Promise<NewOut>,
                  ) => z.ZodPipe<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >,
                    z.ZodTransform<
                      Awaited<NewOut>,
                      {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      }
                    >
                  >;
                  catch: {
                    (def: {
                      id: string;
                      text?: string | undefined;
                      media?:
                        | {
                            id: string;
                          }
                        | undefined;
                      media_id?: string | undefined;
                      from?:
                        | {
                            id: string;
                            username?: string | undefined;
                          }
                        | undefined;
                    }): z.ZodCatch<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                    (
                      def: (ctx: z.core.$ZodCatchCtx) => {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                    ): z.ZodCatch<
                      z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >
                    >;
                  };
                  pipe: <
                    T extends z.core.$ZodType<
                      any,
                      {
                        id: string;
                        text?: string | undefined;
                        media?:
                          | {
                              id: string;
                            }
                          | undefined;
                        media_id?: string | undefined;
                        from?:
                          | {
                              id: string;
                              username?: string | undefined;
                            }
                          | undefined;
                      },
                      z.core.$ZodTypeInternals<
                        any,
                        {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }
                      >
                    >,
                  >(
                    target:
                      | T
                      | z.core.$ZodType<
                          any,
                          {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          z.core.$ZodTypeInternals<
                            any,
                            {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            }
                          >
                        >,
                  ) => z.ZodPipe<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >,
                    T
                  >;
                  readonly: () => z.ZodReadonly<
                    z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >
                  >;
                  describe: (description: string) => z.ZodObject<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                  description?: string | undefined;
                  meta: {
                    ():
                      | {
                          [x: string]: unknown;
                          id?: string | undefined | undefined;
                          title?: string | undefined | undefined;
                          description?: string | undefined | undefined;
                          deprecated?: boolean | undefined | undefined;
                        }
                      | undefined;
                    (data: {
                      [x: string]: unknown;
                      id?: string | undefined | undefined;
                      title?: string | undefined | undefined;
                      description?: string | undefined | undefined;
                      deprecated?: boolean | undefined | undefined;
                    }): z.ZodObject<
                      {
                        id: z.ZodString;
                        text: z.ZodOptional<z.ZodString>;
                        media: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                            },
                            z.core.$strip
                          >
                        >;
                        media_id: z.ZodOptional<z.ZodString>;
                        from: z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              username: z.ZodOptional<z.ZodString>;
                            },
                            z.core.$strip
                          >
                        >;
                      },
                      z.core.$strip
                    >;
                  };
                  isOptional: () => boolean;
                  isNullable: () => boolean;
                  apply: <T>(
                    fn: (
                      schema: z.ZodObject<
                        {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        },
                        z.core.$strip
                      >,
                    ) => T,
                  ) => T;
                  _zod: z.core.$ZodObjectInternals<
                    {
                      id: z.ZodString;
                      text: z.ZodOptional<z.ZodString>;
                      media: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                          },
                          z.core.$strip
                        >
                      >;
                      media_id: z.ZodOptional<z.ZodString>;
                      from: z.ZodOptional<
                        z.ZodObject<
                          {
                            id: z.ZodString;
                            username: z.ZodOptional<z.ZodString>;
                          },
                          z.core.$strip
                        >
                      >;
                    },
                    z.core.$strip
                  >;
                },
                z.core.$strip
              >;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        id: z.ZodOptional<z.ZodString>;
        time: z.ZodNumber;
        messaging: z.ZodArray<
          z.ZodObject<
            {
              sender: z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >;
              recipient: z.ZodObject<
                {
                  id: z.ZodString;
                },
                z.core.$strip
              >;
              timestamp: z.ZodNumber;
              message: z.ZodOptional<
                z.ZodObject<
                  {
                    mid: z.ZodString;
                    text: z.ZodString;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
  ]
>;
export declare const WebhookPayloadSchema: z.ZodUnion<
  readonly [
    z.ZodObject<
      {
        object: z.ZodString;
        entry: z.ZodArray<
          z.ZodObject<
            {
              id: z.ZodOptional<z.ZodString>;
              time: z.ZodNumber;
              changes: z.ZodArray<
                z.ZodObject<
                  {
                    field: z.ZodString;
                    value: z.ZodObject<
                      {
                        "~standard": z.ZodStandardSchemaWithJSON<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        shape: {
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        };
                        keyof: () => z.ZodEnum<{
                          id: "id";
                          text: "text";
                          from: "from";
                          media: "media";
                          media_id: "media_id";
                        }>;
                        catchall: <T extends z.core.SomeType>(
                          schema: T,
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$catchall<T>
                        >;
                        passthrough: () => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$loose
                        >;
                        loose: () => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$loose
                        >;
                        strict: () => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strict
                        >;
                        strip: () => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        extend: <U extends z.core.$ZodLooseShape>(
                          shape: U,
                        ) => z.ZodObject<
                          (
                            ("id" | "text" | "from" | "media" | "media_id") &
                              keyof U extends never
                              ? {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                } & U
                              : ({
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                } extends infer T_1 extends
                                  z.core.util.SomeObject
                                  ? {
                                      [K in keyof T_1 as K extends keyof U
                                        ? never
                                        : K]: T_1[K];
                                    }
                                  : never) & { [K_1 in keyof U]: U[K_1] }
                          ) extends infer T
                            ? { [k in keyof T]: T[k] }
                            : never,
                          z.core.$strip
                        >;
                        safeExtend: <U extends z.core.$ZodLooseShape>(
                          shape: z.SafeExtendShape<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            U
                          > &
                            Partial<
                              Record<
                                "id" | "text" | "from" | "media" | "media_id",
                                z.core.SomeType
                              >
                            >,
                        ) => z.ZodObject<
                          (
                            ("id" | "text" | "from" | "media" | "media_id") &
                              keyof U extends never
                              ? {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                } & U
                              : ({
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                } extends infer T_1 extends
                                  z.core.util.SomeObject
                                  ? {
                                      [K in keyof T_1 as K extends keyof U
                                        ? never
                                        : K]: T_1[K];
                                    }
                                  : never) & { [K_1 in keyof U]: U[K_1] }
                          ) extends infer T
                            ? { [k in keyof T]: T[k] }
                            : never,
                          z.core.$strip
                        >;
                        merge: <U extends z.ZodObject>(
                          other: U,
                        ) => z.ZodObject<
                          (
                            ("id" | "text" | "from" | "media" | "media_id") &
                              keyof U["shape"] extends never
                              ? {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                } & U["shape"]
                              : ({
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                } extends infer T_1 extends
                                  z.core.util.SomeObject
                                  ? {
                                      [K in keyof T_1 as K extends keyof U["shape"]
                                        ? never
                                        : K]: T_1[K];
                                    }
                                  : never) &
                                  (U["shape"] extends infer T_2 extends
                                    z.core.util.SomeObject
                                    ? { [K_1 in keyof T_2]: T_2[K_1] }
                                    : never)
                          ) extends infer T
                            ? { [k in keyof T]: T[k] }
                            : never,
                          U["_zod"]["config"]
                        >;
                        pick: <
                          M extends z.core.util.Mask<
                            "id" | "text" | "from" | "media" | "media_id"
                          >,
                        >(
                          mask: M &
                            Record<
                              Exclude<
                                keyof M,
                                "id" | "text" | "from" | "media" | "media_id"
                              >,
                              never
                            >,
                        ) => z.ZodObject<
                          Pick<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            | Extract<"id", keyof M>
                            | Extract<"text", keyof M>
                            | Extract<"from", keyof M>
                            | Extract<"media", keyof M>
                            | Extract<"media_id", keyof M>
                          > extends infer T
                            ? { [k in keyof T]: T[k] }
                            : never,
                          z.core.$strip
                        >;
                        omit: <
                          M extends z.core.util.Mask<
                            "id" | "text" | "from" | "media" | "media_id"
                          >,
                        >(
                          mask: M &
                            Record<
                              Exclude<
                                keyof M,
                                "id" | "text" | "from" | "media" | "media_id"
                              >,
                              never
                            >,
                        ) => z.ZodObject<
                          Omit<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            | Extract<"id", keyof M>
                            | Extract<"text", keyof M>
                            | Extract<"from", keyof M>
                            | Extract<"media", keyof M>
                            | Extract<"media_id", keyof M>
                          > extends infer T
                            ? { [k in keyof T]: T[k] }
                            : never,
                          z.core.$strip
                        >;
                        partial: {
                          (): z.ZodObject<
                            {
                              id: z.ZodOptional<z.ZodString>;
                              text: z.ZodOptional<z.ZodOptional<z.ZodString>>;
                              media: z.ZodOptional<
                                z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >
                              >;
                              media_id: z.ZodOptional<
                                z.ZodOptional<z.ZodString>
                              >;
                              from: z.ZodOptional<
                                z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >
                              >;
                            },
                            z.core.$strip
                          >;
                          <
                            M extends z.core.util.Mask<
                              "id" | "text" | "from" | "media" | "media_id"
                            >,
                          >(
                            mask: M &
                              Record<
                                Exclude<
                                  keyof M,
                                  "id" | "text" | "from" | "media" | "media_id"
                                >,
                                never
                              >,
                          ): z.ZodObject<
                            {
                              id: "id" extends infer T
                                ? T extends "id"
                                  ? T extends keyof M
                                    ? z.ZodOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T]
                                  : never
                                : never;
                              text: "text" extends infer T_1
                                ? T_1 extends "text"
                                  ? T_1 extends keyof M
                                    ? z.ZodOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_1]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_1]
                                  : never
                                : never;
                              media: "media" extends infer T_2
                                ? T_2 extends "media"
                                  ? T_2 extends keyof M
                                    ? z.ZodOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_2]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_2]
                                  : never
                                : never;
                              media_id: "media_id" extends infer T_3
                                ? T_3 extends "media_id"
                                  ? T_3 extends keyof M
                                    ? z.ZodOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_3]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_3]
                                  : never
                                : never;
                              from: "from" extends infer T_4
                                ? T_4 extends "from"
                                  ? T_4 extends keyof M
                                    ? z.ZodOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_4]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_4]
                                  : never
                                : never;
                            },
                            z.core.$strip
                          >;
                        };
                        required: {
                          (): z.ZodObject<
                            {
                              id: z.ZodNonOptional<z.ZodString>;
                              text: z.ZodNonOptional<
                                z.ZodOptional<z.ZodString>
                              >;
                              media: z.ZodNonOptional<
                                z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >
                              >;
                              media_id: z.ZodNonOptional<
                                z.ZodOptional<z.ZodString>
                              >;
                              from: z.ZodNonOptional<
                                z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >
                              >;
                            },
                            z.core.$strip
                          >;
                          <
                            M extends z.core.util.Mask<
                              "id" | "text" | "from" | "media" | "media_id"
                            >,
                          >(
                            mask: M &
                              Record<
                                Exclude<
                                  keyof M,
                                  "id" | "text" | "from" | "media" | "media_id"
                                >,
                                never
                              >,
                          ): z.ZodObject<
                            {
                              id: "id" extends infer T
                                ? T extends "id"
                                  ? T extends keyof M
                                    ? z.ZodNonOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T]
                                  : never
                                : never;
                              text: "text" extends infer T_1
                                ? T_1 extends "text"
                                  ? T_1 extends keyof M
                                    ? z.ZodNonOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_1]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_1]
                                  : never
                                : never;
                              media: "media" extends infer T_2
                                ? T_2 extends "media"
                                  ? T_2 extends keyof M
                                    ? z.ZodNonOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_2]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_2]
                                  : never
                                : never;
                              media_id: "media_id" extends infer T_3
                                ? T_3 extends "media_id"
                                  ? T_3 extends keyof M
                                    ? z.ZodNonOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_3]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_3]
                                  : never
                                : never;
                              from: "from" extends infer T_4
                                ? T_4 extends "from"
                                  ? T_4 extends keyof M
                                    ? z.ZodNonOptional<
                                        {
                                          id: z.ZodString;
                                          text: z.ZodOptional<z.ZodString>;
                                          media: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                          media_id: z.ZodOptional<z.ZodString>;
                                          from: z.ZodOptional<
                                            z.ZodObject<
                                              {
                                                id: z.ZodString;
                                                username: z.ZodOptional<z.ZodString>;
                                              },
                                              z.core.$strip
                                            >
                                          >;
                                        }[T_4]
                                      >
                                    : {
                                        id: z.ZodString;
                                        text: z.ZodOptional<z.ZodString>;
                                        media: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                        media_id: z.ZodOptional<z.ZodString>;
                                        from: z.ZodOptional<
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              username: z.ZodOptional<z.ZodString>;
                                            },
                                            z.core.$strip
                                          >
                                        >;
                                      }[T_4]
                                  : never
                                : never;
                            },
                            z.core.$strip
                          >;
                        };
                        def: z.core.$ZodObjectDef<{
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }>;
                        type: "object";
                        _def: z.core.$ZodObjectDef<{
                          id: z.ZodString;
                          text: z.ZodOptional<z.ZodString>;
                          media: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                              },
                              z.core.$strip
                            >
                          >;
                          media_id: z.ZodOptional<z.ZodString>;
                          from: z.ZodOptional<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                username: z.ZodOptional<z.ZodString>;
                              },
                              z.core.$strip
                            >
                          >;
                        }>;
                        _output: {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        };
                        _input: {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        };
                        toJSONSchema: (
                          params?: z.core.ToJSONSchemaParams,
                        ) => z.core.ZodStandardJSONSchemaPayload<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        check: (
                          ...checks: (
                            | z.core.CheckFn<{
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }>
                            | z.core.$ZodCheck<{
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }>
                          )[]
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        with: (
                          ...checks: (
                            | z.core.CheckFn<{
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }>
                            | z.core.$ZodCheck<{
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }>
                          )[]
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        clone: (
                          def?:
                            | z.core.$ZodObjectDef<{
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              }>
                            | undefined,
                          params?:
                            | {
                                parent: boolean;
                              }
                            | undefined,
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        register: <R extends z.core.$ZodRegistry>(
                          registry: R,
                          ...meta: z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          > extends infer T
                            ? T extends z.ZodObject<
                                {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                },
                                z.core.$strip
                              >
                              ? T extends R["_schema"]
                                ? undefined extends R["_meta"]
                                  ? [
                                      (
                                        | z.core.$replace<
                                            R["_meta"],
                                            R["_schema"] &
                                              z.ZodObject<
                                                {
                                                  id: z.ZodString;
                                                  text: z.ZodOptional<z.ZodString>;
                                                  media: z.ZodOptional<
                                                    z.ZodObject<
                                                      {
                                                        id: z.ZodString;
                                                      },
                                                      z.core.$strip
                                                    >
                                                  >;
                                                  media_id: z.ZodOptional<z.ZodString>;
                                                  from: z.ZodOptional<
                                                    z.ZodObject<
                                                      {
                                                        id: z.ZodString;
                                                        username: z.ZodOptional<z.ZodString>;
                                                      },
                                                      z.core.$strip
                                                    >
                                                  >;
                                                },
                                                z.core.$strip
                                              >
                                          >
                                        | undefined
                                      )?,
                                    ]
                                  : [
                                      z.core.$replace<
                                        R["_meta"],
                                        R["_schema"] &
                                          z.ZodObject<
                                            {
                                              id: z.ZodString;
                                              text: z.ZodOptional<z.ZodString>;
                                              media: z.ZodOptional<
                                                z.ZodObject<
                                                  {
                                                    id: z.ZodString;
                                                  },
                                                  z.core.$strip
                                                >
                                              >;
                                              media_id: z.ZodOptional<z.ZodString>;
                                              from: z.ZodOptional<
                                                z.ZodObject<
                                                  {
                                                    id: z.ZodString;
                                                    username: z.ZodOptional<z.ZodString>;
                                                  },
                                                  z.core.$strip
                                                >
                                              >;
                                            },
                                            z.core.$strip
                                          >
                                      >,
                                    ]
                                : ["Incompatible schema"]
                              : never
                            : never
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        brand: <
                          T extends PropertyKey = PropertyKey,
                          Dir extends "in" | "out" | "inout" = "out",
                        >(
                          value?: T | undefined,
                        ) => PropertyKey extends T
                          ? z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          : z.core.$ZodBranded<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  text: z.ZodOptional<z.ZodString>;
                                  media: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                  media_id: z.ZodOptional<z.ZodString>;
                                  from: z.ZodOptional<
                                    z.ZodObject<
                                      {
                                        id: z.ZodString;
                                        username: z.ZodOptional<z.ZodString>;
                                      },
                                      z.core.$strip
                                    >
                                  >;
                                },
                                z.core.$strip
                              >,
                              T,
                              Dir
                            >;
                        parse: (
                          data: unknown,
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        };
                        safeParse: (
                          data: unknown,
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => z.ZodSafeParseResult<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>;
                        parseAsync: (
                          data: unknown,
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>;
                        safeParseAsync: (
                          data: unknown,
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<
                          z.ZodSafeParseResult<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                        >;
                        spa: (
                          data: unknown,
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<
                          z.ZodSafeParseResult<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                        >;
                        encode: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        };
                        decode: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => {
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        };
                        encodeAsync: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>;
                        decodeAsync: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>;
                        safeEncode: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => z.ZodSafeParseResult<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>;
                        safeDecode: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => z.ZodSafeParseResult<{
                          id: string;
                          text?: string | undefined;
                          media?:
                            | {
                                id: string;
                              }
                            | undefined;
                          media_id?: string | undefined;
                          from?:
                            | {
                                id: string;
                                username?: string | undefined;
                              }
                            | undefined;
                        }>;
                        safeEncodeAsync: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<
                          z.ZodSafeParseResult<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                        >;
                        safeDecodeAsync: (
                          data: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                          params?: z.core.ParseContext<z.core.$ZodIssue>,
                        ) => Promise<
                          z.ZodSafeParseResult<{
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }>
                        >;
                        refine: <
                          Ch extends (arg: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }) => unknown | Promise<unknown>,
                        >(
                          check: Ch,
                          params?:
                            | string
                            | {
                                abort?: boolean | undefined | undefined;
                                when?:
                                  | ((payload: z.core.ParsePayload) => boolean)
                                  | undefined
                                  | undefined;
                                path?: PropertyKey[] | undefined | undefined;
                                params?: Record<string, any> | undefined;
                                error?:
                                  | string
                                  | z.core.$ZodErrorMap<
                                      NonNullable<z.core.$ZodIssue>
                                    >
                                  | undefined;
                                message?: string | undefined | undefined;
                              }
                            | undefined,
                        ) => Ch extends (arg: any) => arg is infer R
                          ? z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            > &
                              z.ZodType<
                                R,
                                {
                                  id: string;
                                  text?: string | undefined;
                                  media?:
                                    | {
                                        id: string;
                                      }
                                    | undefined;
                                  media_id?: string | undefined;
                                  from?:
                                    | {
                                        id: string;
                                        username?: string | undefined;
                                      }
                                    | undefined;
                                },
                                z.core.$ZodTypeInternals<
                                  R,
                                  {
                                    id: string;
                                    text?: string | undefined;
                                    media?:
                                      | {
                                          id: string;
                                        }
                                      | undefined;
                                    media_id?: string | undefined;
                                    from?:
                                      | {
                                          id: string;
                                          username?: string | undefined;
                                        }
                                      | undefined;
                                  }
                                >
                              >
                          : z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >;
                        superRefine: (
                          refinement: (
                            arg: {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                            ctx: z.core.$RefinementCtx<{
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            }>,
                          ) => void | Promise<void>,
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        overwrite: (
                          fn: (x: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }) => {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          },
                        ) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        optional: () => z.ZodOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        exactOptional: () => z.ZodExactOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        nonoptional: (
                          params?: string | z.core.$ZodNonOptionalParams,
                        ) => z.ZodNonOptional<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        nullable: () => z.ZodNullable<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        nullish: () => z.ZodOptional<
                          z.ZodNullable<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >
                        >;
                        default: {
                          (def: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }): z.ZodDefault<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >;
                          (
                            def: () => {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                          ): z.ZodDefault<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >;
                        };
                        prefault: {
                          (
                            def: () => {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                          ): z.ZodPrefault<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >;
                          (def: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }): z.ZodPrefault<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >;
                        };
                        array: () => z.ZodArray<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        or: <T extends z.core.SomeType>(
                          option: T,
                        ) => z.ZodUnion<
                          [
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >,
                            T,
                          ]
                        >;
                        and: <T extends z.core.SomeType>(
                          incoming: T,
                        ) => z.ZodIntersection<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >,
                          T
                        >;
                        transform: <NewOut>(
                          transform: (
                            arg: {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                            ctx: z.core.$RefinementCtx<{
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            }>,
                          ) => NewOut | Promise<NewOut>,
                        ) => z.ZodPipe<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >,
                          z.ZodTransform<
                            Awaited<NewOut>,
                            {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            }
                          >
                        >;
                        catch: {
                          (def: {
                            id: string;
                            text?: string | undefined;
                            media?:
                              | {
                                  id: string;
                                }
                              | undefined;
                            media_id?: string | undefined;
                            from?:
                              | {
                                  id: string;
                                  username?: string | undefined;
                                }
                              | undefined;
                          }): z.ZodCatch<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >;
                          (
                            def: (ctx: z.core.$ZodCatchCtx) => {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                          ): z.ZodCatch<
                            z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >
                          >;
                        };
                        pipe: <
                          T extends z.core.$ZodType<
                            any,
                            {
                              id: string;
                              text?: string | undefined;
                              media?:
                                | {
                                    id: string;
                                  }
                                | undefined;
                              media_id?: string | undefined;
                              from?:
                                | {
                                    id: string;
                                    username?: string | undefined;
                                  }
                                | undefined;
                            },
                            z.core.$ZodTypeInternals<
                              any,
                              {
                                id: string;
                                text?: string | undefined;
                                media?:
                                  | {
                                      id: string;
                                    }
                                  | undefined;
                                media_id?: string | undefined;
                                from?:
                                  | {
                                      id: string;
                                      username?: string | undefined;
                                    }
                                  | undefined;
                              }
                            >
                          >,
                        >(
                          target:
                            | T
                            | z.core.$ZodType<
                                any,
                                {
                                  id: string;
                                  text?: string | undefined;
                                  media?:
                                    | {
                                        id: string;
                                      }
                                    | undefined;
                                  media_id?: string | undefined;
                                  from?:
                                    | {
                                        id: string;
                                        username?: string | undefined;
                                      }
                                    | undefined;
                                },
                                z.core.$ZodTypeInternals<
                                  any,
                                  {
                                    id: string;
                                    text?: string | undefined;
                                    media?:
                                      | {
                                          id: string;
                                        }
                                      | undefined;
                                    media_id?: string | undefined;
                                    from?:
                                      | {
                                          id: string;
                                          username?: string | undefined;
                                        }
                                      | undefined;
                                  }
                                >
                              >,
                        ) => z.ZodPipe<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >,
                          T
                        >;
                        readonly: () => z.ZodReadonly<
                          z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >
                        >;
                        describe: (description: string) => z.ZodObject<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                        description?: string | undefined;
                        meta: {
                          ():
                            | {
                                [x: string]: unknown;
                                id?: string | undefined | undefined;
                                title?: string | undefined | undefined;
                                description?: string | undefined | undefined;
                                deprecated?: boolean | undefined | undefined;
                              }
                            | undefined;
                          (data: {
                            [x: string]: unknown;
                            id?: string | undefined | undefined;
                            title?: string | undefined | undefined;
                            description?: string | undefined | undefined;
                            deprecated?: boolean | undefined | undefined;
                          }): z.ZodObject<
                            {
                              id: z.ZodString;
                              text: z.ZodOptional<z.ZodString>;
                              media: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                  },
                                  z.core.$strip
                                >
                              >;
                              media_id: z.ZodOptional<z.ZodString>;
                              from: z.ZodOptional<
                                z.ZodObject<
                                  {
                                    id: z.ZodString;
                                    username: z.ZodOptional<z.ZodString>;
                                  },
                                  z.core.$strip
                                >
                              >;
                            },
                            z.core.$strip
                          >;
                        };
                        isOptional: () => boolean;
                        isNullable: () => boolean;
                        apply: <T>(
                          fn: (
                            schema: z.ZodObject<
                              {
                                id: z.ZodString;
                                text: z.ZodOptional<z.ZodString>;
                                media: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                    },
                                    z.core.$strip
                                  >
                                >;
                                media_id: z.ZodOptional<z.ZodString>;
                                from: z.ZodOptional<
                                  z.ZodObject<
                                    {
                                      id: z.ZodString;
                                      username: z.ZodOptional<z.ZodString>;
                                    },
                                    z.core.$strip
                                  >
                                >;
                              },
                              z.core.$strip
                            >,
                          ) => T,
                        ) => T;
                        _zod: z.core.$ZodObjectInternals<
                          {
                            id: z.ZodString;
                            text: z.ZodOptional<z.ZodString>;
                            media: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                },
                                z.core.$strip
                              >
                            >;
                            media_id: z.ZodOptional<z.ZodString>;
                            from: z.ZodOptional<
                              z.ZodObject<
                                {
                                  id: z.ZodString;
                                  username: z.ZodOptional<z.ZodString>;
                                },
                                z.core.$strip
                              >
                            >;
                          },
                          z.core.$strip
                        >;
                      },
                      z.core.$strip
                    >;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        object: z.ZodString;
        entry: z.ZodArray<
          z.ZodObject<
            {
              id: z.ZodOptional<z.ZodString>;
              time: z.ZodNumber;
              messaging: z.ZodArray<
                z.ZodObject<
                  {
                    sender: z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >;
                    recipient: z.ZodObject<
                      {
                        id: z.ZodString;
                      },
                      z.core.$strip
                    >;
                    timestamp: z.ZodNumber;
                    message: z.ZodOptional<
                      z.ZodObject<
                        {
                          mid: z.ZodString;
                          text: z.ZodString;
                        },
                        z.core.$strip
                      >
                    >;
                  },
                  z.core.$strip
                >
              >;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
  ]
>;
export declare const WebhookVerificationResponseSchema: z.ZodString;
export declare const WebhookProcessingResponseSchema: z.ZodObject<
  {
    success: z.ZodLiteral<true>;
  },
  z.core.$strip
>;
