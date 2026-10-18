import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold text-sky-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">페이지를 찾을 수 없어요</h1>
        <p className="mt-3 text-[15px] text-gray-600">주소가 맞는지 다시 확인해 주세요.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-sky-600 hover:text-sky-700">
          처음으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
