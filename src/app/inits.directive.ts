import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[appInits]'
})
export class InitsDirective {

  constructor( private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
    @Input() set ngxInit(val: any) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef, {ngxInit: val});
    }

}
