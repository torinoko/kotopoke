import Image from "next/image";
import Link from "next/link";

type AppHeaderProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function AppHeader({ title, description, className = "" }: AppHeaderProps) {
  return (
    <header className={`border-b border-stone-200 pb-4 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex w-fit items-center gap-3">
          <Image
            src="/kotopoke_small.png"
            alt="ことぽけ"
            width={44}
            height={44}
            priority
            className="h-11 w-11"
          />
          <span className="text-lg font-bold text-[#5f8f86]">ことぽけ</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-stone-500">
          <Link href="/kotobatachi" className="transition hover:text-[#5f8f86]">
            ことばたち
          </Link>
        </nav>
      </div>

      {title && (
        <h1 className="mt-3 text-4xl font-medium tracking-normal text-[#5f8f86]">
          {title}
        </h1>
      )}

      {description && (
        <p className="mt-4 max-w-2xl leading-7 text-stone-700">
          {description}
        </p>
      )}
    </header>
  );
}
