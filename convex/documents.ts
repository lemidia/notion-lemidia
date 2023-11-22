import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId: userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      isArchived: true,
    });

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const childDocuments = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      //   childDocuments.forEach((document) => archive(ctx, { id: document._id }));

      for (const child of childDocuments) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    await recursiveArchive(args.id);

    return;
  },
});

// Retrieve data whose 'archive' field set as true
export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    let options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options = { ...options, parentDocument: undefined };
      }
    }

    const patchedDoc = await ctx.db.patch(args.id, options);

    // Do this recursively for all each child
    const recursiveUnarchive = async (documentId: Id<"documents">) => {
      const childDocuments = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of childDocuments) {
        await ctx.db.patch(child._id, { isArchived: false });

        recursiveUnarchive(child._id);
      }
    };

    recursiveUnarchive(args.id);

    return patchedDoc;
  },
});

// Remove the note permanently and for also its children recursively
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Delete the note
    await ctx.db.delete(args.id);

    // Schedule deleting storageId for cover-image related to this note
    if (existingDocument.storageId) {
      await ctx.scheduler.runAfter(0, api.images.deleteStorageId, {
        storageId: existingDocument.storageId,
      });
    }

    const recursiveRemove = async (documentId: Id<"documents">) => {
      const childDocuments = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of childDocuments) {
        await ctx.db.delete(child._id);
        // Schedule deleting storageId for cover-image related to this child note
        if (child.storageId) {
          await ctx.scheduler.runAfter(0, api.images.deleteStorageId, {
            storageId: child.storageId,
          });
        }
        recursiveRemove(child._id);
      }
    };

    recursiveRemove(args.id);

    return "success";
  },
});

// Clear all the notes in the trash
export const clearTrash = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        message: "Not authenticated",
      });
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    const promiseArray = documents.map(async (document) => {
      if (document.userId !== userId) {
        throw new ConvexError({
          message: "Unauthorized",
        });
      }
      // Delete the note by given id
      await ctx.db.delete(document._id);
      // Schedule deleting storageId for cover-image related to this note
      if (document.storageId) {
        await ctx.scheduler.runAfter(0, api.images.deleteStorageId, {
          storageId: document.storageId,
        });
      }
    });

    await Promise.all(promiseArray);

    return "success";
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);

    if (!document) {
      // return null;
      throw new ConvexError({
        message: "Note not found",
      });
    }

    // If this document has storageId for cover-image then get the URL for a file in storage and assigns URL to its field "coverImage" as value.
    if (document.storageId) {
      document.coverImage =
        (await ctx.storage.getUrl(document.storageId)) || undefined;
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    const identity = await ctx.auth.getUserIdentity();
    const isMine = document.userId === identity?.subject;

    if (!isMine) {
      throw new ConvexError({
        message: "Note is not published.",
      });
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    storageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated ");
    }

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    const userId = identity.subject;

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Unset icon field
    if (rest.icon === "undefined") {
      rest.icon = undefined;
    }

    // Unset storageId field
    if (rest.storageId === "undefined") {
      rest.storageId = undefined;
    }

    // Do patch with given args. (rest)
    await ctx.db.patch(id, rest);

    return "success";
  },
});
