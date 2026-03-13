export type FeedbackStatus = "CORRECT" | "PARTIAL" | "INCORRECT";

export type AttributeFeedback = {
  faction: FeedbackStatus;
  race: FeedbackStatus;
  class: FeedbackStatus;
  expansion: FeedbackStatus;
  zone: FeedbackStatus;
  role: FeedbackStatus;
};

export type GuessCharacterInfo = {
  id: number;
  name: string;
  faction: string | null;
  race: string | null;
  class: string | null;
  expansion: string | null;
  zone: string | null;
  role: string | null;
  imageUrl: string | null;
};

export type GuessResult = {
  character: GuessCharacterInfo;
  feedback: AttributeFeedback;
  correct: boolean;
  attempt: number;
};

export type GameState = {
  challengeExists: boolean;
  solved: boolean;
  guesses: GuessResult[];
};

export type CharacterSearchResult = {
  id: number;
  name: string;
  imageUrl: string | null;
};
