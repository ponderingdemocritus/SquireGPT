require('dotenv').config();
import { PineconeClient } from '@pinecone-database/pinecone';

export const embed = async (docs: any) => {

    const { OpenAIEmbeddings } = await import("langchain/embeddings");
    const { PineconeStore } = await import("langchain/vectorstores");
    const pinecone = new PineconeClient();

    await pinecone.init({
        environment: process.env.PINECONE_ENVIROMENT || "us-central1-gcp",
        apiKey: process.env.PINECONE_KEY || "",
    });

    try {
        // 
        console.log('creating vector store...', docs);
        await PineconeStore.fromDocuments(
            docs,
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
            {
                pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX_NAME || ''),
                namespace: process.env.PINECONE_NAME_SPACE,
            }
        );

    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};

export const processDocuments = async (dirPath: string) => {
    const { RecursiveCharacterTextSplitter } = await import("langchain/text_splitter");
    const { PDFLoader, CSVLoader, JSONLoader, TextLoader, DirectoryLoader, JSONLinesLoader } = await import("langchain/document_loaders");

    try {
        const loader = new DirectoryLoader(
            dirPath,
            {
                ".json": (path) => new JSONLoader(path, "/texts"),
                ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
                ".txt": (path) => new TextLoader(path),
                ".csv": (path) => new CSVLoader(path, "text"),
                ".pdf": (path) => new PDFLoader(path),
                ".md": (path) => new TextLoader(path)
            }
        );

        const rawDocs = await loader.load();

        /* Split text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);

        await embed(docs)

    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};



