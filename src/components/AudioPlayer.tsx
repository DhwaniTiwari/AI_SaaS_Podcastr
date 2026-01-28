"use client";

import { useAudio } from "@/components/providers/AudioProvider";
import { cn } from "@/lib/utils";
import { Loader, Pause, Play, Forward, Rewind, Volume2 } from "lucide-react"; // Replaced custom icons with Lucide
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

const AudioPlayer = () => {
    const { audio } = useAudio();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
            setIsPlaying(true);
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }

    const forward = () => {
        if (audioRef.current && audioRef.current.currentTime + 5 < audioRef.current.duration) {
            audioRef.current.currentTime += 5;
        }
    }

    const rewind = () => {
        if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
            audioRef.current.currentTime -= 5;
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
        }

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
        }

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        }

    }, [])

    useEffect(() => {
        if (audio?.audioUrl) {
            if (audioRef.current) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch((err) => {
                    console.log("Auto-play blocked or error", err);
                    setIsPlaying(false);
                })
            }
        } else {
            setIsPlaying(false);
        }
    }, [audio])

    if (!audio) return null;

    return (
        <div className={cn("sticky bottom-0 left-0 flex size-full bg-black-1 px-4 py-3 md:px-20", {
            "hidden": !audio?.audioUrl
        })}>
            <audio
                ref={audioRef}
                src={audio.audioUrl}
                className="hidden"
            />
            <div className="flex w-full items-center justify-between gap-8">
                <div className="flex items-center gap-4 max-md:hidden">
                    <Image
                        src={audio.imageUrl}
                        width={64}
                        height={64}
                        alt="player1"
                        className="aspect-square rounded-xl object-cover"
                    />
                    <div className="flex flex-col">
                        <h2 className="text-14 font-semibold text-white-1">{audio.title}</h2>
                        <p className="text-12 font-normal text-white-2">{audio.author}</p>
                    </div>
                </div>

                <div className="flex-center w-full flex-col gap-2 md:max-w-[50%]">
                    <div className="flex-center w-full gap-4">
                        <Rewind className="text-white-1 cursor-pointer" size={24} onClick={rewind} />
                        <div
                            className="flex-center cursor-pointer bg-white-1 p-2 rounded-full"
                            onClick={togglePlayPause}
                        >
                            {isPlaying ? <Pause size={24} className="text-black-1 fill-black-1" /> : <Play size={24} className="text-black-1 fill-black-1 ml-1" />}
                        </div>
                        <Forward className="text-white-1 cursor-pointer" size={24} onClick={forward} />
                    </div>
                    <div className="flex w-full items-center gap-2">
                        <p className="text-12 text-white-2 font-normal">{formatTime(currentTime)}</p>
                        <Progress value={(currentTime / duration) * 100} className="w-full text-orange-1 h-2 bg-black-2" />
                        <p className="text-12 text-white-2 font-normal">{formatTime(duration)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 max-md:hidden">
                    <h2 className="text-base text-white-1 font-semibold">1x</h2>
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={toggleMute}
                    >
                        <Volume2 className={cn("text-white-1", { "text-gray-1": isMuted })} size={24} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
        const minutes = Math.floor(time / 60);
        const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(time % 60);
        const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
};

export default AudioPlayer;
