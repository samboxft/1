import { DailyInspiration } from "@/types";

export const DAILY_INSPIRATIONS: DailyInspiration[] = [
  {
    quote: "Every artist was first an amateur.",
    author: "Ralph Waldo Emerson",
    artworkTitle: "The Starry Night",
    artworkArtist: "Vincent van Gogh",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    tip: "Van Gogh drew hundreds of sketches before becoming a master painter. Your daily sketch is your foundation.",
  },
  {
    quote: "Drawing is the honesty of the art. There is no possibility of cheating. It is either good or bad.",
    author: "Salvador Dalí",
    artworkTitle: "Girl at a Window",
    artworkArtist: "Salvador Dalí",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/Salvador_Dal%C3%AD_-_Girl_at_a_Window_%281925%29.jpg",
    tip: "Spend the first 2 minutes of your drawing session just looking at your subject. Really look.",
  },
  {
    quote: "I never made one of my discoveries through the process of rational thinking.",
    author: "Albert Einstein",
    artworkTitle: "Vitruvian Man",
    artworkArtist: "Leonardo da Vinci",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg/800px-Da_Vinci_Vitruve_Luc_Viatour.jpg",
    tip: "da Vinci filled over 13,000 pages of notebooks. Each page a single idea. Each idea a stepping stone.",
  },
  {
    quote: "Creativity takes courage.",
    author: "Henri Matisse",
    artworkTitle: "Drawing a Nude",
    artworkArtist: "Henri Matisse",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/en/6/6e/Matisse_-_Nu_bleu_IV_%281952%29.jpg",
    tip: "Loose, confident lines beat timid, hesitant ones every time. Draw with your whole arm, not just your wrist.",
  },
  {
    quote: "You can't use up creativity. The more you use, the more you have.",
    author: "Maya Angelou",
    artworkTitle: "A Sunday on La Grande Jatte",
    artworkArtist: "Georges Seurat",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
    tip: "Seurat made hundreds of tiny drawings before his masterpiece. Today's sketch feeds tomorrow's vision.",
  },
  {
    quote: "The world always seems brighter when you've just made something that wasn't there before.",
    author: "Neil Gaiman",
    artworkTitle: "Girl with a Pearl Earring",
    artworkArtist: "Johannes Vermeer",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg",
    tip: "Practice drawing eyes today — they're the first thing we connect with in any portrait.",
  },
  {
    quote: "An artist is not a special kind of person, but every person is a special kind of artist.",
    author: "Ananda Coomaraswamy",
    artworkTitle: "The Great Wave off Kanagawa",
    artworkArtist: "Katsushika Hokusai",
    artworkUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg",
    tip: "Hokusai changed his artist name 30 times over his career. Reinvention is part of the creative process.",
  },
];

export function getTodayInspiration(): DailyInspiration {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_INSPIRATIONS[dayOfYear % DAILY_INSPIRATIONS.length];
}
