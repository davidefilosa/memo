"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import useBoardStore from "@/store/board-store";
import axios from "axios";

const Header = () => {
  const [board, searchSting, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const todos = Array.from(board.columns.entries());
  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;
    return map;
  }, {} as { [key in TypedColumn]: Todo[] });

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);
    const getSummary = async () => {
      const response = await axios.post("/api/generateSummary", {
        todos: flatArray,
      });

      setSummary(response.data.content);
      setLoading(false);
      console.log(response);
    };

    getSummary();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-16 left-0 w-full h-96 bg-gradient-to-t from-purple-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />

        <Image
          alt="logo"
          src="/logo.svg"
          height={100}
          width={250}
          className="w-38 md:w-44 m-4 pb-10 md:pb-0 object-contain"
        />
        <p className="fixed bottom-4 left-4">davidefilosa.com</p>
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          <form className="flex items-center  space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchSting}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchString(e.target.value)
              }
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5  ">
        <p className="flex items-center text-sm py-5 font-light p-5 w-fit shadow-xl  bg-white italic max-w-3xl text-[#0055d1] rounded-xl">
          <UserCircleIcon
            className={`inline-block-1 h-10  text-[#0055D1] mr-1 bg-white w-10 ${
              loading && "animate-pulse"
            } `}
          />
          {summary && !loading
            ? summary
            : "GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
};

export default Header;
