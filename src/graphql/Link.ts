import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

// extend the "Query" root type, adding a new root field called "feed"
export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      // this is the resolver function of the "feed" query
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany();
      },
    });
  },
});

// extend to "Mutation" root type, creating a mutation called "post" for adding new links
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
          },
        });
        return newLink;
      },
    });
  },
});
