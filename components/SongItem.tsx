"use client";

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from '@/hooks/usePlayer';
import { Tables } from "@/types_db";
import Image from "next/image";
import React from "react";

interface SongItemProps {
  data: Tables<'songs'>;
}

const SongItem: React.FC<SongItemProps> = ({
  data
}) => {
  const imagePath = useLoadImage(data);
  const player = usePlayer();

  const handleClick = () => {
    // The fix is here: converting the numeric ID to a string
    player.setId(String(data.id));
    player.setIsPlaying(true);
  };

  return (
    <div
      onClick={handleClick}
      className="
        relative
        group
        flex
        flex-col
        items-center
        justify-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-400/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
      "
    >
      <div
        className="
          relative
          aspect-square
          w-full
          h-full
          rounded-md
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imagePath || '/images/liked.png'}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.title}
        </p>
        <p className="
          text-neutral-400
          text-sm
          pb-4
          w-full
          truncate
        ">
          By {data.author}
        </p>
      </div>
    </div>
  );
}

export default SongItem;
