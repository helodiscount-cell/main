import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import phoneImg from "@/assets/png/phone.png";

type AutomationLayoutProps = {
  header: React.ReactNode;
  leftCol: React.ReactNode;
  rightCol: React.ReactNode;
};

export function AutomationLayout({
  header,
  leftCol,
  rightCol,
}: AutomationLayoutProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {header}
      </header>

      {/* Main canvas */}
      <div
        className="flex-1 m-4 rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#D4D4D4",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M12 8v8M8 12h8' stroke='%23BEBEBE' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="justify-center h-full grid grid-cols-[280px_30rem_280px] gap-4 p-4 overflow-hidden">
          {/* Left: Keywords */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            {leftCol}
          </div>

          {/* Center: Phone mockup */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full flex items-start justify-center">
              <div className="relative drop-   -2xl h-full w-full">
                <Image
                  src={phoneImg}
                  alt="Phone preview"
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: Scrollable widgets */}
          <div className="flex flex-col justify-center gap-3 overflow-y-auto pr-1">
            {rightCol}
          </div>
        </div>
      </div>
    </>
  );
}
