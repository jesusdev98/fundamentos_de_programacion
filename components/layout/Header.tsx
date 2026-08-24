import Link from "next/link";

const navigation = [
  { label: "Lenguajes", href: "/#lenguajes" },
  { label: "Fuentes", href: "/fuentes" },
] as const;

export function Header() {
  return (
    <header className="site-header border-b">
      <div className="header-inner page-container flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" className="flex min-h-11 items-center text-sm font-extrabold leading-tight tracking-[-0.02em] sm:text-base">
          <span className="brand-mark" aria-hidden="true" />
          Fundamentos de la Programación
        </Link>
        <nav className="header-nav" aria-label="Navegación principal">
          <ul className="flex items-center">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
