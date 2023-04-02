require('dotenv').config();
import { pinecone } from '../../server';

export const embed = async (docs: any) => {

    const { OpenAIEmbeddings } = await import("langchain/embeddings");
    const { PineconeStore } = await import("langchain/vectorstores");

    try {
        // 
        console.log('creating vector store...', docs);

        console.log('process.env.PINECONE_INDEX', process.env.PINECONE_INDEX );
        await PineconeStore.fromDocuments(
            docs,
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
            {
                pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX || ''),
                namespace: process.env.PINECONE_NAMESPACE,
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
                ".md": (path) => new TextLoader(path),
                ".adoc": (path) => new TextLoader(path)
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



