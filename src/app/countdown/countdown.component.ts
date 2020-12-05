import {Component, Input, OnInit} from '@angular/core';
import {interval} from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  @Input()
  deadline: Date;
  @Input()
  open: boolean;

  SEC_PER_MINUTE = 60;
  SEC_PER_HOUR = 60 * 60;
  SEC_PER_DAY = 24 * 60 * 60;

  diff: number;

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor() {
  }

  ngOnInit(): void {
    interval(1000).subscribe((x) => {
      if (!!this.deadline) {
        this.diff = Math.floor((this.deadline.getTime() - new Date().getTime()) / 1000);
        this.days = this.daysRemaining();
        this.hours = this.hoursRemaining();
        this.minutes = this.minutesRemaining();
        this.seconds = this.secondsRemaining();
      }
    });
  }

  daysRemaining(): number {
    return Math.floor(this.diff / this.SEC_PER_DAY);
  }

  hoursRemaining(): number {
    return Math.floor((this.diff
      - (this.daysRemaining() * this.SEC_PER_DAY))
      / this.SEC_PER_HOUR);
  }

  minutesRemaining(): number {
    return Math.floor((this.diff
      - (this.daysRemaining() * this.SEC_PER_DAY)
      - (this.hoursRemaining() * this.SEC_PER_HOUR))
      / this.SEC_PER_MINUTE);
  }

  secondsRemaining(): number {
    return Math.floor(this.diff
      - (this.daysRemaining() * this.SEC_PER_DAY)
      - (this.hoursRemaining() * this.SEC_PER_HOUR)
      - (this.minutesRemaining() * this.SEC_PER_MINUTE));
  }

}
