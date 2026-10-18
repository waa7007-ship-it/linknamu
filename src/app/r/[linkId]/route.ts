import { after, userAgent, type NextRequest } from "next/server";
import { findLinkForRedirect, hashVisitor, recordClick } from "@/lib/profiles";

// 카드 클릭 → 클릭 기록 → 원래 URL로 302 리다이렉트.
// 기록은 응답을 보낸 뒤(after) 처리해서, 기록이 느리거나 실패해도 이동은 막히지 않는다.
export async function GET(request: NextRequest, ctx: RouteContext<"/r/[linkId]">) {
  const { linkId } = await ctx.params;
  const link = await findLinkForRedirect(linkId);

  // DB에 저장된 http/https 주소로만 보낸다.
  if (!link || !/^https?:\/\//i.test(link.url)) {
    return new Response("링크를 찾을 수 없습니다.", { status: 404 });
  }

  const ua = userAgent(request);
  if (!ua.isBot) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const visitorHash = hashVisitor(ip, ua.ua);
    after(async () => {
      try {
        await recordClick(link.linkId, link.userId, visitorHash);
      } catch (error) {
        console.error("[클릭] 기록 실패", error);
      }
    });
  }

  return Response.redirect(link.url, 302);
}
