import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import './Gen.css';
import { useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth0 } from '@auth0/auth0-react';

export const Gen = () => {
    const getKey = useAction(api.getAccessToken.getClientToken); 

    // Run the generate playlist runner here. 
    const generatePlaylist = () => {
        const processFirst = useAction(api.getSongRec.getSongRec); 
        processFirst({
            songName: "Anti-Hero", 
            clientKey: getKey().then((res)=>res), 
        }).then(
            res => console.log(res)
        ); 
    }

    return (
        <div className="bg-[#022A3B] w-[100vw] h-[100vh]">
            <Navbar />
            
            <div className='bg-sky-500/50 relative w-[80%] h-[100px] p-2 m-2 left-[50%] translate-x-[-50%]'>
                <button onClick={() => generatePlaylist()} className='relative top-[50%] left-[50%] bg-[#3cb2f0] hover:bg-[#1a73bd] text-white font-bold py-2 px-4 rounded-md translate-x-[-50%] translate-y-[-50%'>
                    CLICK ME song list
                </button>
            </div>
        </div>
    );
};