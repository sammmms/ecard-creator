export interface MusicTrack {
  id: string;
  name: string;
  src: string | null;
  category: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "cny-traditional",
    name: "CNY Traditional",
    src: "/music/cny-traditional.mp3",
    category: "cny",
  },
  {
    id: "cny-modern",
    name: "CNY Modern Beat",
    src: "/music/cny-modern.mp3",
    category: "cny",
  },
  {
    id: "valentine-romantic",
    name: "Romantic Piano",
    src: "/music/valentine-romantic.mp3",
    category: "valentine",
  },
  {
    id: "valentine-upbeat",
    name: "Love Beats",
    src: "/music/valentine-upbeat.mp3",
    category: "valentine",
  },
  {
    id: "general-ambient",
    name: "Ambient Glow",
    src: "/music/general-ambient.mp3",
    category: "general",
  },
  { id: "none", name: "No Music", src: null, category: "all" },
];

export function getTrackById(id: string | null | undefined): MusicTrack | undefined {
  if (!id || id === "none") return undefined;
  return MUSIC_TRACKS.find((t) => t.id === id);
}
