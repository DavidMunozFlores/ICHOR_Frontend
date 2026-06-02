import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../../components/shared/Header/HeaderComponent";
import { RouterOutlet } from '@angular/router';
import { TopMenu } from './components/top-menu/top-menu';

@Component({
  selector: 'app-organ-petition-management',
  imports: [TopMenu, HeaderComponent, RouterOutlet],
  templateUrl: './OrganPetitionManagement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganPetitionManagement {}
