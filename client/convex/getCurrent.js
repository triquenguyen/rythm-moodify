import { action } from "./_generated/server"; 

export const getCurrent = action({
    args: {}, 
    handler: async (ctx) => {
        const data = await ctx.auth.getUserIdentity(); 
        
        const curr_music = await fetch(
            'https://accounts.spotify.com/me/player', 
            {
                
            }
        )
    }
}); 