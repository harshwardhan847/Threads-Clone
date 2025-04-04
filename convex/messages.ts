import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

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

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
    refreshKey: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let threads;
    if (args.userId) {
      threads = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      threads = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("threadId"), undefined))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    const messageWithCreatorAndImages = await Promise.all(
      threads.page.map(async (thread) => {
        const creator = await getMessageCreator(ctx, thread.userId);
        const mediaUrls = await getMediaUrls(ctx, thread.mediaFiles);

        return { ...thread, creator, mediaFiles: mediaUrls };
      })
    );
    return {
      ...threads,
      page: messageWithCreatorAndImages,
    };
  },
});

const getMessageCreator = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);

  if (!user?.imageUrl || user?.imageUrl?.startsWith("http")) {
    return user;
  }
  const imageUrl = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  return { ...user, imageUrl };
};

const getMediaUrls = async (
  ctx: QueryCtx,
  mediaFiles?: string[] | undefined
) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    return [];
  }
  const urlPromises = mediaFiles?.map((file) =>
    ctx.storage.getUrl(file as Id<"_storage">)
  );
  const result = await Promise.allSettled(urlPromises);
  return result
    ?.filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
};

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getCurrentUserOrThrow(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
