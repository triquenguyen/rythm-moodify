"use node"
import { action } from "./_generated/server";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * this method returns handles a process to start a certain playlist for a user that logged in. 
 * @post playlist starts on logged in user
 */
export const getNext = action({
    args: {},
    handler: async (ctx) => {
        const data = await ctx.auth.getUserIdentity(); 
        console.log("user identity: ");
        console.log(data);
        


        const d2 = await ctx.storage.generateUploadUrl(); 
        console.log("user upload url: ");
        console.log(d2);

        const d3 = await ctx.storage.get.toString(); 
        console.log("some storage string thing: ");
        console.log(d3);

        return data;
    },
});