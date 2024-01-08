import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PayoutComponent, PayoutResponseDialog } from './payout/payout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatColumnDef } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { PayoutsService } from './services/payout/payouts.service';
import { MessageService } from './message.service';
import { HttpErrorHandlerService } from './services/error-handler/http-error-handler.service';
import { HeaderComponent } from './header/header.component';
import { AppHttpInterceptor } from './services/interceptor/app.http.interceptor';
import { ToasterComponent } from './helper/toaster/toaster.component';
import { AvatarModule } from 'ngx-avatars';
@NgModule({
  declarations: [
    AppComponent,
    PayoutComponent,
    PayoutResponseDialog,
    HeaderComponent,
    ToasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AvatarModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true

    },
    PayoutsService,
    MessageService,
    HttpErrorHandlerService,
    MatColumnDef
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
