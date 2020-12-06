import {Component, OnInit} from '@angular/core';
import {Option} from './option';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../environments/environment';
import {PollywogService} from './pollywog.service';
import {Poll, PollOptionVote, PollParticipant} from './poll';
import {interval} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string;
  description: string;
  deadline: Date;
  open: boolean;
  options: Option[];
  addOptionValue = '';

  token: string;
  username: string;
  userid: number;
  backendVersion: string;
  authorized = false;
  favicon: HTMLLinkElement = document.querySelector('#faviconIcon');

  constructor(public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private pollywogService: PollywogService) {
    this.favicon.href = environment.favicon;
  }

  async ngOnInit(): Promise<void> {
    await this.parseRoute();
    this.refreshPoll();
    interval(10 * 1000).subscribe(x => this.refreshPoll());
  }

  async parseRoute(): Promise<void> {
    await this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.token = fragment;
    });
  }

  private authorNameById(id: number, participants: PollParticipant[]): string {
    return participants.find(p => p.id === id).name;
  }

  clientVersion(): string {
    return environment.version;
  }

  maxLikes(): number {
    return Math.max.apply(Math, this.options.map(option => option.likes));
  }

  progress(option: Option): number {
    const highest = this.maxLikes();
    if (highest === 0) { return 0; }
    return Math.floor(100 * option.likes / highest);
  }

  optionClass(option: Option): string {
    if (this.open) {
      return option.liked ? 'optiontextliked' : 'optiontext';
    } else {
      return 'optiontextdone';
    }
  }

  optionIcon(option: Option): string {
    return option.liked && this.open ? 'favorite' : 'favorite_border';
  }

  clickOption(option: Option): void {
    if (this.open) {
      if (option.liked) {
        option.liked = false;
        option.likes -= 1;
      } else {
        option.liked = true;
        option.likes += 1;
      }
      this.updateVotes();
    }
  }

  clickDelete(option: Option): void {
    if (this.open) {
      if (this.likedByOthers(option)) {
        this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe(doDelete => {
          if (doDelete) {
            this.deleteOption(option);
          }
        });
      } else {
        this.deleteOption(option);
      }
    }
  }

  private deleteOption(option: Option): void {
    this.options = this.options.filter(o => o !== option);
    this.updateOptions();
  }

  private likedByOthers(option: Option): boolean {
    return (option.liked && option.likes > 1) || (!option.liked && option.likes > 0);
  }

  submitOption(): void {
    this.options.push({
      text: this.addOptionValue,
      author: this.username,
      likes: 0,
      owned: true
    } as Option);
    this.addOptionValue = '';
    this.updateOptions();
  }

  private refreshPoll(): void {
    this.pollywogService.getPoll(this.token).subscribe(poll => {
      console.log(poll);
      this.renderPoll(poll);
    });
  }

  private updateOptions(): void {
    this.pollywogService.updateOptions(this.token, this.options).subscribe(poll => {
      this.renderPoll(poll);
    });
  }

  private updateVotes(): void {
    this.pollywogService.updateVotes(this.token, this.grabVotes()).subscribe(poll => {
      this.renderPoll(poll);
    });
  }

  private grabVotes(): PollOptionVote[] {
    const pollOptionVotes = [];
    this.options.filter(option => option.liked).forEach(option => pollOptionVotes.push({
      participant_id: this.userid,
      option_id: option.id,
      weight: 1} as PollOptionVote ));
    return pollOptionVotes;
  }

  private renderPoll(poll: Poll): void {
    this.backendVersion = poll.version;
    this.title = poll.title;
    this.description = poll.description;
    this.deadline = new Date(poll.deadline);
    this.open = poll.open;
    this.username = this.authorNameById(poll.requester_id, poll.participants);
    this.userid = poll.requester_id;
    this.authorized = true;
    this.options = [];
    poll.options.forEach(option => {
      this.options.push({
        id: option.id,
        text: option.text,
        author: this.authorNameById(option.participant_id, poll.participants),
        owned: poll.requester_id === option.participant_id,
        likes: this.countVotesForOption(option.id, poll.votes),
        liked: this.hasVotedForOption(poll.requester_id, option.id, poll.votes),
      } as Option);
    });
  }

  private hasVotedForOption(participantId: number, optionId: number, votes: PollOptionVote[]): boolean {
    return votes.filter(vote => vote.participant_id === participantId && vote.option_id === optionId).length > 0;
  }

  private countVotesForOption(optionId: number, votes: PollOptionVote[]): number {
    return votes.filter(vote => optionId === vote.option_id).length;
  }

}
