import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";

const embeddings: GoogleGenerativeAIEmbeddings =
  new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: `${process.env.GEMINI_API_KEY}`,
  });

const ragStore: QdrantVectorStore = new QdrantVectorStore(embeddings, {
  apiKey: `${process.env.GEMINI_API_KEY}`,
  url: "http://localhost:6333",
  collectionName: "chat-1",
});
const SCORE_THRESHOLD: number = 0.75;

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

  // Vector Store
  const store = ragStore;
  await store.addDocuments(chunks, {});
  //   ragStore = QdrantVectorStore.fromDocuments(chunks, embeddings, {
  //     apiKey: `${process.env.GEMINI_API_KEY}`,
  //     url: "http://localhost:6333",
  //     collectionName: "chat-1",
  //   });

  return ragStore;
};

export const similaritySearch = async (query: string, k: number = 3) => {
  const store = ragStore;
  const queryVector = await embeddings.embedQuery(query);
  const relevantChunks = await store.similaritySearchVectorWithScore(
    queryVector,
    k
  );
  if (relevantChunks[0]?.[1] > SCORE_THRESHOLD) {
    return relevantChunks.slice(0, 3);
  }

  return [];
};
