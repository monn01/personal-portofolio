type SkillOrbProps = {
  name: string;
};

export function SkillOrb({ name }: SkillOrbProps) {
  return (
    <div className="group flex items-center rounded-full border border-border bg-surface px-4 py-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-surface-hover hover:shadow-lg hover:shadow-accent/20">
      <span className="text-sm font-bold text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {name}
      </span>
    </div>
  );
}
