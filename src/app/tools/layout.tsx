
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12"> {/* Changed container mx-auto to w-full */}
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
