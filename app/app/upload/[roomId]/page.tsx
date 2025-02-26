"use client";
import {
  Dropzone,
  DropZoneArea,
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
import { useAction } from "convex/react";
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
  const generateQuiz = useAction(api.actions.generateQuizfromFile);
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
      const response = await generateQuiz({ userId: user!.id, file: filesArray[0] });
      console.log("Quiz generated:", response.mcqResult);
      setQuizData(response.mcqResult)
      if(response.mcqResult)
      setShowPreview(true);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
      </div>
    );
  }
  const hasFiles = dropzone.fileStatuses.length > 0;

if(filesArray)
    console.log(filesArray);

  return (
    <div className="flex mb-[85px] flex-col items-center min-h-screen bg-zinc-900 py-8 pt-10">
      <div className="container bg-zinc-900 mx-auto max-w-6xl px-4 flex flex-col gap-8">
      <h1 className="md:text-5xl text-2xl font-extrabold border border-zinc-900 text-white p-4 text-center rounded-lg shadow-lg">
        Upload One or More Files to Create a Quiz
      </h1>
        <Dropzone {...dropzone} className="bg-zinc-900 text-white">
          <div>
            {quizData?.length === 0 &&
            <>
            <div className="flex justify-between">

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
                {file.status === "pending" && (
            <div className="h-16 w-full animate-pulse bg-zinc-700 rounded-t-lg" />
          )}
                {/* {file.status === "success" && !file.result && (
                  <div className="h-16 w-full flex items-center justify-center bg-zinc-700 text-gray-300">
                    {file.fileName.split(".").pop()?.toUpperCase()}
                  </div>
                )} */}
                <div className="flex items-center justify-between p-2 pl-4 border-t border-zinc-700">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white"> {index+1}. {file.fileName}</p>
                    <p className="text-xs text-gray-400">{(file.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p className="text-xs text-gray-400">{file.file.type}</p>
                  </div>
                  <DropzoneRemoveFile
                    variant="ghost"
                    className="shrink-0 hover:bg-red-500/20 text-red-400 p-2 rounded-full"
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
        {hasFiles && quizData?.length === 0 && (
        <Button
          className="bg-[#4CAF50] hover:bg-[#45a049] border-t border-green-900 text-white text-xl py-6 w-full max-w-xl mx-auto mt-8"
          disabled={
            dropzone.fileStatuses.some((file) => file.status === "pending") ||
            (userDetails.quizgenStatus !== "Idle" &&
              userDetails.quizgenStatus !== undefined)
          }
          onClick={handleCreateQuiz}
        >
          {dropzone.fileStatuses.some((file) => file.status === "pending")
            ? "Uploading..."
            : userDetails.quizgenStatus === "Idle"
            ? "Create Quiz"
            : userDetails.quizgenStatus}
        </Button>
      )}
        {showPreview && <div className="rounded-lg bg-zinc-900 h-fit"><QuizPreview quiz={quizData} filesArray={filesArray} /></div>}
      </div>
    </div>
  );
}
