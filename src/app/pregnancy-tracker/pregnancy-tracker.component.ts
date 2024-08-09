import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdonsComponent } from '../adons/adons.component';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Routes, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pregnancy-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet],
  templateUrl: './pregnancy-tracker.component.html',
  styleUrls: ['./pregnancy-tracker.component.css']
})


export class PregnancyTrackerComponent implements OnInit {
  currentMonth: number;
  currentYear: number;
  monthNames: string[];
  days: number[];
  selectedDay: number | null;
  dueDate: Date | null;
  tip: string;
  status: string;
  tipVisible: boolean;
  conceptionDate: Date | null;
  conceptionDateString: string;
  conceptionDateVisible: boolean;


  constructor(public dialog: MatDialog) {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.days = [];
    this.selectedDay = null;
    this.dueDate = null;
    this.tip = '';
    this.status = '';
    this.tipVisible = false;
    this.conceptionDate = null;
    this.conceptionDateString = '';
    this.conceptionDateVisible = false;
  }

  ngOnInit(): void {
    this.renderCalendar(this.currentMonth, this.currentYear);
  }
  
  
  renderCalendar(month: number, year: number): void {
    this.days = Array(42).fill(0);
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

  
  onDueDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const date = input.valueAsDate;
    if (date) {
      this.dueDate = date;
    }
  }

  onDaySelect(day: number): void {
    this.selectedDay = day;
  }

  calculateWeekNumber(date: Date): number {
    if (!this.conceptionDate) return 0;
  
    const timeDiff = date.getTime() - this.conceptionDate.getTime();
    const weekNumber = Math.floor(timeDiff / (1000 * 3600 * 24 * 7)) + 1;
  
    return weekNumber > 0 ? weekNumber : 0;
  }

  getSelectedWeekNumber(): number | null {
    if (this.selectedDay !== null && this.conceptionDate) {
      const selectedDate = new Date(this.currentYear, this.currentMonth, this.selectedDay);
      return this.calculateWeekNumber(selectedDate);
    }
    return null;
  }
  

  isWithinPregnancyWeek(day: number): boolean {
    if (!this.conceptionDate || !this.dueDate || day === 0) return false;
  
    const dateToCheck = new Date(this.currentYear, this.currentMonth, day);
    const weekNumber = this.calculateWeekNumber(dateToCheck);
  
    return weekNumber > 0 && dateToCheck <= this.dueDate;
  }
  

  calculateConceptionDate(): Date | null {
    if (!this.dueDate) return null;

    const conceptionDate = new Date(this.dueDate);
    conceptionDate.setDate(conceptionDate.getDate() - 266);

    return conceptionDate;
  }

  

  

  calculateAndShowConceptionDate(): void {
    this.conceptionDate = this.calculateConceptionDate();
  
    if (this.conceptionDate) {
        this.conceptionDateString = this.conceptionDate.toDateString();
        this.conceptionDateVisible = true;
        this.renderCalendar(this.currentMonth, this.currentYear); // Re-render the calendar to apply highlights
    }
  }
  
  
  closeConceptionDatePopup(): void {
    this.conceptionDateVisible = false;
  }


  dayInPregnancy(day: number): number {
    const conceptionDate = this.calculateConceptionDate();
    if (!conceptionDate || day === 0) return 0;

    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const timeDiff = selectedDate.getTime() - conceptionDate.getTime();
    const dayInPregnancy = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

    return dayInPregnancy > 0 ? dayInPregnancy : 0;
  }

  isWithinPregnancyPeriod(day: number): boolean {
    if (!this.conceptionDate || !this.dueDate) return false;
  
    const dateToCheck = new Date(this.currentYear, this.currentMonth, day);
  
    return dateToCheck >= this.conceptionDate && dateToCheck <= this.dueDate;
  }
  
 
  openPopover(): void {
    this.dialog.open(AdonsComponent);
  }

  showTip(): void {
    if (this.selectedDay !== null) {
      const selectedWeek = this.getSelectedWeekNumber();
      if (selectedWeek !== null) {
        const tip = this.getPregnancyTip(selectedWeek);
        const stage = this.getPregnancyStage(selectedWeek);
        this.tip = tip;
        this.status = `${stage}`;
        this.tipVisible = true;
      }
    } else {
      this.tip = 'Please select a day to see the tip.';
      this.status = '';
      this.tipVisible = true;
    }
  }


