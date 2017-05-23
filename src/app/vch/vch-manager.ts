import { ContainerWrapper, FormWrapper } from '../wrappers';

export class VchManager {

  private static containers: Set<ContainerWrapper> = new Set<ContainerWrapper>();
  private static forms: Set<FormWrapper> = new Set<FormWrapper>();

  private static suspended: number = 0;

  public static add(container: ContainerWrapper): void {
    if (this.suspended > 0) {
      this.containers.add(container);
      this.forms.add(container.getForm());
    } else {
      container.resumeVch();
      container.getForm().resumeVch();
    }
  }

  public static suspend(): void {
    this.suspended++;
  }

  public static isSuspended(container: ContainerWrapper): boolean {
    return this.suspended > 0 && this.containers.has(container);
  }

  public static resume(): void {
    if (this.suspended <= 1) {

      // Resume an allen betroffenen VchContainern aufrufen,
      // damit danach auf die korrekt aufgebaute Hierarchie zugegriffen werden kann.
      this.containers.forEach(container => {
        container.getVchContainer().resume();
      });

      // Danach kann der Resume an den UIContainern ausgeführt werden.

      // Für resume() an den UIContainern gilt, dass alle Parents ebenfalls resumed werden müssen.
      // Dabei gilt, dass immer erst die Children und danach die Parents resumed werden müssen.
      // Deshalb wird nun die sortierte Liste (resumeList) aufgebaut, welche alle zu resumenden UIContainer
      // in umgekehrter Reihenfolge (also Wurzel zuerst) enthält. Um gute Performance zu erreichen,
      // werden diese Elemente parallel in einem HashSet (resumeSet) vorrätig gehalten.
      let resumeList: Array<ContainerWrapper> = new Array<ContainerWrapper>();
      let resumeSet: Set<ContainerWrapper> = new Set<ContainerWrapper>();

      // Alle zu resumenden UIContainer durchlaufen und für jeden alle Parents in der subList sammeln,
      // welche bisher noch nicht in der resumeList sind.
      // Sobald ein Parent vorhanden ist, kann abgebrochen werden,
      // denn alle weiteren Parents müssen dann schon drin sein.
      // Dann alle Elemente aus der subList in umgekehrter Reihenfolge an die resumeList anhängen.
      this.containers.forEach(container => {
        let subList: Array<ContainerWrapper> = new Array<ContainerWrapper>();
        let insertElement: ContainerWrapper = container;

        while (insertElement && !resumeSet.has(insertElement)) {
          subList.push(insertElement);
          insertElement = insertElement.getVchContainer().getParent();
        }

        if (!subList.isEmpty()) {
          for (let i = subList.length - 1; i >= 0; i--) {
            insertElement = subList[i];
            resumeList.push(insertElement);
            resumeSet.add(insertElement);
          }
        }
      });

      // Nun kann der resume() in umgekehrter Reihenfolge erfolgen.
      for (let i = resumeList.length - 1; i >= 0; i--) {
        let resumeElement: ContainerWrapper = resumeList[i];
        // Vor dem Resume des Elements muss es aus der Liste der suspended Elemente entfernt werden.
        this.containers.delete(resumeElement);
        resumeElement.resumeVch();
      }

      // Und zuletzt werden alle Forms resumed.
      this.forms.forEach(form => {
        form.resumeVch();
      });

      this.forms = new Set<FormWrapper>();

      this.suspended = 0;
    } else {
      this.suspended--;
    }
  }
}
