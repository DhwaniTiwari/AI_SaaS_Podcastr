"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types";
import { Loader, Upload } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner"; // Correct usage

const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt }: GenerateThumbnailProps) => {
    const [isAiThumbnail, setIsAiThumbnail] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const imageRef = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            setImage(res[0].url);
            setIsImageLoading(false);
            toast.success("Image uploaded successfully");
        },
        onUploadError: (error) => {
            setIsImageLoading(false);
            toast.error("Error uploading image");
            console.error(error);
        }
    });

    const handleImage = async (blob: Blob, fileName: string) => {
        setIsImageLoading(true);
        setImage("");
        try {
            const file = new File([blob], fileName, { type: 'image/png' });
            await startUpload([file]);
        } catch (error) {
            console.log(error);
            toast.error("Error uploading image");
            setIsImageLoading(false);
        }
    }

    const generateImage = async () => {
        // Logic for AI Image generation if implemented (e.g. DALL-E 3 via OpenAI)
        // Placeholder for now as plan prioritized script/audio.
        // If user wants AI image generation, we need an action.
        // But requirement says "Image & audio uploads".
        // We'll focus on Upload for now.
    }

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const files = e.target.files;
            if (!files) return;
            const file = files[0];
            const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

            handleImage(blob, file.name);
        } catch (error) {
            console.log(error);
            toast.error("Error uploading image");
        }
    }

    return (
        <>
            <div className="generate_thumbnail">
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiThumbnail(true)}
                    className={cn('', { 'bg-black-6': isAiThumbnail })}
                >
                    Use AI to generate thumbnail
                </Button>
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiThumbnail(false)}
                    className={cn('', { 'bg-black-6': !isAiThumbnail })}
                >
                    Upload custom image
                </Button>
            </div>

            {isAiThumbnail ? (
                <div className="flex flex-col gap-5 mt-5">
                    <div className="flex flex-col gap-2.5">
                        <Label className="text-16 font-bold text-white-1">
                            AI Prompt to generate Thumbnail
                        </Label>
                        <Textarea
                            className="input-class font-light focus-visible:ring-offset-orange-1"
                            placeholder="Provide text to generate thumbnail"
                            rows={5}
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                        />
                    </div>
                    <div className="w-full max-w-[200px]">
                        <Button
                            type="button"
                            className="text-16 bg-orange-1 py-4 font-bold text-white-1"
                            onClick={generateImage}
                            disabled={isImageLoading}
                        >
                            {isImageLoading ? (
                                <>
                                    Generating
                                    <Loader className="animate-spin ml-2" size={20} />
                                </>
                            ) : (
                                'Generate'
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="image_div" onClick={() => imageRef?.current?.click()}>
                    <Input
                        type="file"
                        className="hidden"
                        ref={imageRef}
                        onChange={(e) => uploadImage(e)}
                    />
                    {!isImageLoading ? (
                        <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
                    ) : (
                        <div className="text-16 flex-center font-medium text-white-1">
                            Uploading
                            <Loader size={20} className="animate-spin ml-2" />
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                        <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
                        <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
                    </div>
                </div>
            )}
            {image && (
                <div className="flex-center w-full">
                    <Image
                        src={image}
                        width={200}
                        height={200}
                        className="mt-5"
                        alt="thumbnail"
                    />
                </div>
            )}
        </>
    )
}

export default GenerateThumbnail;
