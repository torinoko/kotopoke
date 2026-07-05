export type Word = {
  id: string;
  text: string;
  reading?: string;
  source?: string;
  meaning?: string;
  relatedWords: string[];
  impression?: string;
  collectedAt: string;
};

export type WordInput = {
  text: string;
  reading?: string;
  source?: string;
  meaning?: string;
  impression?: string;
};
