import Image from "next/image";
import clsx from "clsx";

export function TieoutMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/tieout-mark.png"
      alt="Tieout"
      width={240}
      height={272}
      priority
      className={clsx("shrink-0 object-contain", className || "h-7 w-auto")}
    />
  );
}

export function TieoutWordmark({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className="inline-flex items-center shrink-0">
      <Image
        src={dark ? "/brand/tieout-logo-dark.png" : "/brand/tieout-logo-light.png"}
        alt="Tieout"
        width={864}
        height={272}
        priority
        className={clsx("h-7 sm:h-8 w-auto object-contain", className)}
      />
    </span>
  );
}
