"use client";

import { useState } from "react";

type AvatarProps = {
  name: string;
  src?: string;
};

// 흰 테두리와 따뜻한 그림자로 살짝 떠 있는 느낌을 준다.
const frame =
  "h-28 w-28 rounded-full ring-4 ring-white/90 shadow-[0_12px_32px_-10px_rgba(194,112,62,0.45),0_2px_6px_rgba(194,112,62,0.12)]";

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
        className={`${frame} object-cover`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} 프로필`}
      className={`${frame} grid place-items-center bg-gradient-to-br from-orange-300 to-rose-400 text-4xl font-semibold text-white`}
    >
      {name.charAt(0)}
    </div>
  );
}
