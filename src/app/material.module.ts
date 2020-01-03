import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  RippleGlobalOptions,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatDialogModule,
  MatDatepickerModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
} from '@angular/material';
import { MomentDateModule } from '@angular/material-moment-adapter';


const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatDialogModule,
  MatDatepickerModule,
  MomentDateModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,

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
