import { Overwrite, Simplify } from "@trpc/server";
import { ResolveOptions } from "@trpc/server/dist/core/internals/utils";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getNextMeeting: publicProcedure.query(({ ctx }) => {
      const now = new Date();
      return ctx.prisma.meeting.findFirst({
          select: {
              date: true,
              location: true,
          },
          where: {
              date: {
                  gte: now
              }
          },
          orderBy: {
              date: 'desc'
          }
      });
  }),

  getNextMeetingLink: protectedProcedure.query(({ ctx }) => {
      const now = new Date();
      return ctx.prisma.meeting.findFirst({
          select: {
              slidesUrl: true
          },
          where: {
              date: {
                  gte: now
              }
          },
          orderBy: {
              date: 'desc'
          }
      });
  })
});
