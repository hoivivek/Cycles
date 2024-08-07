// import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { AdonsComponent } from '../adons/adons.component';
// import { FormsModule } from '@angular/forms';


// @Component({
//   selector: 'app-pregnancy-tracker',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './pregnancy-tracker.component.html',
//   styleUrl: './pregnancy-tracker.component.css'
// })
// export class PregnancyTrackerComponent implements OnInit{
//   count : number; 
//   currentMonth: number;
//   currentYear: number;
//   monthNames: string[];
//   days: number[];
//   dueDate: Date=new Date();
//   conceptionDate: Date = new Date();
//   babySizes: string[];

//   constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {
//     this.count=0; 
//     this.currentMonth = new Date().getMonth();
//     this.currentYear = new Date().getFullYear();
//     this.monthNames = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     this.days = [];
//     this.babySizes=[
//       'NA', 'NA', 'NA', 'poppy-seed', 'sesame-seed', 'lentil', 'blueberry', 'Kidney-bean', 'grape', 'kumquat', 'fig', 'lime', 'peapod', 'lemon', 'apple', 'avocado', 'turnip', 'bell-pepper', 'tomato', 'banana', 'carrot','squash', 'mango', 'ear of corn', 'rutabega', 'scallion', 'cauliflower', 'eggplant', 'butternut squash', 'cabbage', 'jicama', 'pineapple', 'cantaloupe', 'honeydew melon', 'romaine lettuce', 'swiss chard', 'leek', 'watermelon', 'pumpkin'
//     ];


//   }

//   ngOnInit(): void {
//     this.renderCalendar(this.currentMonth, this.currentYear);
//   }

  
  

//   renderCalendar(month: number, year: number): void {
//     this.days = Array(42).fill(0); // Ensures we have 42 slots to display the days of the month
//     const firstDayOfMonth = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     for (let day = 1; day <= daysInMonth; day++) {
//       this.days[firstDayOfMonth + day - 1] = day;
//     }

//     this.count = 0;
//   }

//   prevMonth(): void {
//     this.currentMonth--;
//     if (this.currentMonth < 0) {
//       this.currentMonth = 11;
//       this.currentYear--;
//     }
//     this.renderCalendar(this.currentMonth, this.currentYear);
//   }

//   nextMonth(): void {
//     this.currentMonth++;
//     if (this.currentMonth > 11) {
//       this.currentMonth = 0;
//       this.currentYear++;
//     }
//     this.renderCalendar(this.currentMonth, this.currentYear);
//   }

//   openPopover(): void {
//     this.dialog.open(AdonsComponent);
//   }

//   calculateConceptionDate(): void {
//     if (this.dueDate) {
//       this.conceptionDate = new Date(this.dueDate);
//       this.conceptionDate.setDate(this.conceptionDate.getDate() - 266); // 40 weeks earlier
//       alert(`Conception Date: ${this.conceptionDate.toDateString()}`);
//     }
//   }



//   showBabySize(day: number): void {
//     const week = this.getWeekNumber(day);
//     if (week > 0 && week <= this.babySizes.length) {
//       alert(`Week ${week}: Baby is the size of a ${this.babySizes[week - 1]}`);
//     }
//   }


// getCircleColor(day: number): string {
//   const week = this.getWeekNumber(day);
//   const color = '#ff69b4';

//   if (week > 0 && week <= this.babySizes.length && this.count < 40) {
//     this.count++;
//     console.log('Week:', week);
//     console.log('Color:', color);
//     this.cdr.detectChanges(); // Trigger change detection
//     return color;
//   }

//   ///if(this.babySizes.length )

//   console.log('Week:', week);
//   console.log('Color:', 'transparent');
//   return color;
// }


 


//   getWeekNumber(day: number): number {





import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdonsComponent } from '../adons/adons.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pregnancy-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pregnancy-tracker.component.html',
  styleUrl: './pregnancy-tracker.component.css'
})
export class PregnancyTrackerComponent implements OnInit {
  count: number;
  currentMonth: number;
  currentYear: number;
  monthNames: string[];
  days: number[];
  dueDate: Date = new Date();
  conceptionDate: Date = new Date();
  babySizes: string[];

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.count = 0;
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.days = [];
    this.babySizes = [
      'NA', 'NA', 'NA', 'poppy-seed', 'sesame-seed', 'lentil', 'blueberry', 'Kidney-bean', 'grape', 'kumquat', 'fig', 'lime', 'peapod', 'lemon', 'apple', 'avocado', 'turnip', 'bell-pepper', 'tomato', 'banana', 'carrot', 'squash', 'mango', 'ear of corn', 'rutabega', 'scallion', 'cauliflower', 'eggplant', 'butternut squash', 'cabbage', 'jicama', 'pineapple', 'cantaloupe', 'honeydew melon', 'romaine lettuce', 'swiss chard', 'leek', 'watermelon', 'pumpkin'
    ];
  }

  ngOnInit(): void {
    this.renderCalendar(this.currentMonth, this.currentYear);
  }

  renderCalendar(month: number, year: number): void {
    this.days = Array(42).fill(0); // Ensures we have 42 slots to display the days of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      this.days[firstDayOfMonth + day - 1] = day;
    }

    this.count = 0;
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar(this.currentMonth, this.currentYear);
  }

  openPopover(): void {
    this.dialog.open(AdonsComponent);
  }

  calculateConceptionDate(): void {
    if (this.dueDate) {
      this.conceptionDate = new Date(this.dueDate);
      this.conceptionDate.setDate(this.conceptionDate.getDate() - 266); // 40 weeks earlier
      alert(`Conception Date: ${this.conceptionDate.toDateString()}`);
    }
  }

  showBabySize(day: number): void {
    const week = this.getWeekNumber(day);
    if (week > 0 && week <= this.babySizes.length) {
      alert(`Week ${week}: Baby is the size of a ${this.babySizes[week - 1]}`);
    }
  }

  getCircleColor(day: number): string {
    const week = this.getWeekNumber(day);
    const color = '#ff69b4';

    const currentDate = new Date(this.currentYear, this.currentMonth, day);

    if (currentDate > this.dueDate) {
      return 'transparent'; // Return transparent if the current date is beyond the due date
    }

    if (week > 0 && week < 41) {
      this.count++; // Ensure the week does not exceed 40
      console.log(this.count);
      return color;
    }

    return 'transparent'; // Return transparent if the week exceeds 40
  }

  getWeekNumber(day: number): number {
    if (!this.conceptionDate) {
      return 0; // Handle the case where conception date is not available
    }

    const currentDate = new Date(this.currentYear, this.currentMonth, day);

    // Calculate the difference in milliseconds between the current date and conception date
    const timeDiff = currentDate.getTime() - this.conceptionDate.getTime();

    // Convert milliseconds to weeks, rounding down to the nearest whole week
    const weeksElapsed = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));

    return Math.min(weeksElapsed + 1, 40); // +1 for current week, ensure it does not exceed 40
  }
}
