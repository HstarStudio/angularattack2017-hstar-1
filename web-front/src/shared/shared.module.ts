import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';

const KendoModules = [
  ButtonsModule,
  DateInputsModule,
  DialogModule,
  DropDownsModule,
  GridModule,
  InputsModule,
  LabelModule,
  LayoutModule,
  PopupModule
];

@NgModule({
  imports: [
    CommonModule,
    ...KendoModules,
    TranslateModule.forRoot()
  ],
  exports: [
    CommonModule,
    ...KendoModules,
    TranslateModule
  ],
  declarations: [],
  providers: [],
})
export class SharedModule {

}
