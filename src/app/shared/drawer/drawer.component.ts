import {Component} from "@angular/core";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { getString, setString } from "app-settings";


@Component({ 
    selector: 'drawer-content', 
    templateUrl: './drawer.component.html'
 })
export class DrawerComponent {
    constructor(private fonticon: TNSFontIconService) { }

}