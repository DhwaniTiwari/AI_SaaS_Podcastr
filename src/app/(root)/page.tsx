"use client";

import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader } from "lucide-react";

export default function Home() {
    const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

    if (!trendingPodcasts) return <Loader className="animate-spin ml-2" size={30} />;

    return (
        <div className="mt-9 flex flex-col gap-9">
            <section className="flex flex-col gap-5">
                <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
                <div className="podcast_grid">
                    {trendingPodcasts?.map(({ _id, imageUrl, title, description }) => (
                        <PodcastCard
                            key={_id}
                            imgUrl={imageUrl as string}
                            title={title}
                            description={description}
                            podcastId={_id}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
