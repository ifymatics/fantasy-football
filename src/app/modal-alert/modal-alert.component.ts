import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {
  @Input() message: string;
  @Input()deviceType: boolean;
  @Input() tag: string;
  @Output() close = new EventEmitter<void>();
  constructor(public deviceService: DeviceDetectorService) { }

  ngOnInit() {
    if(this.deviceService.isMobile())
   this.deviceType =true;
  }
  onClose() {
  this.close.emit();
  }
}
