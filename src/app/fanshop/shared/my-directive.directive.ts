import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';


@Directive({
  selector: '[appMyDirective]'
})
export class MyDirectiveDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }
  
  ngOnInit() {
    this.elementRef.nativeElement.style.display = 'none';
  }

}
