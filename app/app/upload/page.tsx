"use client";
import {
    Dropzone,
    DropZoneArea,
    DropzoneDescription,
    DropzoneFileList,
    DropzoneFileListItem,
    DropzoneMessage,
    DropzoneRemoveFile,
    DropzoneTrigger,
    useDropzone,
} from "@/components/ui/dropzone";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";

interface UploadedFile {
    url: string;
    size: number;
    fileName: string;
    extension: string;
}

export default function QuizUpload() {
    const { edgestore } = useEdgeStore();
    const [filesArray, setFilesArray] = useState<UploadedFile[]>([]);
    console.log(filesArray);

    const dropzone = useDropzone({
        onDropFile: async (file: File) => {
            const res = await edgestore.publicFiles.upload({ file });
            // Extract file extension from file name
            const extension = file.name.split(".").pop() || "";
            // Update filesArray with an object instead of just the URL
            setFilesArray(prev => [
                ...prev,
                {
                    url: res.url,
                    size: res.size,
                    fileName: file.name,
                    extension,
                },
            ]);
            return {
                status: "success",
                result: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
            };
        },
        validation: {
            accept: {
                "image/*": [".png", ".jpg", ".jpeg"],
                "text/*": [".txt", ".doc", ".docx", ".pdf"],
            },
            maxSize: 10 * 1024 * 1024,
            maxFiles: 10,
        },
    });

    const hasFiles = dropzone.fileStatuses.length > 0;

    return (
        <div className="flex flex-col items-center min-h-screen bg-zinc-900 py-8 pt-10">
            <div className="container bg-zinc-900 mx-auto max-w-6xl px-4 flex flex-col gap-8">
                {/* Big heading at the top */}
                <h1 className="md:text-4xl text-2xl  font-bold text-white">
                    Upload one or more files for creating a quiz
                </h1>

                <Dropzone {...dropzone} className="bg-zinc-900 text-white">
                    <div>
                        <div className="flex justify-between">
                            <DropzoneDescription className="text-gray-300">
                                Drag and drop files here or click to select
                            </DropzoneDescription>
                            <DropzoneMessage className="text-gray-300" />
                        </div>
                        <DropZoneArea>
                            <DropzoneTrigger className="flex flex-col items-center gap-4 bg-[#4CAF50] bg-opacity-20 hover:bg-opacity-30 transition-all rounded-lg p-10 text-center text-sm">
                                <CloudUploadIcon className="size-8 text-[#4CAF50]" />
                                <div>
                                    <p className="font-semibold text-white">Upload files</p>
                                    <p className="text-sm text-gray-300">
                                        Click here or drag and drop to upload
                                    </p>
                                </div>
                            </DropzoneTrigger>
                        </DropZoneArea>
                    </div>

                    <DropzoneFileList className="grid gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
                        {dropzone.fileStatuses.map((file) => (
                            <DropzoneFileListItem
                                className="overflow-hidden rounded-lg bg-zinc-800 p-0 shadow-md"
                                key={file.id}
                                file={file}
                            >
                                {file.status === "pending" && (
                                    <div className="h-16 w-full animate-pulse bg-zinc-700" />
                                )}
                                {file.status === "success" && file.result && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={file.result}
                                        alt={`uploaded-${file.fileName}`}
                                        className="w-full h-16 object-cover"
                                    />
                                )}
                                {file.status === "success" && !file.result && (
                                    <div className="h-16 w-full flex items-center justify-center bg-zinc-700 text-gray-300">
                                        {file.fileName.split(".").pop()?.toUpperCase()}
                                    </div>
                                )}
                                <div className="flex items-center justify-between p-2 pl-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm text-white">{file.fileName}</p>
                                        <p className="text-xs text-gray-400">
                                            {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <DropzoneRemoveFile
                                        variant="ghost"
                                        className="shrink-0 hover:bg-red-500/20 text-red-400"
                                    >
                                        <Trash2Icon className="size-4" />
                                    </DropzoneRemoveFile>
                                </div>
                            </DropzoneFileListItem>
                        ))}
                    </DropzoneFileList>
                </Dropzone>

                {hasFiles && (
                    <Button
                        className="bg-[#4CAF50] hover:bg-[#45a049] text-white text-xl py-6 w-full max-w-xl mx-auto mt-8"
                        onClick={() => console.log("Create Quiz clicked")}
                    >
                        Create Quiz
                    </Button>
                )}
            </div>
        </div>
    );
}