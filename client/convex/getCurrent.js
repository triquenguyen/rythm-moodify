import { action } from "./_generated/server"; 
import { api } from "../convex/_generated/api"
import { useAuth0 } from "@auth0/auth0-react";
import { v } from "convex/values";

export const getCurrent = action({
    args: {
        access_token: v.string()
    }, 
    handler: async (_, args) => {
        // const spotify_id = process.env.CLIENT_ID;
        // const spotify_secret = process.env.CLIENT_SECRET;

        console.log("Access Token: " + args.access_token);
    
        // const base64Token = btoa(`${spotify_id}:${spotify_secret}`)
        // const base64Token = `BQBq-_M3s6w9tNWfLtYIbugNAkMs8Y_sO_ggAsjKAu6oNKa8jWqiTgFLGs013v15l_4hGjGJIoa62SqABvG7Ac1sDzQUcO-3C5dB_MUllwU56Mc8SdM`; 
       
        const curr_music = await fetch(
            'https://api.spotify.com/v1/me/player', 
            {
                method: 'GET', 
                headers: {
                    'Market': `Bearer ${args.access_token}`,
                    'additional_types': 'track', 
                }
            }
        ).catch(
            error => console.log("error from getCurrent.js") 
        )

        console.log(curr_music.status);
        console.log(curr_music.statusText);

        return 0; 
    }
}); 