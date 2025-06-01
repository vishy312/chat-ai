import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";

export const indexingPipeline = async (file: File) => {
  //Loads Pdf
  const loader = new PDFLoader(file);
  const docs = await loader.load();

  // Create Chunks
  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  // Vector Embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: `${process.env.GEMINI_API_KEY}`,
  });

  // Vector Store
  const store = QdrantVectorStore.fromDocuments(chunks, embeddings, {
    apiKey: `${process.env.GEMINI_API_KEY}`,
    url: "http://localhost:6333",
    collectionName: "chat-1",
  });

  return store;
};
