import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLayoutComponent } from './layout/page-layout/page-layout.component';

@Component({
  selector: 'app-root',
  imports: [ PageLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'monitor-estudos-web';
}
