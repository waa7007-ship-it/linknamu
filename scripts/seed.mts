// MongoDB에 인덱스를 만들고 샘플 사용자(gildong)를 넣는다.
// 실행: npm run db:seed  (.env.local의 MONGODB_URI 사용)
// 샘플 데이터는 src/data/profile.ts와 같은 값이다.

import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "linknamu";

if (!uri) {
  console.error("MONGODB_URI가 없습니다. .env.local에 넣은 뒤 다시 실행하세요.");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection("users");
  const clicks = db.collection("clicks");

  await users.createIndex({ username: 1 }, { unique: true });
  await users.createIndex({ email: 1 }, { unique: true });
  await users.createIndex({ "links._id": 1 });
  await clicks.createIndex({ linkId: 1, visitorHash: 1, clickedAt: -1 });
  await clicks.createIndex({ userId: 1, clickedAt: -1 });
  console.log("인덱스 생성 완료");

  const now = new Date();
  const link = (id: string, title: string, url: string, icon: string) => ({
    _id: new ObjectId(id),
    title,
    url,
    icon,
    isHidden: false,
    clickCount: 0,
    createdAt: now,
  });

  await users.updateOne(
    { username: "gildong" },
    {
      $setOnInsert: {
        email: "gildong@example.com",
        username: "gildong",
        name: "홍길동",
        bio: "코드와 커피, 책과 산책을 좋아합니다",
        links: [
          link("6710a0000000000000000001", "GitHub", "https://github.com/", "github"),
          link("6710a0000000000000000002", "기술 블로그", "https://velog.io/", "blog"),
          link("6710a0000000000000000003", "Instagram", "https://www.instagram.com/", "instagram"),
          link("6710a0000000000000000004", "LinkedIn", "https://www.linkedin.com/", "linkedin"),
        ],
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  console.log("샘플 사용자 gildong 준비 완료 → http://localhost:3000/gildong");
} finally {
  await client.close();
}
