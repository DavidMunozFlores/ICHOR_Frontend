import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TopMenu } from "./top-menu/top-menu";
import { HeaderComponent } from "../../../components/shared/Header/HeaderComponent";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-organ-petition-management',
  imports: [TopMenu, HeaderComponent, RouterOutlet],
  templateUrl: './OrganPetitionManagement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganPetitionManagement {}
