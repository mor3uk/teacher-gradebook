import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  RippleGlobalOptions,
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatDialogModule,
  MatDatepickerModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { MomentDateModule } from '@angular/material-moment-adapter';

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatDialogModule,
  MatDatepickerModule,
  MomentDateModule,
  MatInputModule,
  MatProgressSpinnerModule,
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