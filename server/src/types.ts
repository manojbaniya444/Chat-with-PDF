export type EmbeddingObjectType = {
  object: string;
  embedding: number[];
  index: number;
};

export type LocalEmbeddingResponseType = {
  object: string;
  data: EmbeddingObjectType[];
  model: string;
  usuage: any;
};
