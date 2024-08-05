import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdonsComponent } from '../adons/adons.component';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})

export class TrackerComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  monthNames: string[];
  days: number[];

  constructor(public dialog: MatDialog) {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.days = [];
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

  isMenstrual(day: number): boolean {
    return day <= 5; // Example logic for menstrual phase
  }

  isFollicular(day: number): boolean {
    return day > 5 && day <= 12; // Example logic for follicular phase
  }

  isOvulation(day: number): boolean {
    return day > 12 && day <= 19; // Example logic for ovulation phase
  }

  isLuteal(day: number): boolean {
    return day > 19; // Example logic for luteal phase
  }

  openPopover(): void {
    this.dialog.open(AdonsComponent);
  }

}
