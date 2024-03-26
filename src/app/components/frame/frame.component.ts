import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsService } from '@app/services/forms.service';
import { FramesService } from '@app/services/frames.service';
import { FormWrapper } from '@app/wrappers/form-wrapper';
import { Subscription } from 'rxjs';

/**Es gibt am HTMLClient nur einen Frame. In Java gibts den MainFrame und HelpFrame,
 * das gibts nicht im HTMLClient. Jede Form wird in den HauptFrame geladen.
 * Deshalb gibt es eine FrameComponent.
 * In den #anchor der frame component, wird über das json vom Broker manuell die FormComponent
 * reingehängt. Wenn dann die Form gewechselt wird, wird der komplette #anchor in der frame-component ausgetauscht. */
@Component({
  standalone: true,
  selector: 'hc-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit, OnDestroy {

  @ViewChild('frame', { static: true })
  public frame: ElementRef<HTMLDivElement> | null = null;

  @ViewChild('anchor', { read: ViewContainerRef, static: true })
  public anchor: ViewContainerRef | null = null;

  private readonly _zone: NgZone;
  private readonly _formsService: FormsService;
  private readonly _framesService: FramesService;

  private _selectedForm: FormWrapper | null = null;
  private _selectedFormSub: Subscription | null = null;

  public constructor(
    zone: NgZone,
    formsService: FormsService,
    framesService: FramesService
  ) {
    this._zone = zone;
    this._formsService = formsService;
    this._framesService = framesService;
  }

  @HostListener('window:resize')
  public layout(): void {
    this._zone.run(() => {
      if (this._selectedForm && this.frame) {
        //Displaygröße vom Frame wird mitgegeben und dann wird wie im Java das Layout aufgebaut
        this._selectedForm.doLayout(this.frame.nativeElement.clientWidth, this.frame.nativeElement.clientHeight);
      }
    });
  }

  public ngOnInit(): void {
    this._framesService.registerFrame(this);

    this._selectedFormSub = this._formsService.getSelectedForm().subscribe({
      next: form => {
        this.showForm(form);
      }
    });

    this._formsService.fireSelectCurrentForm();
  }

  public ngOnDestroy(): void {
    this._selectedFormSub?.unsubscribe();
  }

  /** Dem Frame eine Form übergeben zum anschauen. */
  private showForm(form: FormWrapper | null): void {
    if (this.anchor != null) {
      // Der komplette ComponenTree wird gekillt (ngDestroy).
      this.anchor.clear();
      if (form) {
        this._selectedForm = form;
        // Bau NGComponents auf, mach alles
        // Müsste ein Obs zurückgeben, um keine zwei CDC.
        this._selectedForm.attachComponentToFrame(this.anchor);
        // wenn NGComponents im DOM angezeigt sind und der ChangeDetectionCycle durch ist,
        // dann mach nochmal ein layout ChangeDetectionCycle
        setTimeout(() => this.layout());
      } else {
        this._selectedForm = null;
      }
    }
  }
}
