import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatButtonModule,
  RippleGlobalOptions,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatDialogModule,
} from '@angular/material';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatDatepickerModule,
  MomentDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatDialogModule,
  BrowserAnimationsModule,
];

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 0,
    exitDuration: 0
  }
};

@NgModule({
  imports: materialModules,
  exports: materialModules,
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }
  ]
})
export class MaterialModule { }
