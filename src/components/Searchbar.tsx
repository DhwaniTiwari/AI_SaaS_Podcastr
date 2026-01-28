"use client";

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from '@/lib/useDebounce' // Need to create this hook usually

const Searchbar = () => {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Simple debounce logic inside effect if hook not created
    // But creating hook is cleaner
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                router.push(`/discover?search=${search}`)
            } else if (!search && pathname === '/discover') {
                router.push('/discover')
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn);
    }, [search, router, pathname])

    return (
        <div className="relative mt-8 block">
            <Input
                className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
                placeholder="Search for podcasts"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch('')}
            />
            <Image
                src="/icons/search.svg"
                alt="search"
                height={20}
                width={20}
                className="absolute left-4 top-3.5"
            />
        </div>
    )
}

export default Searchbar;