  closeTip(): void {
    this.tipVisible = false;
  }

  getWeekImage(weekInPregnancy: number): string {
    
  
    switch (weekInPregnancy) {
      case 1:
        return '/src/assets/images/apple_week15.png';
      case 2:
        return '/src/assets/images/avocado_week16.png';
      default:
        return '/src/assets/images/avocado_week16.png'; 
    }
  }
  

  getPregnancyStage(weekInPregnancy: number): string {

    if (weekInPregnancy == 1) {
      return 'Your baby has not been conceived yet! In the weeks immediately after your last period, your uterus is currently preparing for ovulation and the arrival of a fertilized egg.';
    } 

    else if (weekInPregnancy == 2) {
      return 'Your baby has not been conceived yet! In the weeks immediately after your last period, your uterus is currently preparing for ovulation and the arrival of a fertilized egg.';
    } 

    else if (weekInPregnancy == 3) {
      return 'Congratulations! You have officially conceived your baby, though it will not quite show on a pregnancy test yet. This week your baby is a small cluster of cells called a blastocyst. In the next five or six days, the blastocyst will travels from your fallopian tubes to your uterus where it will implant itself in the uterine wall and grow for the next nine months. You may begin to notice small changes in your body including increases sense of smell and morning sickness.';
    }
    
    else if (weekInPregnancy == 4) {
      return 'This week your baby is as big as a poppy seed! During week four, your body will begin to form the placenta and amniotic sac. You may experience symptoms such as tender breasts and abdominal pressure. You may also see some light spotting and this is nothing to be worried about! Spotting at this time is called implantation bleeding, which means the fertilized egg has successfully attached to the lining of the uterus and can sometimes disrupt small blood vessels, causing spotting.';
    }

    else if (weekInPregnancy == 5) {
      return 'You are now officially in your second month of pregnancy! This week your baby is as big as a sesame seed. During this time the embryo is beginning to look more like a fetus and your baby’s heart and circulatory system are developing. You may begin to experience symptoms such as fatigue and nausea. This week is about time all your pregnancy hormones will begin to kick in, so if you are feeling severe mood swings, don`t be alarmed!';
    }

    else if (weekInPregnancy == 6) {
      return 'This week your baby`s facial features are starting to develop! Their head, cheeks, and jaw are all beginning to take shape and they are about the size of a lentil. Pregnancy cravings will now start kicking in, so if you’re eating chocolate than normal, there’s nothing to worry about. Another symptom to keep a look out for is frequent urination, which is because of the pregnancy hormone hCG causing an increase of blood flow to your pelvic area. You may also feel heartburn and indigestion, so maybe steer away from greasy or spicy food.';
    }

    else if (weekInPregnancy == 7) {
      return 'Your baby is now the size of a blueberry! Compared to when you conceived, your embryo is now 10,000 times the size of when it first began forming. Your baby is now growing very quickly and generating brain cells at a rate of 100 a minute. This week their arms, legs, mouth, and kidney are beginning to develop. Similarly, to before, you will continue to experience symptoms such as breast tenderness, morning sickness, and food aversions.';
    }

    else if (weekInPregnancy == 8) {
      return 'Although you may not be showing your bump yet, there is a possibility your clothes are beginning to get tight as your baby is now the size of a kidney bean and your uterus has stretched to about the size of a grapefruit. This week your baby`s features are coming in more prominently, with the tip of their nose forming and their eyelids.';
    }

    else if (weekInPregnancy == 9) {
      return 'This week your baby is now the size of a grape and you are now in your third month of pregnancy! Over the next week your baby will fully transition from an embryo into a fetus. This means their head has straightened out and their ears are beginning to grow, making them look more human. Your baby’s toes are now visible and all vital organs are being developed. This week the newest and most overwhelming symptom you will feel is fatigue. Your body`s metabolism and hormone levels are significantly spiked, which causes a decrease in blood sugar and blood pressure, causing immense tiredness.';
    }

    else if (weekInPregnancy == 10) {
      return 'Your baby is now the size of a kumquat and is officially a fetus. Key developments this week include the formation of tiny nails on fingers and toes and the growth of peach-fuzz hair. The critical organs, including the kidneys, intestines, brain, and liver, are functioning now, and the baby can make movements, though you won`t feel them yet. You may still experience fatigue and morning sickness, but it’s likely to begin easing soon. Your breasts might be fuller and more sensitive due to hormonal change';
    }

    else if (weekInPregnancy == 11) {
      return 'Your baby is now about the size of a fig. This week, your baby`s bones are starting to harden, and the hands and feet are now complete with individual fingers and toes. The ears are almost in their final position, and the baby can swallow amniotic fluid. You might notice your waistline thickening, and your morning sickness may begin to decrease. Skin changes such as darkening of the areolas and the appearance of the linea nigra, a dark line down your abdomen, are common.';
    }

    else if (weekInPregnancy == 12) {
      return 'Reflexes are developing, so your baby can now make sucking movements and even respond to stimuli by moving away from pokes on your belly. This week your baby is now the size of a plum. The intestines are moving into their final position, and the liver is producing bile. Many mothers start to feel a bit better this week as the risk of miscarriage decreases significantly. Energy levels may begin to rise, and you might feel less nauseous.';
    }

    else if (weekInPregnancy == 13) {
      return 'This week your baby`s vocal cords are forming, and the baby`s head is now about half the size of its body. They are also about the size of a peapod! This is also the last week of the first trimester. You may feel more energetic and less nauseous. Your uterus is growing and moving upwards, which might relieve some pressure on your bladder.';
    }

    else if (weekInPregnancy == 14) {
      return 'You are now in your second trimester! Your baby is now the size of a lemon. The baby`s neck is getting longer, and the body is starting to straighten out. The kidneys are producing urine, and your baby`s liver is producing bile. Around this time, many women enter the “honeymoon period” of pregnancy, feeling more energetic and less nauseous. You might also notice an increase in appetite.';
    }

    else if (weekInPregnancy == 15) {
      return 'Your baby is now the size of an apple. They are developing taste buds, and the bones are continuing to harden. Your baby can also sense light, even though the eyelids are still fused shut. You might start to show a bit more, and some women feel their first fluttering movements. You could also experience nasal congestion due to increased blood flow.';
    }

    else if (weekInPregnancy == 16) {
      return 'This week you baby`s facial muscles can now move, and they can make a variety of expressions. The nervous system is functioning more, and the baby`s muscles can now flex. You might experience increased energy and a noticeable bump, as your baby is now the size of an avocado! Many women begin to feel their baby move at this stage, especially if they`ve been pregnant before.';
    }

    else if (weekInPregnancy == 17) {
      return 'Your baby is now the size of a turnip! The baby`s skeleton is changing from soft cartilage to bone, and the umbilical cord is growing stronger and thicker. Your baby can now hear sounds outside the womb. Your growing uterus might cause some round ligament pain, which is sharp pain or cramping on one or both sides of your abdomen. You may also start to feel Braxton Hicks contractions, which are normal.';
    }

    else if (weekInPregnancy == 18) {
      return 'This week your baby`s ears are in their final position, and the myelin (protective covering) is forming around the nerves. Their fingerprints are also forming this week and they are now the size of a bell pepper! You might notice more frequent urination as your baby grows and puts pressure on your bladder. You could also experience leg cramps and swelling in your feet and ankles.';
    }

    else if (weekInPregnancy == 19) {
      return 'Your baby is now the size of a tomato! Their skin is developing a protective coating called vernix caseosa. Your baby`s senses are developing, and they can now hear your voice and your heartbeat. You might feel more movement as your baby becomes more active. Skin changes like darkening of the areolas and the appearance of a linea nigra are common.';
    }

    else if (weekInPregnancy == 20) {
      return 'This week marks the halfway point of your pregnancy, and your baby is now the size of a banana! The baby`s digestive system is starting to produce meconium, the first bowel movement. You might feel more comfortable with your pregnancy and have increased energy. However, heartburn and indigestion can be common due to hormonal changes and the growing baby.';
    }

    else if (weekInPregnancy == 21) {
      return 'This week your baby`s movements are more coordinated, and you might feel more pronounced kicks and flips. The baby`s eyebrows and eyelids are fully developed. Your baby is growing quickly, and they are now the size of a carrot! You might experience some back pain as your center of gravity shifts. Varicose veins and stretch marks might also become more noticeable.';
    }

    else if (weekInPregnancy == 22) {
      return 'Your baby is now the size of a spaghetti squash! Their lips, eyelids, and eyebrows are becoming more distinct, and your baby is starting to look more like a newborn. The baby`s sense of touch is also developing. You might experience increased appetite as your baby continues to grow. Skin changes, such as stretch marks and dark patches, are common.';
    }

    else if (weekInPregnancy == 23) {
      return 'Your baby is now the size of a mango. In this week your baby’s skin is becoming less translucent and opaquer. Their hearing is also becoming more acute, and they can respond to sounds. They are also about the size of a mango! You might notice more movement and stronger kicks. Swelling in your hands and feet can occur, and you might experience more frequent Braxton Hicks contractions.';
    }

    else if (weekInPregnancy == 24) {
      return 'This week your baby’s lungs are developing branches of the respiratory tree, and the cells that produce surfactant are forming. The baby’s skin is still thin and translucent but will continue to thicken. They are about the size of an ear of corn! You might feel more pressure on your bladder as your baby grows. Heartburn and indigestion can also be more pronounced.';
    }

    else if (weekInPregnancy == 25) {
      return 'This week, your baby is about the size of a rutabaga! Their skin is beginning to smooth out and look less wrinkled as fat builds up. The nostrils, which have been plugged up until now, start to open, and your baby is beginning to practice breathing by inhaling amniotic fluid. You might notice your baby moving more frequently. Sleep might become more challenging due to discomfort or frequent bathroom trips.';
    }

    else if (weekInPregnancy == 26) {
      return 'Your baby is now the size of a scallion! Their eyes, which were closed for several months, are beginning to open and can start to detect light. The baby’s immune system is also developing and getting stronger. You might experience more backaches and leg cramps. Braxton Hicks contractions may become more noticeable.';
    }

    else if (weekInPregnancy == 27) {
      return 'This week, your baby is about the size of a cauliflower! Their brain continues to develop rapidly, and the lungs are continuing to mature. Your baby can now sleep and wake at regular intervals. You may experience more noticeable swelling in your feet and ankles. Your belly button might pop out as your uterus expands.';
    }

    else if (weekInPregnancy == 28) {
      return 'This week your baby`s eyelashes are growing, and they can blink their eyes. They are also adding more body fat in preparation for life outside the womb. Your baby is now about the size of an eggplant! You might feel more tired and have trouble sleeping. Heartburn and indigestion can continue to be a challenge.';
    }

    else if (weekInPregnancy == 29) {
      return 'This week your baby has grown a lot and is now is about the size of a butternut squash! Their muscles and lungs continue to mature, and their head is growing to make room for their developing brain. You might experience more Braxton Hicks contractions. Shortness of breath can become more common as your baby grows and presses on your diaphragm.';
    }

    else if (weekInPregnancy == 30) {
      return 'Your baby is now the size of a large cabbage! Their bone marrow is now responsible for producing red blood cells. They are also shedding their lanugo, the fine hair that has covered their body. You might feel more pressure on your pelvis and experience increased swelling in your hands and feet. Sleep may become more challenging as you approach the final weeks.';
    }

    else if (weekInPregnancy == 31) {
      return 'This week, your baby is about the size of a coconut! Their brain is developing faster, and all five senses are now functional. Their movements may feel more forceful as they grow bigger and stronger. You may feel more discomfort as your baby grows, and you might experience more frequent and intense Braxton Hicks contractions.';
    }

    else if (weekInPregnancy == 32) {
      return 'Your baby is now the size of a jicama! Their skin is becoming smoother, and they are gaining more body fat. Your baby’s movements might start to feel different as they have less room to move around. You may experience more frequent urination and increased pressure on your bladder. Shortness of breath can continue to be an issue.';
    }

    else if (weekInPregnancy == 33) {
      return 'This week your baby’s bones are continuing to harden, although the skull remains soft and flexible for birth. The baby’s immune system is also developing and they are about the size of a pineapple! You might experience more discomfort and difficulty finding a comfortable position to sleep. Heartburn and indigestion can continue to be bothersome.';
    }

    else if (weekInPregnancy == 34) {
      return 'Your baby is now the size of a cantaloupe! Their lungs are continuing to mature, and they are practicing breathing movements. The baby’s skin is becoming more pink and less translucent. You might feel more pressure in your pelvis as the baby moves lower. Swelling in your feet and ankles can become more noticeable.';
    }

    else if (weekInPregnancy == 35) {
      return 'This week, your baby is about the size of a honeydew melon! Their kidneys are fully developed, and their liver can process some waste products. The baby’s reflexes are also developing, and they can grasp their fingers or toes. You might experience more frequent and intense Braxton Hicks contractions. Shortness of breath can continue to be an issue as your baby grows.';
    }

    else if (weekInPregnancy == 36) {
      return 'Your baby is now the size of a romaine lettuce! Your baby’s digestive system is fully developed and ready to process breast milk or formula. The baby’s head might be engaged in your pelvis, getting ready for birth. You might feel more pressure on your pelvis and experience increased swelling in your hands and feet. Sleep may become more challenging as you approach the final weeks.';
    }

    else if (weekInPregnancy == 37) {
      return 'This week, your baby is about the size of a swiss chard! Their brain and lungs continue to mature, and they are gaining about half an ounce per day. The baby is considered full-term at this stage. You might experience more frequent urination and increased pressure on your bladder. Shortness of breath can continue to be an issue.';
    }

    else if (weekInPregnancy == 38) {
      return 'This week your baby`s organs are fully developed, and they are ready for life outside the womb! Your body and your baby are both getting ready for birth and your baby is about the size of a leek. You might feel more pressure on your pelvis and experience increased swelling in your hands and feet. Sleep may become more challenging as you approach the final weeks.';
    }

    else if (weekInPregnancy == 39) {
      return 'This week, your baby is about the size of a watermelon. Their brain and lungs continue to mature, and they are gaining about half an ounce per day. The baby is considered full-term at this stage. You might experience more frequent urination and increased pressure on your bladder. Shortness of breath can continue to be an issue.';
    }

    else if (weekInPregnancy == 40) {
      return 'Your baby is now the size of a small pumpkin! The baby’s organs are fully developed, and they are ready for life outside the womb. Their head is engaged in your pelvis, getting ready for birth. You might feel more pressure on your pelvis and experience increased swelling in your hands and feet. Sleep may become more challenging as you approach the final weeks.';
    }

    else {
      return 'Beyond Pregnancy';
    }
  }

