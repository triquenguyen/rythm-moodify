import React from 'react';
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "../convex/_generated/api"
import Navbar from './components/Navbar';

import LoginBtn from './components/LoginBtn'
import { useAction } from 'convex/react';
import { useConvexAuth } from 'convex/react';
import { getNext } from '../convex/getNext';
import { useState } from 'react';
import { redirect } from 'react-router-dom'; 

export const Home = () => {
    const { isLoading, isAuthenticated } = useConvexAuth();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        redirect("/gen"); 
    };
    const playNext = useAction(api.getNext.getNext);

    return (
        <div className="bg-[#022A3B] w-[100vw] h-[100vh]">
            <Navbar />

            <div className="absolute top-[25%] left-[50%] translate-x-[-50%] text-white color-white w-full min-w-[350px] max-w-[400px] min-h-[400px] max-h-[480px] place-items-center justify-center justify-items-center">
                <textarea
                    className="peer text-white min-w-[350px] max-w-[400px] min-h-[400px] max-h-[480px] h-full w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=""
                ></textarea>
                <label className="text-white color-white before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Input here.
                </label>
            </div>
            <div className='w-[100vw] h-[80%] items-center justify-items-center text-center'>
                <button onClick={() => { playNext(); handleSubmit(); }} className={'bg-[#3cb2f0] hover:bg-[#1a73bd] text-white font-bold py-2 px-4 rounded-md absolute top-[80%] left-[50%] translate-x-[-50%] translate-y-[-50%]'}>
                    Submit
                </button>
            </div>

        </div>
    );
};