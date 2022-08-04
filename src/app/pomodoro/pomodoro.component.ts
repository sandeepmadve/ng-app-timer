import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit, OnDestroy {


  private subscription: Subscription;

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  secondsInAMinute = 60;
  public focusTime = 25;
  public relaxTime = 5;
  public dateNow = new Date();
  public dDay = this.dateNow;
  public timeDifference: any;
  public secondsToDday: any;
  public minutesToDday: any;
  public hoursToDday: any;
  public daysToDday: any;
  public timeLabel: any = 'R';
  private myAudio = new Audio('../../assets/music-focus.mp3');

  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    console.log("time diff: " + this.timeDifference);

    if (this.timeDifference <= 0) {
      if (this.timeLabel == 'F') {
        this.myAudio.volume = 0.001;
        this.timeLabel = 'R';
        this.dDay = new Date(new Date().getTime() + this.relaxTime * 60000);
        this.timeDifference = this.dDay.getTime() - new Date().getTime();
      } else {
        this.myAudio.volume = 1;
        this.timeLabel = 'F';
        this.dDay = new Date(new Date().getTime() + this.focusTime * 60000);
        this.timeDifference = this.dDay.getTime() - new Date().getTime();
      }
    } 

    this.allocateTimeUnits(this.timeDifference);

  }

  private allocateTimeUnits(timeDifference: any) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.secondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.secondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.secondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.secondsInAMinute * this.hoursInADay));
  }

  public startWithPomodoroTechnique() {
    this.timeLabel = 'F';
    setTimeout(() => {
      this.dDay = new Date(new Date().getTime() + this.focusTime * 60000);
      this.subscription = interval(1000).subscribe(x => this.getTimeDifference())
      this.playAudio();
    }, 1000);
  }

  public stopWithPomodoroTechnique() {
    this.timeLabel = 'R';
    this.myAudio.pause();
    this.secondsToDday=0;
    this.minutesToDday=0;
    this.hoursToDday=0;
    this.daysToDday=0;
    this.ngOnDestroy();
  }

  public playAudio() {
    if (typeof this.myAudio.loop == 'boolean') {
      this.myAudio.loop = true;
    } else {
      this.myAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
      }, false);
    }
    this.myAudio.play();
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(){

  }

}
