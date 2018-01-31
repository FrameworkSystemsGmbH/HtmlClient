import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, ComponentType } from '@angular/cdk/portal';

export interface IOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: IOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'hc-overlay'
};

@Injectable()
export abstract class OverlayService<T> {

  constructor(
    private injector: Injector,
    private overlay: Overlay) { }

  protected getInjector(): Injector {
    return this.injector;
  }

  protected createOverlay(config: IOverlayConfig): OverlayRef {
    const dialogConfig: IOverlayConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayConfig = this.getOverlayConfig(dialogConfig);
    return this.overlay.create(overlayConfig);
  }

  protected attachDialogContainer(overlayRef: OverlayRef, injector: PortalInjector, compType: ComponentType<T>): T {
    const containerPortal = new ComponentPortal(compType, null, injector);
    const containerRef: ComponentRef<T> = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  private getOverlayConfig(config: IOverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
