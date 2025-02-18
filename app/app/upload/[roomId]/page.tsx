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
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import QuizPreview from "@/components/Room Components/QuizPreview";

interface UploadedFile {
  url: string;
  size: number;
  fileName: string;
  extension: string;
  mimeType: string;
}

export default function QuizUpload() {
  const { edgestore } = useEdgeStore();
  const [filesArray, setFilesArray] = useState<UploadedFile[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [quizData, setQuizData] = useState<any>([]);
//   const [showDropZone, setShowDropZone] = useState(true);
  const { user } = useUser();
  const userDetails = useQuery(api.user.getUser, user?.id ? { clerkId: user.id } : "skip");

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      const res = await edgestore.publicFiles.upload({ file });
      const extension = file.name.split(".").pop() || "";
      setFilesArray((prev) => [...prev, {
        url: res.url,
        size: res.size,
        fileName: file.name,
        extension,
        mimeType: file.type,
      }]);
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

  async function handleCreateQuiz() {
    try {
      const response = await fetch("/api/generateQuiz/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filesArray),
      });
      const data = await response.json();
      setQuizData(data.result.quiz);
      setShowPreview(true);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }

  if (!userDetails) return <div>Loading user details...</div>;
  const hasFiles = dropzone.fileStatuses.length > 0;

if(filesArray)
    console.log(filesArray);

  return (
    <div className="flex mb-[85px] flex-col items-center min-h-screen bg-zinc-900 py-8 pt-10">
      <div className="container bg-zinc-900 mx-auto max-w-6xl px-4 flex flex-col gap-8">
        <h1 className="md:text-4xl text-2xl font-bold text-white">Upload one or more files for creating a quiz</h1>
        <Dropzone {...dropzone} className="bg-zinc-900 text-white">
          <div>
            {quizData.length === 0 &&
            <>
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
                  <p className="text-sm text-gray-300">Click here or drag and drop to upload</p>
                </div>
              </DropzoneTrigger>
            </DropZoneArea>
            </>
            }
          </div>
          {/* UPLOADED Medias */}
          <DropzoneFileList className="grid gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
            {dropzone.fileStatuses.map((file, index) => (
              <DropzoneFileListItem className="overflow-hidden mt-3 rounded-lg bg-zinc-800 p-0 shadow-md" key={file.id} file={file}>
                {file.status === "pending" && <div className="h-16 w-full animate-pulse bg-zinc-700" />}
                {file.status === "success" && file.result && (
                  <img src={file.result} alt={`uploaded-${file.fileName}`} className="w-full h-16 object-cover" />
                )}
                {/* {file.status === "success" && !file.result && (
                  <div className="h-16 w-full flex items-center justify-center bg-zinc-700 text-gray-300">
                    {file.fileName.split(".").pop()?.toUpperCase()}
                  </div>
                )} */}
                <div className="flex items-center justify-between p-2 pl-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white"> {index+1}. {file.fileName}</p>
                    <p className="text-xs text-gray-400">{(file.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p className="text-xs text-gray-400">{file.file.type}</p>
                  </div>
                  <DropzoneRemoveFile
                    variant="ghost"
                    className="shrink-0 hover:bg-red-500/20 text-red-400"
                    onClick={() => {
                      dropzone.onRemoveFile(file.id);
                      setQuizData([]);
                      setShowPreview(false);
                    }}
                  >
                    <Trash2Icon className="size-4" />
                  </DropzoneRemoveFile>
                </div>
              </DropzoneFileListItem>
            ))}
          </DropzoneFileList>
        </Dropzone>
        {hasFiles && quizData.length === 0 && (
          <Button
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white text-xl py-6 w-full max-w-xl mx-auto mt-8"
            disabled={dropzone.fileStatuses.some((file) => file.status === "pending") || (userDetails.quizgenStatus !== "Idle" && userDetails?.quizgenStatus !== undefined)}
            onClick={handleCreateQuiz}
          >
            {dropzone.fileStatuses.some((file) => file.status === "pending") ? "Uploading..." : "Create Quiz"}
          </Button>
        )}
        {showPreview && <div className="rounded-lg bg-zinc-900 h-fit"><QuizPreview quiz={quizData} filesArray={filesArray} /></div>}
      </div>
    </div>
  );
}
// TODO: add realtime status in button as previous opne
// TODO: give all buttons better and relevant label 
//  TODO: Maybe remove room from db  once host leaves, and all participants must be notified and kiscked out 
// TODO: REPLACE ALL IMG TAG WITH NEXT IMAGE
// TODO:  gamify teh quiz, handle points, leaderboard, etc