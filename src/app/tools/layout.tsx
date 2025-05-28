
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 flex flex-col flex-1"> {/* Ensure this container can also grow if needed */}
       <Button variant="outline" asChild className="mb-6 self-start"> {/* self-start for button */}
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Tools
        </Link>
      </Button>
      {/* Make the card a flex container that can grow */}
      <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg flex flex-col flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
