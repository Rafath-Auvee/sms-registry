import { School } from "lucide-react";

const REPO = "https://github.com/Rafath-Auvee/sms-registry";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <School className="size-4" />
          <span>SMS Registry · Demo data only</span>
        </div>
        <nav className="flex flex-wrap gap-5">
          <a href={REPO} className="hover:text-foreground">GitHub</a>
          <a href={`${REPO}/blob/main/docs/API.md`} className="hover:text-foreground">API docs</a>
          <a href={`${REPO}#readme`} className="hover:text-foreground">README</a>
        </nav>
      </div>
    </footer>
  );
}
