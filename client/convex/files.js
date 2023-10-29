import { v } from "convex/values";
import { mutation } from "./_generated/server";
 
export const saveStorageId = mutation({
  // You can customize these as you like
  args: {
    uploaded: v.object({
      storageId: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...
 
    // Save the storageId to the database using `insert`
    ctx.db.insert("files", {
      storageId: args.uploaded.storageId,
    });
  },
});