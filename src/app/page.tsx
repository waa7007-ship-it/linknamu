import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import type { LinkIcon } from "@/lib/types";

// 보여 주기용 더미 값. 진짜 내용은 나중에 채운다.
const profile = {
  name: "이름",
  bio: "한 줄 소개를 여기에 적어 주세요",
  avatarUrl: "/avatar-placeholder.svg",
};

const links: { title: string; url: string; icon: LinkIcon }[] = [
  { title: "GitHub", url: "https://github.com/", icon: "github" },
  { title: "LinkedIn", url: "https://www.linkedin.com/", icon: "linkedin" },
  { title: "Blog", url: "https://example.com/", icon: "blog" },
];

export default function Home() {
  return (
    <main className="flex flex-1 justify-center px-4 py-14 sm:py-24">
      <div className="w-full max-w-md">
        <ProfileHeader name={profile.name} bio={profile.bio} avatarUrl={profile.avatarUrl} />

        <ul className="mt-14 flex flex-col gap-5">
          {links.map((link) => (
            <li key={link.title}>
              <LinkCard href={link.url} title={link.title} icon={link.icon} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
