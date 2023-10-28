import { action } from "./_generated/server";
import { useAuth0 } from "@auth0/auth0-react";

export const playNext = action({
    args: {
        
    },
    handler: async (ctx) => {
        // const { user, isAuthenticated, isLoading } = useAuth0();

        
        const data = await ctx.auth.getUserIdentity(); 
        
        return data;
    },
});