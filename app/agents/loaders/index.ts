import { processDocuments } from "./utils";

(async () => {
    const dirPath = process.argv[2];
    await processDocuments(dirPath);
    console.log('ingestion complete');
})();
