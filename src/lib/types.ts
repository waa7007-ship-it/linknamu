// 화면과 데이터 계층이 함께 쓰는 타입. DB 문서 구조는 prd.md의 "데이터 모델" 참고.

export type LinkIcon =
  | "instagram"
  | "youtube"
  | "x"
  | "github"
  | "linkedin"
  | "blog"
  | "link";

/** 공개 페이지에 보여 줄 링크 (숨긴 링크·클릭 수는 포함하지 않음) */
export type PublicLink = {
  id: string;
  title: string;
  icon: LinkIcon;
};

/** 공개 페이지에 보여 줄 프로필 */
export type PublicProfile = {
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: PublicLink[];
};
