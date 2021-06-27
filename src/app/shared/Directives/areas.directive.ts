import {Directive, ElementRef, Renderer2, OnInit, Input} from '@angular/core';
declare const Choices: any;

@Directive({
  selector: '[appAreas]'
})
export class AreasDirective {

  areasContainer = this.renderer.createElement('areasContainer');

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @Input() set showAreas(showAreas: boolean) {
    if(showAreas) {
      this.renderer.appendChild(this.el.nativeElement, this.areasContainer);
      const areas = document.getElementById('areas');
      console.debug("creating new choices element")
      new Choices(areas, {
        delimiter: ',',
        editItems: true,
        maxItemCount: 10,
        removeItemButton: true,
        addItems: true
      });
    } else {
      this.renderer.removeChild(this.el.nativeElement, this.areasContainer);
    }
  }

  ngOnInit() {
    let input = this.renderer.createElement('input');
    this.renderer.addClass(input, 'form-control');
    this.renderer.setProperty(input, 'id', 'areas');
    this.renderer.setProperty(input, 'type', 'text');
    this.renderer.setProperty(input, 'placeholder', 'Enter the different areas of your house here');
    this.renderer.appendChild(this.areasContainer, input);
  }

}
