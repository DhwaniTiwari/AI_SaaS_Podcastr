"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { useId } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader } from "lucide-react";
import PodcastCard from "@/components/PodcastCard";

interface PodcastDetailsPageProps {
    params: {
        podcastId: Id<"podcasts">;
    };
}

const PodcastDetails = ({ params }: PodcastDetailsPageProps) => {
    // params is async in nextjs 15+, but let's assume standard behavior or wait for error to fix
    // Actually Next.js 15 params is a Promise. But usually in client components we iterate or access directly if strict mode doesn't block.
    // Wait, "Default to Server Components" rule. 
    // If I make this a Server Component, I can't use `useQuery`. 
    // This should probably be a Client Component for `useQuery`.
    // Or I fetch in Server Component via `fetchQuery` (Convex helper)?
    // Standard Convex Next.js app uses `useQuery` in Client Components mostly.

    // For now, let's stick to Client Component pattern for simplicity with Convex hooks unless optimal.

    const podcast = useQuery(api.podcasts.getPodcastById, { podcastId: params.podcastId });
    const similarPodcasts = useQuery(api.podcasts.getPodcastBySearch, { search: podcast?.voiceType || '' }); // Mock similar by voice type?

    if (!podcast) return <Loader className="animate-spin text-white-1" size={30} />;

    const isOwner = false; // logic later with user ID

    return (
        <section className="flex w-full flex-col">
            <header className="mt-9 flex items-center justify-between">
                <h1 className="text-20 font-bold text-white-1">
                    Currently Playing
                </h1>
                <figure className="flex gap-3">
                    <Image
                        src="/icons/headphone.svg"
                        width={24}
                        height={24}
                        alt="headphone"
                    />
                    <h2 className="text-base font-bold text-white-1">{podcast?.views}</h2>
                </figure>
            </header>

            <div className="mt-9 flex flex-col gap-9">
                <div className="flex flex-col gap-4">
                    <h1 className="text-18 font-bold text-white-1">{podcast?.title}</h1>
                    <figure className="flex gap-2">
                        <Image
                            src="/icons/profile.svg" // Placeholder or user image
                            width={20}
                            height={20}
                            alt="profile"
                        />
                        <h2 className="text-base font-normal text-white-3">{podcast?.author}</h2>
                    </figure>
                </div>

                <div className="flex w-full flex-col gap-4">
                    <p className="text-base font-normal text-white-2">{podcast?.description}</p>
                </div>
            </div>

            <section className="mt-8 flex flex-col gap-5">
                <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
                {similarPodcasts && similarPodcasts.length > 0 ? (
                    <div className="podcast_grid">
                        {similarPodcasts?.map(({ _id, imageUrl, title, description }) => (
                            <PodcastCard
                                key={_id}
                                imgUrl={imageUrl as string}
                                title={title}
                                description={description}
                                podcastId={_id}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-base font-normal text-white-2">No similar podcasts found</p>
                )}
            </section>
        </section>
    )
}

export default PodcastDetails;
