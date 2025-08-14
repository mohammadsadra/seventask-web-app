import {BrowserModule} from '@angular/platform-browser';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {SignInComponent} from './pages/account/signIn/sign-in.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {SignUpComponent} from './pages/account/signUp/sign-up.component';
import {ForgetPasswordComponent} from './primaryPages/account/forgetPassword/forget-password.component';
import {SeventaskInterceptor} from './utilities/SeventaskInterceptor';
import {AccountService} from './services/accountService/account.service';
import {SsoComponent} from './pages/account/sso/sso.component';
import {CookieService} from 'ngx-cookie-service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';
import {
  AddChecklistItemComponent,
  AddProjectComponent,
  AddTaskComponent,
  ToDoComponent,
} from './pages/kanban/to-do.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {JWTTokenService} from './services/accountService/jwttoken.service';
import {AuthorizeGuard} from './utilities/AuthorizedGuard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {
  DeleteVerification,
  DialogContentExampleDialog,
  TeamComponent,
} from './pages/team/team.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ConfirmAccountComponent} from './pages/account/confirmAccount/confirm-account.component';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CountdownModule} from 'ngx-countdown';
import {MatDialogModule} from '@angular/material/dialog';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UploadFileComponent} from './primaryPages/sharedComponents/uploadFile/upload-file.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ColorAlphaModule} from 'ngx-color/alpha'; // <color-alpha-picker></color-alpha-picker>
import {ColorBlockModule} from 'ngx-color/block'; // <color-block></color-block>
import {ColorChromeModule} from 'ngx-color/chrome'; // <color-chrome></color-chrome>
import {ColorCircleModule} from 'ngx-color/circle'; // <color-circle></color-circle>
import {ColorCompactModule} from 'ngx-color/compact'; // <color-compact></color-compact>
import {ColorGithubModule} from 'ngx-color/github'; // <color-github></color-github>
import {ColorHueModule} from 'ngx-color/hue'; // <color-hue-picker></color-hue-picker>
import {ColorMaterialModule} from 'ngx-color/material'; // <color-material></color-material>
import {ColorPhotoshopModule} from 'ngx-color/photoshop'; // <color-photoshop></color-photoshop>
import {ColorSliderModule} from 'ngx-color/slider'; // <color-slider></color-slider>
import {ColorSwatchesModule} from 'ngx-color/swatches'; // <color-swatches></color-swatches>
import {ColorTwitterModule} from 'ngx-color/twitter'; // <color-twitter></color-twitter>
import {ColorShadeModule} from 'ngx-color/shade';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {DateTimePickerComponent} from './primaryPages/sharedComponents/dateTimePicker/date-time-picker.component';
// tslint:Disable-next-line:max-line-length
import {MatSidenavModule} from '@angular/material/sidenav';
import {
  ReportBug,
  SevenTaskHomeComponent,
} from './primaryPages/seventaskHome/seven-task-home.component';
import {
  AddMemberToCreatedProject,
  ProjectOverviewComponent,
} from './pages/project/projectOverview/project-overview.component';
import {TasksHeaderComponent} from './primaryPages/sharedComponents/header/tasksHeader/tasks-header.component';
import {ProjectLeftNavBarComponent} from './primaryPages/sharedComponents/leftNavBar/projectLeftNavBar/project-left-nav-bar.component';
import {
  AddDepartment,
  AddMember,
  AddTeam,
  NewProject,
  ProjectHeaderComponent,
} from './primaryPages/sharedComponents/header/projectHeader/project-header.component';
import {DataService} from './services/dataService/data.service';
import {
  AddChecklistItemFromInspectorComponent,
  EditTeamAndProjectComponent,
  TaskRightNavBarComponent,
} from './primaryPages/sharedComponents/rightNavBar/taskRightNavBar/task-right-nav-bar.component';
import {
  WorkloadChartComponent,
  MinutesToHours,
} from './primaryPages/sharedComponents/rightNavBar/taskRightNavBar/workloadChart/workload-chart.component';
// tslint:disable-next-line:max-line-length
import {CommnetsTaskComponent} from './primaryPages/sharedComponents/rightNavBar/taskRightNavBar/commnets/commnets-task.component';
import {TaskLeftNavBarComponent} from './primaryPages/sharedComponents/leftNavBar/taskLeftNavBar/task-left-nav-bar.component';
import {
  AddMemberOrDepartment,
  CreatNewDepartment,
  NewTeam,
  TeamHeaderComponent,
} from './primaryPages/sharedComponents/header/teamHeader/team-header.component';
import {
  ChatRoomComponent,
  DeleteMessageVerificationDialog,
} from './pages/chatRoom/chat-room.component';
import {ChatLeftNavBarComponent} from './primaryPages/sharedComponents/leftNavBar/chatLeftNavBar/chat-left-nav-bar.component';
import {
  ProjectOverviewLeftNavBarComponent
} from './primaryPages/sharedComponents/leftNavBar/projectOverviewLeftNavBar/project-overview-left-nav-bar.component';
import {TeamLeftNavBarComponent} from './primaryPages/sharedComponents/leftNavBar/teamLeftNavBar/team-left-nav-bar.component';
import {LoginComponent} from './primaryPages/account/login/login.component';
import {
  DeleteTeamVerificationDialog,
  TeamRightNavBarComponent,
} from './primaryPages/sharedComponents/rightNavBar/teamRightNavBar/team-right-nav-bar.component';
import {
  DeleteProjectVerificationDialog,
  ProjectRightNavBarComponent,
} from './primaryPages/sharedComponents/rightNavBar/projectRightNavBar/project-right-nav-bar.component';
import {FadeComponent} from './primaryPages/sharedComponents/animations/fade/fade.component';
import {OnboardingComponent} from './primaryPages/account/onboarding/onboarding.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {ImageCropComponent} from './primaryPages/sharedComponents/imageCrop/image-crop.component';
import {
  AddMemberInDepartment,
  TeamOverviewComponent,
  DialogDepertmentDelete,
} from './pages/team/teamOverview/team-overview.component';
import {
  TeamOverviewLeftNavBarComponent
} from './primaryPages/sharedComponents/leftNavBar/team-overview-left-nav-bar/team-overview-left-nav-bar.component';
import {ChatRightNavBarComponent} from './primaryPages/sharedComponents/rightNavBar/chatRightNavBar/chat-right-nav-bar.component';
import {AutoFocusDirective} from './directives/auto-focus.directive';
import {MatMenuModule} from '@angular/material/menu';
import {
  NotificationRightNavBarComponent,
  FuncPipeText,
  FuncPipeImg,
  FuncPipeTimeZone,
  FuncPipeCheckTime,
  FuncPipeTimedifferenceCalc,
  FuncPipeReplaceParam,
} from './primaryPages/sharedComponents/rightNavBar/notificationRightNavBar/notification-right-nav-bar.component';
import {
  RunnigtaskNotificationRightNavBarComponent
} from './primaryPages/sharedComponents/rightNavBar/notificationRightNavBar/runningtaskNotificationRightNavBar/runnigtask-notification-right-nav-bar/runnigtask-notification-right-nav-bar.component';
import {TimeTrackerPipe} from './pipes/time-tracker.pipe';
import {
  TrackerTimeDatePipe,
  FuncPipeTrackerTotal,
  PipeCheckTimeRepeat,
} from './pipes/tracker-time-date.pipe';
import {TextAnalysisPipe} from './pipes/text-analysis.pipe';

