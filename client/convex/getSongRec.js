"use node"
import axios from "axios";
import { action } from "./_generated/server"
import { v } from "convex/values";

export const getSongRec = action({
    args: {
        songName: v.string(),
        clientKey: v.string(),
    },
    handler: async (ctx, args) => {
        const enc_track = encodeURIComponent(args.songName); 
        var raw = await axios({
            method: `GET`,
            url: `https://api.spotify.com/v1/search?q=${enc_track}&type=track&limit=4`,
            responseType: 'stream'
        }).then(function (response) {
            console.log(response.data);
        }).catch((err) => {
            console.log(err); 
        });
    }
})