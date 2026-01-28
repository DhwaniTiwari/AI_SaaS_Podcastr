"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import PodcastCard from "@/components/PodcastCard"; // Reuse component
import { Loader } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const Profile = () => {
    const { user } = useUser();
    // Fetch user data via Convex if needed, or primarily podcasts by authorId
    // The 'users' table stores clerkId.

    // We need query to get podcasts by authorId.
    // Let's add that to podcasts.ts or filter locally? Filter locally is bad for scalability.
    // We should add `getPodcastByAuthorId` in podcasts.ts.

    // For now, let's look at `convex/podcasts.ts`.
    // It has `getTrendingPodcasts` and `getPodcastBySearch`.
    // I will assume we add `getPodcastByAuthorId`.

    const podcastData = useQuery(api.podcasts.getPodcastByAuthorId, {
        authorId: user?.id || ''
    });

    if (!user || !podcastData) return <Loader className="animate-spin text-white-1" size={30} />;

    return (
        <section className="mt-9 flex flex-col">
            <h1 className="text-20 font-bold text-white-1 max-md:text-center">My Profile</h1>
            <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
                <div className="relative h-[250px] w-[250px]">
                    <Image
                        src={user.imageUrl}
                        layout="fill"
                        className="rounded-full object-cover"
                        alt="profile"
                    />
                </div>
                <div className="flex flex-col justify-center max-md:items-center">
                    <h1 className="text-32 font-extrabold text-white-1">{user.fullName}</h1>
                    <h2 className="text-base font-normal text-white-1">@{user.username || 'user'}</h2>
                </div>
            </div>

            <section className="mt-9 flex flex-col gap-5">
                <h1 className="text-20 font-bold text-white-1">My Podcasts</h1>
                {podcastData && podcastData.length > 0 ? (
                    <div className="podcast_grid">
                        {podcastData?.map(({ _id, imageUrl, title, description }) => (
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
                    <p className="text-base font-normal text-white-2">You have not created any podcasts yet</p>
                )}
            </section>
        </section>
    )
}

export default Profile;
