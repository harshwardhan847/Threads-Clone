import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const addThreadMessage = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    websiteUrl: v.optional(v.string()),
    threadId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    return ctx.db.insert("messages", {
      ...args,
      commentCount: 0,
      likeCount: 0,
      retweetCount: 0,
      userId: user!._id,
    });

    if (args.threadId) {
      //TODO
    }
  },
});
