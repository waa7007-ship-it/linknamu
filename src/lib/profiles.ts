import { createHash } from "node:crypto";
import { ObjectId } from "mongodb";
import { cacheLife, cacheTag } from "next/cache";
import { sampleUsers } from "@/data/profile";
import { clicksCollection, isDbConfigured, usersCollection } from "@/lib/mongodb";
import type { PublicProfile } from "@/lib/types";

const DUPLICATE_WINDOW_MS = 10_000;

/** 공개 페이지 캐시 태그. 관리 화면에서 저장할 때 updateTag(profileTag(username))로 갱신한다. */
export function profileTag(username: string) {
  return `profile:${username}`;
}

/** 공개 페이지용 프로필. 숨긴 링크와 클릭 수는 빼고 돌려준다. 없으면 null. */
export async function getPublicProfile(username: string): Promise<PublicProfile | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(profileTag(username.toLowerCase()));

  const key = username.toLowerCase();

  if (!isDbConfigured) {
    const user = sampleUsers.find((u) => u.username === key);
    if (!user) return null;
    return {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      links: user.links
        .filter((l) => !l.isHidden)
        .map(({ id, title, icon }) => ({ id, title, icon })),
    };
  }

  const users = await usersCollection();
  const user = await users.findOne(
    { username: key },
    { projection: { username: 1, name: 1, bio: 1, avatarUrl: 1, links: 1 } },
  );
  if (!user) return null;

  return {
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    links: user.links
      .filter((l) => !l.isHidden)
      .map((l) => ({ id: l._id.toHexString(), title: l.title, icon: l.icon })),
  };
}

/** 리다이렉트 대상 링크. 숨겼거나 없는 링크면 null. */
export async function findLinkForRedirect(
  linkId: string,
): Promise<{ url: string; linkId: string; userId: string | null } | null> {
  if (!ObjectId.isValid(linkId)) return null;

  if (!isDbConfigured) {
    for (const user of sampleUsers) {
      const link = user.links.find((l) => l.id === linkId && !l.isHidden);
      if (link) return { url: link.url, linkId, userId: null };
    }
    return null;
  }

  const id = new ObjectId(linkId);
  const users = await usersCollection();
  const user = await users.findOne(
    { "links._id": id },
    { projection: { _id: 1, "links.$": 1 } },
  );
  const link = user?.links[0];
  if (!user || !link || link.isHidden) return null;

  return { url: link.url, linkId, userId: user._id.toHexString() };
}

/** IP·브라우저 정보를 해시한다. 원본은 저장하지 않는다. */
export function hashVisitor(ip: string, userAgent: string) {
  const salt = process.env.CLICK_HASH_SALT ?? "";
  return createHash("sha256").update(`${ip}|${userAgent}|${salt}`).digest("hex");
}

/** 클릭 1회를 기록한다. 같은 방문자가 10초 안에 다시 누른 클릭은 세지 않는다. */
export async function recordClick(linkId: string, userId: string | null, visitorHash: string) {
  if (!isDbConfigured || !userId) {
    console.info(`[클릭] ${linkId} (MONGODB_URI가 없어 기록하지 않음)`);
    return;
  }

  const link = new ObjectId(linkId);
  const clicks = await clicksCollection();
  const recent = await clicks.findOne({
    linkId: link,
    visitorHash,
    clickedAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
  });
  if (recent) return;

  await clicks.insertOne({
    linkId: link,
    userId: new ObjectId(userId),
    clickedAt: new Date(),
    visitorHash,
  });

  const users = await usersCollection();
  await users.updateOne({ "links._id": link }, { $inc: { "links.$.clickCount": 1 } });
}
