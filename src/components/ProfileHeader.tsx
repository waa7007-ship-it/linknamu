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
      <h1 className="mt-7 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{name}</h1>
      {bio && (
        <p className="mt-4 text-lg leading-relaxed text-gray-600 break-keep sm:text-xl">{bio}</p>
      )}
    </header>
  );
}
