export type RadioItemType = "host" | "song" | "news";

export type RadioItem = {
  type: RadioItemType;
  title: string;
  artist?: string;
  genre?: string;
  audioUrl: string;
  script?: string;
  songId?: number;
};

export type StreamResponse = {
  station: string;
  fetchedAt: string;
  reason?: string;
  items: RadioItem[];
};