import {MatBadgeModule} from '@angular/material/badge';
import {
  StickyChatRightNavBarComponent
} from './primaryPages/sharedComponents/rightNavBar/sticky-chat-right-nav-bar/sticky-chat-right-nav-bar.component';
import {SearchPipe} from './pipes/search.pipe';
import {UserSearchPipe} from './pipes/user-search.pipe';
import {DatePipe} from '@angular/common';
import {CalendarComponent} from './primaryPages/calendar/calendar.component';
import {ArbicNumberDatePipe} from './pipes/arbic-number-date.pipe';
import {JalaliDatePipe} from './pipes/jalali-date.pipe';
import {CalendarHeaderComponent} from './primaryPages/sharedComponents/header/calendarHeader/calendar-header.component';
import {FilterPipe} from './pipes/filter.pipe';
import {ShowMessageInDialogComponent} from './primaryPages/sharedComponents/showMessageInDialog/show-message-in-dialog.component';
import {MinuteToHourPipe} from './pipes/minute-to-hour.pipe';
import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
// tslint:disable-next-line:import-spacing
import {CalendarLeftNavBarComponent} from './primaryPages/sharedComponents/leftNavBar/calendarLeftNavBar/calendar-left-nav-bar.component';
import {
  CalendarRightNavBarComponent
} from './primaryPages/sharedComponents/rightNavBar/calendarRightNavBar/calendar-right-nav-bar.component';
import {
  StickyCalendarRightNavBarComponent
} from './primaryPages/sharedComponents/rightNavBar/stickyCalendarRightNavBar/sticky-calendar-right-nav-bar.component';
import {CalendarNewEventComponent} from './primaryPages/calendar/calendarNewEvent/calendar-new-event.component';
import {EnglishNumberToArabicNumberPipe} from './pipes/english-number-to-arabic-number.pipe';
import {SliceImageStringPipe} from './pipes/slice-image-string.pipe';
import {CastToFilterPriorityModelPipe} from './pipes/filter/cast-to-filter-priority-model.pipe';
import {WhatIsNewComponent} from './pages/whatIsNew/what-is-new.component';
import {ProjectComponent} from './pages/project/project.component';
import {SafeHtmlPipe} from './pipes/safe-html-pipe.pipe';
import {ManageDatePipe} from './pipes/manage-date.pipe';
import {DepartmentMemberPipe} from './pipes/department-member.pipe';
import {SettingsComponent} from './pages/settings/settings.component';
import {TimetrackComponent} from './pages/settings/timetrack/timetrack.component';
// tslint:disable-next-line:import-spacing
import {SettingsLeftNavBarComponent} from './primaryPages/sharedComponents/leftNavBar/settingsLeftNavBar/settings-left-nav-bar.component';
import {SeventaskSpinnerComponent} from './primaryPages/sharedComponents/seventaskSpinner/seventask-spinner.component';
import {SortTaskPipe} from './pipes/sort-task.pipe';
import {ScrollToBottomDirective} from './directives/scroll-to-bottom.directive';
import {PaymentComponent} from './primaryPages/payment/payment.component';
import {ChannelTypeFilterPipe} from './pipes/channel-type-filter.pipe';
import {TinyCalendarComponent} from './primaryPages/calendar/tinyCalendar/tiny-calendar.component';
import {DragAndDropFileDirective} from './directives/drag-and-drop-file.directive';
import {ProgressComponent} from './primaryPages/sharedComponents/progress/progress.component';
import {TaskCardComponent} from './pages/kanban/taskCard/task-card.component';
import {DateTimeRangePickerComponent} from './primaryPages/sharedComponents/dateTimeRangePicker/date-time-range-picker.component';
import {ProjectCardComponent} from './pages/project/project-card/project-card.component';
import {AddMemberDialogComponent} from './primaryPages/sharedComponents/add-member-dialog/add-member-dialog.component';
import {ShowFileComponent} from './primaryPages/sharedComponents/show-file/show-file.component';
import {HoverClassDirective} from './directives/hover-class.directive';
import {AutoSelectDirective} from './directives/auto-select.directive';
import {TooltipDirective} from './directives/tooltip.directive';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {ActivityLogComponent} from './primaryPages/sharedComponents/rightNavBar/taskRightNavBar/activityLog/activity-log.component';
import {DragDropDirective} from './directives/drag-drop.directive';
import {AngularResizedEventModule} from 'angular-resize-event';
import {LinkFinderPipe} from './pipes/link-finder.pipe';
import {AutoScrollToTaskDirective} from './directives/auto-scroll-to-task.directive';
import {SeventaskDatePipePipe} from './pipes/seventask-date-pipe.pipe';
import {
  ChannelMemberListDialogComponent
} from './primaryPages/sharedComponents/channel-member-list-dialog/channel-member-list-dialog.component';
import {ChannelSearchPipe} from './pipes/channel-search.pipe';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {EditEventComponent} from './primaryPages/sharedComponents/edit-event/edit-event.component';
import {TimetrackHeaderComponent} from './primaryPages/sharedComponents/header/timetrack-header/timetrack-header.component';
import {WorkLoadInPeriodComponent} from './primaryPages/sharedComponents/rightNavBar/work-load-in-period/work-load-in-period.component';
import {IntegrationsComponent} from './pages/settings/integrations/integrations.component';
import {IntegrationComponent} from './pages/integration/integration.component';
import {TeamSearchPipe} from './pipes/team-search.pipe';
import {ProjectSearchPipe} from './pipes/project-search.pipe';
import {MatChipsModule} from '@angular/material/chips';
import {ReminderComponent} from './primaryPages/sharedComponents/reminder/reminder.component';
import {SortStatusPipe} from './pipes/sort-status.pipe';
import {ProjectChangeTeamComponent} from './pages/project/project-change-team/project-change-team.component';
import {JitsiComponent} from './primaryPages/call/jitsi/jitsi.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const google_OAuth_ClientId =
  '299366342223-dhci3ek2ea22j6b3110n4a8na0kc3fps.apps.googleusercontent.com';

