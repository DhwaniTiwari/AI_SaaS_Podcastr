"use client";

import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

const useGeneratePodcast = ({
    setAudio,
    voiceType,
    voicePrompt,
    setVoicePrompt,
    setAudioStorageId,
}: GeneratePodcastProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePodcastScript = useAction(api.gemini.generatePodcastScript);
    const generateAudio = useAction(api.gemini.generateAudioAction);

    // If we wanted to upload execution result to UploadThing? 
    // For now, let's assume we handle the buffer. 
    // Since we don't have a direct "upload buffer to UploadThing" on client easily without a File object, 
    // and we are receiving this from a server action...
    // Actually, Gemini action returns a buffer. We can create a blob and upload it?
    // OR we use Convex Storage. 
    // Let's use Convex Storage for the generated audio because it's returned from a Convex Action.
    // We need a mutation to generateUploadUrl and then upload.

    // const getUploadUrl = useMutation(api.files.generateUploadUrl);

    // Alternative: The Convex Action generates audio and stores it in Convex Storage directly?
    // Actions can't directly write to storage (only mutations can, or via fetch to storage URL?).
    // Actually, actions can run `ctx.storage.store`? No.
    // Standard Convex: Action generates, then calls a Mutation to store? Or returns to client, client uploads.
    // Returning to client is fine for small files.

    // Implementation:
    // 1. Generate Script (OpenAI)
    // 2. Generate Audio (Gemini) -> returns Buffer/Blob
    // 3. Client uploads Blob to Convex Storage (via generateUploadUrl) OR UploadThing.
    // UploadThing is easier for client uploads if set up.
    // Converting Buffer to File and uploading to UploadThing.

    const generatePodcast = async () => {
        setIsGenerating(true);
        setAudio("");

        if (!voicePrompt) {
            toast.error("Please provide a voice prompt to generate a podcast");
            return setIsGenerating(false);
        }

        try {
            const response = await generateAudio({ input: voicePrompt, voice: voiceType });

            const blob = new Blob([new Uint8Array(response)], { type: 'audio/mpeg' });
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: 'audio/mpeg' });

            // Upload Logic would go here. For now, we set the blob URL for preview.
            // In a real scenario, we would upload to UploadThing using a helper or the hook in parent.
            // Since we can't easily use the hook inside a non-component function or conditionally...
            // We'll set the audio URL to the blob URL.

            setAudio(URL.createObjectURL(blob));
            setIsGenerating(false);
            toast.success("Podcast generated successfully!");
        } catch (error) {
            console.log('Error generating podcast', error);
            toast.error("Error creating podcast");
            setIsGenerating(false);
        }
    }

    return { isGenerating, generatePodcast };
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
    const { isGenerating, generatePodcast } = useGeneratePodcast(props);

    return (
        <div>
            <div className="flex flex-col gap-2.5">
                <Label className="text-16 font-bold text-white-1">
                    AI Prompt to generate Podcast
                </Label>
                <Textarea
                    className="input-class font-light focus-visible:ring-offset-orange-1"
                    placeholder="Provide text to generate audio"
                    rows={5}
                    value={props.voicePrompt}
                    onChange={(e) => props.setVoicePrompt(e.target.value)}
                />
            </div>
            <div className="mt-5 w-full max-w-[200px]">
                <Button
                    type="button"
                    className="text-16 bg-orange-1 py-4 font-bold text-white-1"
                    onClick={generatePodcast}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            Generating
                            <Loader className="animate-spin ml-2" size={20} />
                        </>
                    ) : (
                        'Generate'
                    )}
                </Button>
            </div>
            {props.audio && (
                <audio
                    controls
                    src={props.audio}
                    className="mt-5"
                    autoPlay
                />
            )}
        </div>
    )
}

export default GeneratePodcast;
