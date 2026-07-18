import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "ことぽけについて" },
  { href: "/terms", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "おたより" },
];

export function AppFooter() {
  return (
    <footer className="mt-12 border-t border-stone-200 py-6 text-sm text-stone-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ことぽけ</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#5f8f86]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
