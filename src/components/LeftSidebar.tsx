"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Compass, Home, Mic, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

const LeftSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();

    const IconMap = {
        Home,
        Compass,
        Mic,
        User,
    };

    return (
        <section className="left_sidebar h-[calc(100vh-5px)]">
            <nav className="flex flex-col gap-6">
                <Link href="/" className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
                    <Image src="/icons/logo.svg" alt="logo" width={23} height={27} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <h1 className="text-24 font-extrabold text-white max-lg:hidden">Podcastr</h1>
                </Link>

                {sidebarLinks.map(({ route, label, icon }) => {
                    const isActive = pathname === route || pathname.startsWith(`${route}/`);
                    const Icon = IconMap[icon as keyof typeof IconMap];

                    return (
                        <Link
                            href={route}
                            key={label}
                            className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-start", {
                                "bg-nav-focus border-r-4 border-orange-1": isActive,
                            })}
                        >
                            <Icon className={cn("size-6", isActive ? "text-white" : "text-gray-400")} />
                            <p
                                className={cn("text-16 font-semibold text-white-1 max-lg:hidden", {
                                    "text-white": isActive,
                                    "text-gray-400": !isActive,
                                })}
                            >
                                {label}
                            </p>
                        </Link>
                    );
                })}
            </nav>

            <SignedOut>
                <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                    <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                </div>
            </SignedOut>
            <SignedIn>
                <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                    <Button className="text-16 w-full bg-orange-1 font-extrabold" onClick={() => signOut(() => router.push('/'))}>
                        Log Out
                    </Button>
                </div>
            </SignedIn>
        </section>
    );
};

export default LeftSidebar;
