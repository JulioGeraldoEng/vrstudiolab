type CardProps = {
  title: string;
  value: number;
  detail: string;
  icon: string;
  color?: string;
  bg?: string;
};

export default function Cards({
  title,
  value,
  detail,
  icon,
  color = "text-cyan-300",
  bg = "bg-cyan-400/10",
}: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111b2d] p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#1a2940] hover:shadow-lg hover:shadow-cyan-400/10">
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${bg} ${color}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value.toString().padStart(2, "0")}
      </p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}