import { Dispatch, SetStateAction } from "react";
import { Id } from "../../convex/_generated/dataModel";

export interface GeneratePodcastProps {
    voiceType: string;
    setAudio: Dispatch<SetStateAction<string>>;
    audio: string;
    setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
    voicePrompt: string;
    setVoicePrompt: Dispatch<SetStateAction<string>>;
    setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
    setImage: Dispatch<SetStateAction<string>>;
    setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
    image: string;
    imagePrompt: string;
    setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface AudioProps {
    title: string;
    audioUrl: string;
    author: string;
    imageUrl: string;
    podcastId: string;
}

export interface AudioContextType {
    audio: AudioProps | undefined;
    setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}