  getPregnancyTip(weekInPregnancy: number): string {
    if (weekInPregnancy == 1) {
      return 'Make sure to get extra nutrients, specifically folic acid to help your body prepare for a baby. Some foods that contain high levels of folic acid are asparagus, papaya, broccoli, lentils, and leafy greens! Its also a good idea to take prenatal vitamins, but always check in with a doctor before taking any supplements or making major changes to your diet.';
    } 

    else if (weekInPregnancy == 2) {
      return 'Make sure to get extra nutrients, specifically folic acid to help your body prepare for a baby. Some foods that contain high levels of folic acid are asparagus, papaya, broccoli, lentils, and leafy greens! Its also a good idea to take prenatal vitamins, but always check in with a doctor before taking any supplements or making major changes to your diet.';
    } 

    else if (weekInPregnancy == 3) {
      return 'Now that your body is ready to grow your baby, its time to cut out the alcohol and up your iron intake! Foods rich with iron and vitamin C will help support your baby’s growing blood supply. Try eating foods like spinach, soy, poultry, and dried food to gain iron and foods like oranges, kiwis, tomatoes, and melons to gain vitamin C.';
    } 

    else if (weekInPregnancy == 4) {
      return 'This week is a great time to start taking prenatal vitamins if you haven’t already. They contain minerals and vitamins that are essential for growing your baby. There are different forms of prenatal vitamins, as they come in many forms such as gummies, liquid, or softgels. Whichever option you choose, make sure it covers all of the following nutrients: folic acid, iron, calcium, vitamin D, omega-3 fatty acids, vitamin B, and vitamin C.';
    } 

    else if (weekInPregnancy == 5) {
      return 'Time to start taking precautions with your body. Now is not the time to go overboard with exercise. Check in with your doctor if you have plans of long and hard workouts, but otherwise, regular exercise should actually help your body! You may also feel increasingly bloated, so opt for foods that will help decrease that, such as swapping broccoli and cabbage for fruits like mangos and strawberries. Also try to consume some pregnancy safe fish to make sure you`re getting enough healthy fats.';
    } 

    else if (weekInPregnancy == 6) {
      return 'Try eating dry and bland food to help with morning sickness. While this doesn’t sound appealing, you have a few options here. Eat foods such as saltines, dry cereal, pretzels, rice cakes, or breadsticks to help. It also might be a good idea to hold of on the hair touchups. While hair coloring hasn’t been proven to be detrimental, many experts agree it is better to be safe and wait until your second trimester before coloring your hair.';
    } 

    else if (weekInPregnancy == 7) {
      return 'During this time you may feel many changes in your breasts such as soreness, darkening of the areola, and small bumps on the areola. Due to this, ice can be incredibly helpful in lessening pain by reducing blood flow and nerve activity in the area. In addition to this, eating all types of fruit this week is crucial in making sure you and your baby are getting all the necessary nutrients at this time. If you are a cat owner, something to be aware of is that cat feces can have a parasite in that causes toxoplasmosis, which is an infection that is unhealthy for unborn babies, so it is a good idea to stay away from the litter box!';
    } 

    else if (weekInPregnancy == 8) {
      return 'As your baby grows, lots of bodily discomfort will likely come with it. Your blood volume will increase by close to 50 percent, which can cause painful headaches. Unfortunately, not all pain medication, such as aspirin, ibuprofen, and naproxen are baby safe, so it is recommended to talk to your doctor about switching to alternatives like acetaminophen. You should also ensure you are wearing sunscreen daily as pregnancy can often cause melasma or increase skin sensitivity. Lastly, it is now a good idea to stay out of hot tubs or anything that raises your body temperature over 101 degrees.';
    } 

    else if (weekInPregnancy == 9) {
      return 'As morning sickness begins to wind down, focus on eating six small meals throughout the day instead of three big ones. This will help you keep food down easier and help you get the nutrients you need. It also may help to take antiacids and cut down on citrus if you are still feeling if you are still experiencing heartburn. When sleeping it is also recommended to begin sleeping on your side as your stomach begins to grow, as this position allows for maximum blood flow and nutrients to the placenta.';
    } 

    else if (weekInPregnancy == 10) {
      return 'Continue eating small, frequent meals to maintain energy levels and manage nausea. Incorporate protein-rich snacks like nuts and cheese. Stay hydrated and consider prenatal yoga or light exercises to boost energy and mood.';
    } 

    else if (weekInPregnancy == 11) {
      return 'Moisturize your skin to help with dryness and itching. Continue taking prenatal vitamins and start looking into prenatal classes to prepare for the months ahead.';
    } 

    else if (weekInPregnancy == 12) {
      return 'Reflexes are developing, so your baby can now make sucking movements and even respond to stimuli by moving away from pokes on your belly. This week your baby is now the size of a plum. The intestines are moving into their final position, and the liver is producing bile. Many mothers start to feel a bit better this week as the risk of miscarriage decreases significantly. Energy levels may begin to rise, and you might feel less nauseous.';
    } 

    else if (weekInPregnancy == 13) {
      return 'Start thinking about your maternity wardrobe as your regular clothes may begin to feel tight. Eating fiber-rich foods and drinking plenty of water can help with constipation, a common symptom at this stage.';
    } 

    else if (weekInPregnancy == 14) {
      return 'Focus on a balanced diet rich in fruits, vegetables, lean proteins, and whole grains. Regular, light exercise like walking or swimming can also help you stay fit and alleviate some pregnancy symptoms.';
    } 

    else if (weekInPregnancy == 15) {
      return 'Stay active with safe exercises like prenatal yoga or swimming. This can help improve your mood, energy levels, and overall health.';
    } 

    else if (weekInPregnancy == 16) {
      return 'Make sure to attend your prenatal checkups and discuss any concerns with your healthcare provider. It`s also a good time to start thinking about your birth plan and discussing it with your doctor or midwife.';
    } 

    else if (weekInPregnancy == 17) {
      return 'Practice good posture and consider wearing a maternity support belt to help with back pain. Stay hydrated and continue eating a balanced diet to support your baby`s growth.';
    } 

    else if (weekInPregnancy == 18) {
      return 'Elevate your legs when resting to help with swelling, and drink plenty of water. Prenatal massages and warm baths can also help with leg cramps and overall relaxation.';
    } 

    else if (weekInPregnancy == 19) {
      return 'Continue moisturizing your skin to help with itching and stretch marks. Stay active with regular, gentle exercise to support your physical and mental well-being.';
    } 

    else if (weekInPregnancy == 20) {
      return 'Eat smaller, more frequent meals to help with digestion and avoid lying down immediately after eating. Continue with prenatal appointments and consider scheduling a mid-pregnancy ultrasound.';
    } 

    else if (weekInPregnancy == 21) {
      return 'Practice good posture and consider wearing supportive shoes. Regular, gentle exercise like walking can help alleviate back pain and improve circulation.';
    } 

    else if (weekInPregnancy == 22) {
      return 'Maintain a healthy, balanced diet to support your baby`s growth. Keep your skin moisturized and stay hydrated to help with skin changes.';
    } 

    else if (weekInPregnancy == 23) {
      return 'Elevate your feet and wear comfortable shoes to help with swelling. Practice relaxation techniques like deep breathing and prenatal yoga to help with Braxton Hicks contractions.';
    } 

    else if (weekInPregnancy == 24) {
      return 'Drink plenty of water and eat fiber-rich foods to help with digestion. Avoid spicy and fatty foods to reduce heartburn and indigestion.';
    } 

    else if (weekInPregnancy == 25) {
      return 'Invest in a good pregnancy pillow to help you find a comfortable sleeping position. Try to maintain a consistent sleep schedule and create a relaxing bedtime routine.';
    } 

    else if (weekInPregnancy == 26) {
      return 'Practice prenatal yoga or gentle stretching to help with back pain and leg cramps. Stay hydrated and take warm baths to relax your muscles.';
    } 

    else if (weekInPregnancy == 27) {
      return 'Elevate your feet whenever possible and wear comfortable, supportive shoes. Stay active with light exercise like walking to help with circulation and reduce swelling.';
    } 

    else if (weekInPregnancy == 28) {
      return ' Avoid large meals before bedtime and try to sleep propped up to reduce heartburn. Incorporate relaxation techniques such as deep breathing or meditation to help you fall asleep.';
    } 

    else if (weekInPregnancy == 29) {
      return 'Practice deep breathing exercises to help with shortness of breath. Stay hydrated and continue with light, regular exercise to keep your body strong and flexible.';
    } 

    else if (weekInPregnancy == 30) {
      return 'Rest whenever you can and use pillows to support your body while sleeping. Avoid standing for long periods and elevate your feet to reduce swelling.';
    } 

    else if (weekInPregnancy == 31) {
      return 'Continue practicing relaxation techniques to manage discomfort and contractions. Stay hydrated and eat a balanced diet to maintain your energy levels.';
    } 

    else if (weekInPregnancy == 32) {
      return 'Try to take breaks and rest whenever possible. Practice good posture and use pillows to support your back and abdomen.';
    } 

    else if (weekInPregnancy == 33) {
      return 'Eat smaller, more frequent meals to help with digestion. Use pillows to prop yourself up while sleeping to reduce heartburn.';
    } 

    else if (weekInPregnancy == 34) {
      return 'Elevate your feet whenever possible and wear comfortable, supportive shoes. Stay active with light exercise like walking to help with circulation and reduce swelling.';
    } 

    else if (weekInPregnancy == 35) {
      return 'Practice deep breathing exercises to help with shortness of breath. Stay hydrated and continue with light, regular exercise to keep your body strong and flexible.';
    } 

    else if (weekInPregnancy == 36) {
      return 'Rest whenever you can and use pillows to support your body while sleeping. Avoid standing for long periods and elevate your feet to reduce swelling.';
    } 

    else if (weekInPregnancy == 37) {
      return 'Try to take breaks and rest whenever possible. Practice good posture and use pillows to support your back and abdomen.';
    } 

    else if (weekInPregnancy == 38) {
      return 'Rest whenever you can and use pillows to support your body while sleeping. Avoid standing for long periods and elevate your feet to reduce swelling.';
    } 

    else if (weekInPregnancy == 39) {
      return 'Try to take breaks and rest whenever possible. Practice good posture and use pillows to support your back and abdomen.';
    } 

    else if (weekInPregnancy == 40) {
      return 'Your body is now ready to give birth, rest whenever you can and use pillows to support your body while sleeping. Avoid standing for long periods and elevate your feet to reduce swelling.';
    } 

    else {
      return 'No specific tip for this week. Just keep doing your best!';
    }
  }

  
}
