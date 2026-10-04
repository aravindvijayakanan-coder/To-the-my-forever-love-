export interface PhotoItem {
  id: number; // 1 to 12
  url: string; // Base64 data URL or uploaded file URL or empty string
  caption: string;
  sillyCaption?: string;
}

export interface LovePoint {
  id: string;
  title: string;
  description: string;
}

export interface PersonalizationData {
  herName: string;
  myName: string;
  birthdayDate: string; // ONLY date displayed!
  
  // 12 Photos
  photos: PhotoItem[];
  
  // Silly memories
  sillyMemoriesTitle?: string;
  sillyMemoriesNote: string;
  
  // Things I Love About You
  lovePoints: LovePoint[];
  
  // Eyes special feature
  eyesQuote: string;
  eyesNote: string;

  // Cheeks special feature
  cheeksQuote?: string;
  cheeksNote?: string;
  
  // Interactive Love Letter
  letterSalutation: string;
  letterParagraphs: string[];
  letterSignoff: string;
  
  // Single Song Only
  songTitle: string;
  songArtist: string;
  spotifyUrl: string;
  spotifyTrackId: string;
  
  // Final Forever Section
  foreverLines: string[];
  
  // Final Birthday Message
  finalMessageTitle: string;
  finalMessageContent: string[];
  finalSignature: string;
}
