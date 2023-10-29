import React from 'react';
import Navbar from './components/Navbar';
import './Gen.css';

export const Gen = () => {
    return (
        <div className="bg-[#022A3B] w-[100vw] h-[100vh]">
            <Navbar />
            <div className='flex flex-wrap m-[15px] justify-center h-[300px]'>
                <div className='bg-sky-500/100 m-[35px] w-[30%] p-3'>
                    This is emoji and random message. 
                </div>
                <div className='bg-sky-500/75 m-[35px] w-[40%] p-3'>
                    This is place for now playing thingy. 
                </div>
            </div>

            <div className='bg-sky-500/50 m-[75px] p-9'>
                This is the up next song in queue. 
            </div>
        </div>
    );
};