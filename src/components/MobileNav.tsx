"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Compass, Home, Mic, User, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
    const pathname = usePathname();

    const IconMap = {
        Home,
        Compass,
        Mic,
        User,
    };

    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <Menu className="cursor-pointer text-white" />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-black-1">
                    <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 pl-4">
                        <Image src="/logo.png" alt="logo" width={23} height={27} />
                        <h1 className="text-24 font-extrabold text-white-1 ml-2">Podcastr</h1>
                    </Link>
                    <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 text-white-1">
                                {sidebarLinks.map(({ route, label, icon }) => {
                                    const isActive = pathname === route || pathname.startsWith(`${route}/`);
                                    const Icon = IconMap[icon as keyof typeof IconMap];
                                    return (
                                        <SheetClose asChild key={route}>
                                            <Link
                                                href={route}
                                                className={cn(
                                                    "flex gap-3 items-center py-4 max-lg:px-4 justify-start",
                                                    {
                                                        "bg-nav-focus border-r-4 border-orange-1": isActive,
                                                    }
                                                )}
                                            >
                                                <Icon className={cn("size-6", isActive ? "text-white" : "text-gray-400")} />
                                                <p className={cn("text-base font-semibold text-white-1", { "text-white": isActive, "text-gray-400": !isActive })}>{label}</p>
                                            </Link>
                                        </SheetClose>
                                    );
                                })}
                            </nav>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    );
};

export default MobileNav;
