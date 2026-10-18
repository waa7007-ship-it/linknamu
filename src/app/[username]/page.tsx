import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LinkCard from "@/components/LinkCard";
import ProfileHeader from "@/components/ProfileHeader";
import { getPublicProfile } from "@/lib/profiles";

export async function generateMetadata({ params }: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) return { title: "페이지를 찾을 수 없습니다 | 링크나무" };

  const title = `${profile.name} | 링크나무`;
  const description = profile.bio ?? `${profile.name}님의 링크 모음`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default function ProfilePage({ params }: PageProps<"/[username]">) {
  return (
    <main className="flex flex-1 justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent params={params} />
        </Suspense>

        <footer className="mt-12 text-center text-xs text-gray-400">
          <Link href="/" className="hover:text-sky-600">
            링크나무
          </Link>
        </footer>
      </div>
    </main>
  );
}

async function ProfileContent({ params }: Pick<PageProps<"/[username]">, "params">) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) notFound();

  return (
    <>
      <ProfileHeader name={profile.name} bio={profile.bio} avatarUrl={profile.avatarUrl} />

      {profile.links.length > 0 ? (
        <ul className="mt-10 flex flex-col gap-3">
          {profile.links.map((link) => (
            <li key={link.id}>
              <LinkCard href={`/r/${link.id}`} title={link.title} icon={link.icon} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-sm text-gray-500">아직 등록된 링크가 없어요.</p>
      )}
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col items-center">
      <div className="h-24 w-24 rounded-full bg-sky-100" />
      <div className="mt-5 h-7 w-28 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-56 rounded bg-gray-200" />
      <div className="mt-10 flex w-full flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-white/70" />
        ))}
      </div>
    </div>
  );
}
