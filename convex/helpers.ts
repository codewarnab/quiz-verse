export function getHeaders(): Record<string, string> {
    console.log('Getting headers with API key');
    const headers = {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
    };
    console.log('Headers prepared:', { ...headers, Authorization: '[REDACTED]' });
    return headers;
}

export function buildPayload(urls: string[]) {
    console.log('Building payload for URLs:', urls);
    const basePayload = {
        formats: ["markdown"],
        onlyMainContent: true,
        excludeTags: ["img", "picture"],
        timeout: 6000000,
        actions: [],
        location: { country: "IN", languages: [] },
        removeBase64Images: true,
        blockAds: true,
    };

    if (urls.length === 1) {
        console.log('Creating single URL payload');
        return {
            endpoint: "https://api.firecrawl.dev/v1/scrape",
            payload: { ...basePayload, url: urls[0] },
        };
    } else {
        console.log('Creating batch URLs payload');
        return {
            endpoint: "https://api.firecrawl.dev/v1/batch/scrape",
            payload: { ...basePayload, urls },
        };
    }
}

export async function pollForBatchResult(
    batchId: string,
    headers: Record<string, string>
) {
    console.log('Starting batch polling for ID:', batchId);
    const pollInterval = 3000; // 5 seconds
    const maxTime = 10 * 60 * 1000; // 10 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxTime) {
        console.log(`Polling batch ID ${batchId}, elapsed time: ${Date.now() - startTime}ms`);
        const pollResponse = await fetch(
            `https://api.firecrawl.dev/v1/batch/scrape/${batchId}`,
            {
                method: "GET",
                headers,
            }
        );
        const scrapeResult = await pollResponse.json();
        console.log('Poll response status:', scrapeResult.status);

        if (
            scrapeResult.status === "scraping completed" ||
            scrapeResult.status === "completed"
        ) {
            console.log('Batch scraping completed successfully');
            return scrapeResult;
        } else if (scrapeResult.status === "failed") {
            console.log('Batch scraping failed:', scrapeResult);
            return {
                success: false,
                error: "Batch scraping failed",
                details: scrapeResult,
            };
        }
        console.log(`Waiting ${pollInterval}ms before next poll`);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
    console.log('Batch scraping timed out after', maxTime, 'ms');
    return { success: false, error: "Batch scraping timed out" };
}
