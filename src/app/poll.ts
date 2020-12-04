export interface Poll {
  version: string;
  id: number;
  requester_id: number;
  title: string;
  description: string;
  deadline: string;
  participants: Participant[];
}

export interface Participant {
  id: number;
  name: string;
}