const googleLoginOptions = {
  scope: 'profile email',
  plugin_name: 'login' // you can use any name here
};

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgetPasswordComponent,
    SsoComponent,
    ToDoComponent,
    TeamComponent,
    ConfirmAccountComponent,
    DialogContentExampleDialog,
    UploadFileComponent,
    ProjectComponent,
    DeleteVerification,
    SevenTaskHomeComponent,
    AddTaskComponent,
    ProjectOverviewComponent,
    TasksHeaderComponent,
    ProjectLeftNavBarComponent,
    ProjectHeaderComponent,
    TaskRightNavBarComponent,
    WorkloadChartComponent,
    MinutesToHours,
    CommnetsTaskComponent,
    NewProject,
    AddTeam,
    TaskLeftNavBarComponent,
    AddDepartment,
    AddMember,
    TeamHeaderComponent,
    NewTeam,
    AddMemberOrDepartment,
    AddProjectComponent,
    ChatRoomComponent,
    ChatLeftNavBarComponent,
    ProjectOverviewLeftNavBarComponent,
    TeamLeftNavBarComponent,
    LoginComponent,
    TeamRightNavBarComponent,
    ProjectRightNavBarComponent,
    FadeComponent,
    OnboardingComponent,
    ImageCropComponent,
    DeleteMessageVerificationDialog,
    TeamOverviewComponent,
    TeamOverviewLeftNavBarComponent,
    AddChecklistItemComponent,
    ChatRightNavBarComponent,
    AddChecklistItemFromInspectorComponent,
    CreatNewDepartment,
    ReportBug,
    DeleteProjectVerificationDialog,
    DeleteTeamVerificationDialog,
    AutoFocusDirective,
    /* --> notification*/
    NotificationRightNavBarComponent,
    RunnigtaskNotificationRightNavBarComponent,
    FuncPipeText,
    FuncPipeImg,
    FuncPipeTimeZone,
    FuncPipeCheckTime,
    FuncPipeReplaceParam,
    SliceImageStringPipe,
    FuncPipeTimedifferenceCalc,
    TimeTrackerPipe,
    TrackerTimeDatePipe,
    FuncPipeTrackerTotal,
    PipeCheckTimeRepeat,
    /* --> End notification */
    /* --> Dashboard */
    ManageDatePipe,
    /* end Dashboard */
    TextAnalysisPipe,
    ShowFileComponent,
    StickyChatRightNavBarComponent,
    SearchPipe,
    SearchPipe,
    UserSearchPipe,
    CalendarComponent,
    JalaliDatePipe,
    ArbicNumberDatePipe,
    CalendarHeaderComponent,
    AddMemberToCreatedProject,
    FilterPipe,
    ShowMessageInDialogComponent,
    MinuteToHourPipe,
    DashboardComponent,
    CalendarLeftNavBarComponent,
    CalendarRightNavBarComponent,
    StickyCalendarRightNavBarComponent,
    CalendarNewEventComponent,
    EnglishNumberToArabicNumberPipe,
    CastToFilterPriorityModelPipe,
    WhatIsNewComponent,
    SafeHtmlPipe,
    DepartmentMemberPipe,
    AddMemberInDepartment,
    DialogDepertmentDelete,
    EditTeamAndProjectComponent,
    SettingsComponent,
    TimetrackComponent,
    SettingsLeftNavBarComponent,
    SeventaskSpinnerComponent,
    SeventaskSpinnerComponent,
    SortTaskPipe,
    ScrollToBottomDirective,
    PaymentComponent,
    ChannelTypeFilterPipe,
    TinyCalendarComponent,
    DragAndDropFileDirective,
    ProgressComponent,
    DateTimePickerComponent,
    DateTimeRangePickerComponent,
    TaskCardComponent,
    ProjectCardComponent,
    AddMemberDialogComponent,
    // IfChangesDirective,
    HoverClassDirective,
    AutoSelectDirective,
    TooltipDirective,
    ActivityLogComponent,
    DragDropDirective,
    LinkFinderPipe,
    AutoScrollToTaskDirective,
    SeventaskDatePipePipe,
    ChannelMemberListDialogComponent,
    ChannelSearchPipe,
    EditEventComponent,
    TimetrackHeaderComponent,
    WorkLoadInPeriodComponent,
    IntegrationsComponent,
    IntegrationComponent,
    TeamSearchPipe,
    UserSearchPipe,
    TeamSearchPipe,
    ProjectSearchPipe,
    ReminderComponent,
    SortStatusPipe,
    ProjectChangeTeamComponent,
    JitsiComponent,
  ],
  imports: [
    AngularResizedEventModule,
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    SocialLoginModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      [
        // {path: '', component: HomeComponent, pathMatch: 'full'},
        // {path: 'signIn', component: LoginComponent, pathMatch: 'full'},
        {
          path: 'signIn',
          component: LoginComponent,
          pathMatch: 'full',
          data: {animation: 'SignInPage'},
        },
        {path: 'signUp', component: SignUpComponent, pathMatch: 'full'},
        {
          path: 'forgetPassword',
          component: ForgetPasswordComponent,
          pathMatch: 'full',
          data: {animation: 'ForgetPasswordPage'},
        },
        {
          path: localStorage.getItem('languageCode') + '/forgetPassword',
          component: ForgetPasswordComponent,
          pathMatch: 'full',
        },
        {path: 'sso', component: SsoComponent, pathMatch: 'full'},
        {
          path: '',
          component: SevenTaskHomeComponent,
          canActivate: [AuthorizeGuard],
          children: [
            {
              path: 'dashboard',
              component: DashboardComponent,
              data: {animation: 'DashboardPage'},
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'todo',
              component: ToDoComponent,
              data: {animation: 'KanbanPage'},
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'chat',
              component: ChatRoomComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'team',
              component: TeamComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'calendar',
              component: CalendarComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'project',
              component: ProjectComponent,
              data: {animation: 'ProjectPage'},
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },

            {
              path: 'payment/:teamId',
              component: PaymentComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'settings',
              component: SettingsComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'timetrack',
              component: TimetrackComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'integrations',
              component: IntegrationsComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'integration/google',
              component: IntegrationComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'project/projectOverview/:id',
              component: ProjectOverviewComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'team/teamOverview/:id',
              component: TeamOverviewComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'inviteTeam',
              component: TeamComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {
              path: 'call',
              component: JitsiComponent,
              pathMatch: 'full',
              canActivate: [AuthorizeGuard],
            },
            {path: '**', redirectTo: '/todo', pathMatch: 'full'},
          ],
        },
        // {path: 'header', component: HeaderComponent, pathMatch: 'full'},
        // {path: 'confirm', component: ConfirmAccountComponent, pathMatch: 'full'}
      ],
      {
        onSameUrlNavigation: 'reload',
      }
    ),
    BrowserAnimationsModule,
    MatStepperModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSliderModule,
    MatInputModule,
    MatRippleModule,
    MatGridListModule,
    MatListModule,
    MatSlideToggleModule,
    MatCardModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    FontAwesomeModule,
    DragDropModule,
    ScrollingModule,
    MatToolbarModule,
    MatProgressBarModule,
    AngularFileUploaderModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SweetAlert2Module.forRoot(),
    MatProgressSpinnerModule,
    CountdownModule,
    MatDialogModule,
    ClipboardModule,
    MatSnackBarModule,
    RouterModule,
    MatTooltipModule,
    MatSelectModule,
    ColorSketchModule,
    ColorAlphaModule,
    ColorBlockModule,
    ColorChromeModule,
    ColorCircleModule,
    ColorCompactModule,
    ColorGithubModule,
    ColorHueModule,
    ColorMaterialModule,
    ColorPhotoshopModule,
    ColorSliderModule,
    ColorSwatchesModule,
    ColorTwitterModule,
    ColorShadeModule,
    MatSidenavModule,
    MatButtonToggleModule,
    ImageCropperModule,
    MatMenuModule,
    MatBadgeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    PickerModule,
    MatChipsModule,
  ],
  providers: [
    DatePipe,
    TimeTrackerPipe,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging()),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '299366342223-dhci3ek2ea22j6b3110n4a8na0kc3fps.apps.googleusercontent.com', googleLoginOptions
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    AccountService,
    CookieService,
    JWTTokenService,
    // dataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SeventaskInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {
}
