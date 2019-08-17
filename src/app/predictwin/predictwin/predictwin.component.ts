import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-predictwin',
  templateUrl: './predictwin.component.html',
  styleUrls: ['./predictwin.component.scss']
})
export class PredictwinComponent implements OnInit {
  predictwin;

  constructor(private router: Router) { }

  ngOnInit() {
    this.predictwin = this.router.isActive('/predict-win', true);
  }

}
