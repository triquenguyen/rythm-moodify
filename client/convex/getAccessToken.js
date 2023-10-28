"use node"
import { action } from "./_generated/server";

export const getToken = action({
  handler: async () => {
    const spotify_id = process.env.CLIENT_ID;
    const spotify_secret = process.env.CLIENT_SECRET;

    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(spotify_id + ':' + spotify_secret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + spotify_id + '&client_secret=' + spotify_secret
      }
    ).catch(
      error => console.log('error')
    )

    if (response.ok) {
      const data = await response.json(); 
      return data.access_token;
    }
    console.log(response.status);
    console.log(response.statusText);
    return null; 

  },
});