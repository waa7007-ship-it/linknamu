import { MongoClient, type Collection, type ObjectId } from "mongodb";
import type { LinkIcon } from "@/lib/types";

/** users 컬렉션 문서. 링크는 배열 순서 = 카드 순서 (prd.md 참고) */
export type UserDoc = {
  _id: ObjectId;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  links: {
    _id: ObjectId;
    title: string;
    url: string;
    icon: LinkIcon;
    isHidden: boolean;
    clickCount: number;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

/** clicks 컬렉션 문서. 클릭 1회 = 문서 1개 */
export type ClickDoc = {
  _id?: ObjectId;
  linkId: ObjectId;
  userId: ObjectId;
  clickedAt: Date;
  visitorHash: string;
};

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "linknamu";

/** .env.local에 MONGODB_URI가 있으면 MongoDB를 쓰고, 없으면 샘플 데이터로 동작한다 (개발용). */
export const isDbConfigured = Boolean(uri);

// 개발 중 파일이 바뀔 때마다 연결이 새로 생기지 않도록 전역에 보관한다.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI가 설정되지 않았습니다. .env.local을 확인하세요.");
  }
  globalForMongo._mongoClientPromise ??= new MongoClient(uri).connect();
  return globalForMongo._mongoClientPromise;
}

export async function usersCollection(): Promise<Collection<UserDoc>> {
  const client = await getClient();
  return client.db(dbName).collection<UserDoc>("users");
}

export async function clicksCollection(): Promise<Collection<ClickDoc>> {
  const client = await getClient();
  return client.db(dbName).collection<ClickDoc>("clicks");
}
