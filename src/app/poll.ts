export interface Poll {
  version: string;
  id: number;
  requester_id: number;
  title: string;
  description: string;
  deadline: string;
  participants: PollParticipant[];
  options: PollOption[];
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
