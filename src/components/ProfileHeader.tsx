import Avatar from "@/components/Avatar";

type ProfileHeaderProps = {
  name: string;
  bio?: string;
  avatarUrl?: string;
};

export default function ProfileHeader({ name, bio, avatarUrl }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <Avatar name={name} src={avatarUrl} />
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-stone-900">{name}</h1>
      {bio && (
        <p className="mt-2 text-[15px] leading-relaxed text-stone-500 break-keep">{bio}</p>
      )}
    </header>
  );
}
