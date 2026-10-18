import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import type { LinkIcon } from "@/lib/types";

const profile = {
  name: "홍혜원",
  bio: "크리에이터 ㅣ 요즘에는 화 많이 냄",
  // 아바타가 112px(h-28)이라 고해상도 화면용으로 2배 크기를 받는다.
  avatarUrl: "https://placehold.co/224x224/orange/white",
};

const links: { title: string; url: string; icon: LinkIcon; emoji: string }[] = [
  { title: "깃허브", url: "https://github.com/waa7007-ship-it", icon: "github", emoji: "🐙" },
  { title: "블로그", url: "https://blog.naver.com/ai_seller_mk", icon: "blog", emoji: "✍️" },
  { title: "이메일", url: "mailto:waa7471478@gmail.com", icon: "link", emoji: "💌" },
  { title: "인스타그램", url: "https://www.instagram.com/ai_seller_mk/", icon: "instagram", emoji: "📸" },
];

export default function Home() {
  return (
    <main className="flex flex-1 justify-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-md">
        <ProfileHeader name={profile.name} bio={profile.bio} avatarUrl={profile.avatarUrl} />

        <ul className="mt-12 flex flex-col gap-4">
          {links.map((link) => (
            <li key={link.title}>
              <LinkCard href={link.url} title={link.title} icon={link.icon} emoji={link.emoji} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
