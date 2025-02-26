import { ChatWrapper } from "@/components/chat/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { currentUser } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api"


interface PageProps {
    params: {
        url: string | string[] | undefined;
    };
}

function reconstructUrl({ url }: { url: string | string[] }) {
    // Ensure that 'url' is treated as an array
    const urlArray = typeof url === "string" ? [url] : url || [];
    const decodedComponents = urlArray.map((component) =>
        decodeURIComponent(component)
    );
    return decodedComponents.join("/");
}

const Page = async ({ params }: PageProps) => {
    const user = await currentUser();
    const url = params.url;
    console.log(params);
    console.log(url);

    if (!user) {
        return <div>Not signed in</div>;
    }

    const reconstructedUrl = reconstructUrl({ url: url as string | string[] });
    const sessionId = (reconstructedUrl + "--" + user.id).replace(/\//g, "");
    const indexedUrls = await redis.smembers("indexed-urls");
    console.log("indexedurls", indexedUrls);

    const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl);
    const initialMessages = await ragChat.history.getMessages({
        amount: 10,
        sessionId,
    });

    if (!isAlreadyIndexed) {
        await ragChat.context.add({
            type: "html",
            source: reconstructedUrl,
            config: { chunkOverlap: 50, chunkSize: 200 },
        });

        await redis.sadd("indexed-urls", reconstructedUrl);
        await fetchMutation(api.user.addChatUrl, {
            clerkId: user.id,
            url: reconstructedUrl,
        });
    }

    return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />;
};

export default Page;
