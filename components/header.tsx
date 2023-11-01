"use client";

import Image from "next/image";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Avatar from "react-avatar";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const Header = () => {
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-[65vh] bg-gradient-to-tr from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />

        <Image
          alt="logo"
          src="/logo.svg"
          height={100}
          width={300}
          className="w-44 md:w-56 m-4 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <Avatar name="Davide Filosa" size="50" round={true} color="#0055D1" />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm py-5 font-light pr-5 shadow-xl w-fit bg-white italict max-w-3xl text-[#0055d1] rounded-xl">
          <UserCircleIcon className="inline-block h-10 w-10 text-[#0055D1] mr-1" />
          GPT is summarizing your tasks for the days...
        </p>
      </div>
    </header>
  );
};

export default Header;
