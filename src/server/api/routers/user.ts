import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  get: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUniqueOrThrow({
        where: {
          email: input.email,
        },
      });
    }),
  create: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.create({
        data: {
          email: input.email,
        },
      });
    }),
  getLeaderboard: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      take: 25,
      orderBy: {
        score: "desc",
      },
    });
  }),
  getRank: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx }) => {
      const emails = await ctx.prisma.user.findMany({
        orderBy: {
          score: "desc",
        },
        select: {
          email: true,
        },
      });

      const index = emails.findIndex((v) => v.email);
      return index;
    }),
  saveGame: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        increment: z.number().int(),
        levelCleared: z.number().int(),
        virusLevel: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          virusLevel: input.virusLevel,
          levelCleared: input.levelCleared,
          score: {
            increment: input.increment,
          },
        },
      });
    }),
});
