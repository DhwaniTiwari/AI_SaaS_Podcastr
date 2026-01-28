"use client";

import PodcastCard from "@/components/PodcastCard";
import Searchbar from "@/components/Searchbar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function Discover() {
    const searchParams = useSearchParams();
    const search = searchParams.get('search') || '';

    const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' });

    return (
        <div className="flex flex-col gap-9">
            <Searchbar />
            <div className="flex flex-col gap-9">
                <h1 className="text-20 font-bold text-white-1">
                    {!search ? 'Discover Trending Podcasts' : 'Search Results for ' + search}
                </h1>
                {podcastsData ? (
                    <>
                        {podcastsData.length > 0 ? (
                            <div className="podcast_grid">
                                {podcastsData?.map(({ _id, imageUrl, title, description }) => (
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
                            <div className="text-white-1 font-bold text-16 text-center pt-24">No results found</div>
                        )}
                    </>
                ) : (
                    <Loader size={30} className="animate-spin text-white-1" />
                )}
            </div>
        </div>
    );
}
