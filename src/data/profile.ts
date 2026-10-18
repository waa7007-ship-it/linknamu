// MONGODB_URI가 없을 때 쓰는 샘플 데이터 (개발용).
// 같은 데이터를 `npm run db:seed`로 MongoDB에 넣을 수 있다 (scripts/seed.mts).

import type { LinkIcon } from "@/lib/types";

export type SampleUser = {
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: { id: string; title: string; url: string; icon: LinkIcon; isHidden: boolean }[];
};

export const sampleUsers: SampleUser[] = [
  {
    username: "gildong",
    name: "홍길동",
    bio: "코드와 커피, 책과 산책을 좋아합니다",
    links: [
      { id: "6710a0000000000000000001", title: "GitHub", url: "https://github.com/", icon: "github", isHidden: false },
      { id: "6710a0000000000000000002", title: "기술 블로그", url: "https://velog.io/", icon: "blog", isHidden: false },
      { id: "6710a0000000000000000003", title: "Instagram", url: "https://www.instagram.com/", icon: "instagram", isHidden: false },
      { id: "6710a0000000000000000004", title: "LinkedIn", url: "https://www.linkedin.com/", icon: "linkedin", isHidden: false },
    ],
  },
];
