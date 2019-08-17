import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';


@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {
  @Input() message: string;
  @Input() deviceType: boolean;
  @Input() tag: string;
  @Output() close = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
    console.log(this.message);
  }
  onClose() {
  this.close.emit();
  }
}
