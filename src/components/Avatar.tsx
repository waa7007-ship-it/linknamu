"use client";

import { useState } from "react";

type AvatarProps = {
  name: string;
  src?: string;
};

// 사진이 없거나 불러오지 못하면 이름 첫 글자로 원형 아바타를 보여 준다.
export default function Avatar({ name, src }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 사용자가 올린 외부 이미지 URL
      <img
        src={src}
        alt={`${name} 프로필 사진`}
        onError={() => setFailed(true)}
        className="h-24 w-24 rounded-full object-cover ring-4 ring-sky-100"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} 프로필`}
      className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-3xl font-bold text-white ring-4 ring-sky-100"
    >
      {name.charAt(0)}
    </div>
  );
}
