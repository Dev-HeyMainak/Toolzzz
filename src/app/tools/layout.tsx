
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12"> {/* Reverted to container mx-auto */}
       <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Tools
        </Link>
      </Button>
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
