import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendance'
})
export class AttendancePipe implements PipeTransform {
  transform(passedLessons: number, visitedLessons: number): string {
    if (!passedLessons) {
      return '0%';
    }
    const percent = (visitedLessons / passedLessons) * 100;
    return Math.round(percent) + '%';
  }
}
