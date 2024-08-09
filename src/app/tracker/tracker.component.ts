import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdonsComponent } from '../adons/adons.component';
import { RouterOutlet, Routes, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  monthNames: string[];
  days: number[];
  selectedDay: number | null;
  cycleStartDate: Date | null;
  tip: string;
  tipVisible: boolean;

  constructor(public dialog: MatDialog) {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.days = [];
    this.selectedDay = null; // Initialize the selected day
    this.cycleStartDate = null; // Initialize the cycle start date
    this.tip = ''; 
    this.tipVisible = false;
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

  onCycleStartChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = input.valueAsDate;
    if (date) {
      this.cycleStartDate = date;
    }
  }

  onDaySelect(day: number): void {
    this.selectedDay = day;
  }

  dayInCycle(day: number): number {
    if (!this.cycleStartDate || day === 0) return 0;

    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const cycleStart = new Date(this.cycleStartDate);
    const timeDiff = selectedDate.getTime() - cycleStart.getTime();
    const dayInCycle = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

    return dayInCycle > 0 ? dayInCycle : 0;
  }

  isStage(day: number, stage: string): boolean {
    const dayInCycle = this.dayInCycle(day);
    if (dayInCycle === 0) return false;
    switch (stage) {
      case 'Menstrual':
        return this.isMenstrual(dayInCycle);
      case 'Follicular':
        return this.isFollicular(dayInCycle);
      case 'Ovulation':
        return this.isOvulation(dayInCycle);
      case 'Luteal':
        return this.isLuteal(dayInCycle);
      default:
        return false;
    }
  }

  isMenstrual(dayInCycle: number): boolean {
    return dayInCycle <= 5; // Example logic for menstrual phase
  }

  isFollicular(dayInCycle: number): boolean {
    return dayInCycle > 5 && dayInCycle <= 14; // Example logic for follicular phase
  }

  isOvulation(dayInCycle: number): boolean {
    return dayInCycle > 14 && dayInCycle <= 19; // Example logic for ovulation phase
  }

  isLuteal(dayInCycle: number): boolean {
    return dayInCycle > 19 && dayInCycle <= 28; // Example logic for luteal phase
  }

  openPopover(): void {
    this.dialog.open(AdonsComponent);
  }

  getStage(dayInCycle: number): string {
    if (dayInCycle <= 5) {
      return 'Menstrual';
    } else if (dayInCycle > 5 && dayInCycle <= 14) {
      return 'Follicular';
    } else if (dayInCycle > 14 && dayInCycle <= 19) {
      return 'Ovulation';
    } else if (dayInCycle > 19 && dayInCycle <= 28) {
      return 'Luteal';
    } else {
      return '';
    }
  }

  

showTip(): void {
    if (this.selectedDay !== null) {
      const tip = this.getTip(this.dayInCycle(this.selectedDay));
      this.tip = tip;
      this.tipVisible = true;
    } else {
      this.tip = 'Please select a day to see the tip.';
      this.tipVisible = true;
    }
  }

  closeTip(): void {
    this.tipVisible = false;
  }
  

  getTip(dayInCycle: number): string {
    if (dayInCycle == 1) {
      return 'This is the first day of your period! Today, your uterus will begin shedding its lining. Your hormones will be low, and flow is medium to heavy. You may experience some physical symptoms, such as heavy abdominal cramps, backache, and sore breasts.';
    } 
    else if (dayInCycle == 2) {
      return 'Today you will have your heaviest flow. Any premenstrual mood swings and cramps you had should begin to ease up. Since your flow is heavier, you may see some clotting in your period.';
    }
    else if (dayInCycle == 3) {
      return 'Today your bleeding should get a little bit lighter in comparison to yesterday. PH levels change the most today, so you may experience odors that are not otherwise present. Your body is also very prone to yeast infections right now, so it is recommended to wear breathable clothing, maintain good hygiene, and stick to low sugar foods.';
    }
    else if (dayInCycle == 4) {
      return 'On the fourth day of your period, your flow should be between medium and light, and physical symptoms should be all gone. The color of your blood may become darker and potentially closer to brown color.';
    }
    else if (dayInCycle == 5) {
      return 'Your flow today should be fairly light as your menstruation cycle nears its end. Your emotional symptoms should also begin to wind down. By the end of the day, many women will experience only spotting, but periods are different for all people!';
    }
    else if (dayInCycle <= 10) {
      return 'During this time, your estradiol (most potent type of estrogen) levels will begin to rise. This will cause an energy rise and will make you feel more sociable, clear minded, and happy. Your inhibin B levels will also rise, which will help to regulate your follicle stimulating hormones.';
    } 
    else if (dayInCycle <= 14) {
      return 'Right now, a dominant follicle is developing in your ovaries, causing the egg that will be released when you ovulate to mature. This will cause your body estrogen levels to continue to increase, which leads to a happier mood and sharper cognitive functions. Your inhibin A levels will also increase, and this will help to manage hormonal imbalances. In addition to this, as your body prepares to release the egg, your libido may increase and your chances of getting pregnant are higher.';
    } 
    else if (dayInCycle == 15) {
      return 'Over the next two days, your body will release an egg into your fallopian tubes and it will begin its descent into your uterus. This is the most likely time period for you to pregnant during your menstrual cycle.';
    }
    else if (dayInCycle == 16) {
      return 'If your body did not already release the egg yesterday, this will occur today. Again, your chances of getting pregnant are significantly increased.  ';
    }
    else if (dayInCycle <= 19) {
      return 'At this time, your energy levels will increase, and you may observe a higher sex drive. You may also notice clear or white colored discharge.';
    }
    else if (dayInCycle <= 22) {
      return 'You have now entered your luteal phase! You may notice changes in your mood appetite. Acne breakouts are also common so do not be concerned if you see differences in your skin texture. In addition to this, your discharge may thicken.   ';
    }
    else if (dayInCycle <= 25) {
      return 'As your luteal phase continues, tender breasts and body aches are common experiences. Additionally, you may experience some high hormonal levels and body temperature changes. ';
    }
    else if (dayInCycle <= 28) {
      return 'As you are now in the last few days of your cycle, your uterus is preparing to shed its lining during menstruation. You may experience mood swings, cramps, and bloating. ';
    }
    else {
      return 'No tip available.';
    }
  }

}



