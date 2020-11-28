import {Component, OnInit} from '@angular/core';
import {Option} from './option';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string;
  description: string;
  deadline: Date;
  options: Option[];

  addOptionValue = '';

  username: string;

  constructor(public dialog: MatDialog,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.username = fragment;
    });
    this.deadline = new Date('2020-12-01T00:00:00');
    this.title = 'Mittach';
    this.description = 'Was wollen wir denn heute Leckeres essen? Hmm...';
    this.options = [
      { text: 'Gulasch', author: 'der Paul', likes: 1 } as Option,
      { text: 'Weißwurst', author: 'Schorsch', likes: 5 } as Option,
      { text: 'Борщ + 寿司', author: 'ich', likes: 0, owned: true } as Option,
      { text: 'Grünkohl', author: 'Schorsch', likes: 4 } as Option,
      { text: 'irgendwas Warmes ohne Fleisch', author: 'Klothilde', likes: 1 } as Option,
      { text: 'Petit pain rond fourré de biftek haché et de fromage et des frites', author: 'ich', likes: 1, owned: true } as Option,
      { text: 'Pflaumenkuchen mit Pálinka', author: 'Klothilde', likes: 1 } as Option,
      { text: 'Krosse Krabbe Pizza', author: 'Toni', likes: 3 } as Option,
      { text: 'Ragù alla bolognese', author: 'Toni', likes: 2 } as Option,
    ];
  }

  maxLikes(): number {
    return Math.max.apply(Math, this.options.map(option => option.likes));
  }

  progress(option: Option): number {
    const highest = this.maxLikes();
    if (highest === 0) { return 0; }
    return Math.floor(100 * option.likes / highest);
  }

  optionIcon(option: Option): string {
    return option.liked ? 'favorite' : 'favorite_border';
  }

  clickOption(option: Option): void {
    if (option.liked) {
      option.liked = false;
      option.likes -= 1;
    } else {
      option.liked = true;
      option.likes += 1;
    }
  }

  clickDelete(option: Option): void {
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

  private deleteOption(option: Option): void {
    this.options = this.options.filter(o => o !== option);
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
  }

}
