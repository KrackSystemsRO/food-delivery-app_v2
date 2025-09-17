import type { LucideIcon } from "lucide-react";

interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

interface TeamSwitcherProps {
  teams: Team[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {teams.map((team) => (
        <div key={team.name} className="flex items-center gap-2">
          <team.logo className="!size-5" />
          <div>
            <p className="text-sm font-semibold">{team.name}</p>
            <p className="text-xs text-muted-foreground">{team.plan}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
