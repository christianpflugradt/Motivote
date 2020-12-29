export interface Poll {
  version: string;
  id: number;
  requester_id: number;
  title: string;
  description: string;
  deadline: string;
  open: boolean;
  participants: PollParticipant[];
  options: PollOption[];
  votes: PollOptionVote[];
  params: PollParams;
}

export interface PollParticipant {
  id: number;
  name: string;
}

export interface PollOption {
  id: number;
  participant_id: number;
  text: string;
}

export interface PollOptionVote {
  option_id: number;
  participant_id: number;
  weight: number;
}

export interface PollParams {
  optionsPerParticipant: number;
  votesPerParticipant: number;
}
