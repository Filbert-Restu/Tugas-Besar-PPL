import Link from "next/link";
import { cn } from "@/lib/utils";

// Mewarisi semua props milik Next.js Link
export interface TextLinkProps extends React.ComponentProps<typeof Link> {
  className?: string;
}

export function TextLink({ className, children, ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "text-blue-600 font-medium transition-colors hover:text-blue-800 hover:underline",
        className
      )}
    >
      {children}
    </Link>
  );
}