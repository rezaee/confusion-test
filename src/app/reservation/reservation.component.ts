import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core'; 
import { DrawerPage } from '../shared/drawer/drawer.page'; 
import { TextField } from 'tns-core-modules/ui/text-field'; 
import { Switch } from 'tns-core-modules/ui/switch'; 
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import * as enums from "tns-core-modules/ui/enums";
import { View } from "tns-core-modules/ui/core/view";
import { Animation, AnimationDefinition } from "tns-core-modules/ui/animation";
import { Page } from "tns-core-modules/ui/page";
import { CouchbaseService } from '../services/couchbase.service';
import { Reservation } from '../shared/reservation'

@Component({ 
    selector: 'app-reservation', 
    moduleId: module.id, 
    templateUrl: './reservation.component.html' 
}) 
export class ReservationComponent extends DrawerPage implements OnInit {
    
    reservation: FormGroup;
    
    showSubmission: boolean = false;
    formView: View;
    submissionView: View;

    resrvSub: Reservation;

    reservations: Reservation[];

    docId: string = "reservations";

    constructor(private changeDetectorRef: ChangeDetectorRef, 
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService, 
        private vcRef: ViewContainerRef,
        private page:Page,
        private couchbaseService: CouchbaseService) { 
        super(changeDetectorRef);
        this.reservation = this.formBuilder.group({ 
            guests: 3, 
            smoking: false, 
            dateTime: ['', Validators.required] 
        });
    }

    ngOnInit() {
    }

    onSmokingChecked(args) { 
        let smokingSwitch = <Switch>args.object;        
        if (smokingSwitch.checked) { 
            this.reservation.patchValue({ smoking: true }); 
        }        
        else { 
            this.reservation.patchValue({ smoking: false }); 
        }    
    }

    onGuestChange(args) { 
        let textField = <TextField>args.object;
        this.reservation.patchValue({ guests: textField.text});    
    }

    onDateTimeChange(args) { 
        let textField = <TextField>args.object;
        this.reservation.patchValue({ dateTime: textField.text});    
    }

    onSubmit() { 
        console.log(JSON.stringify(this.reservation.value)); 
        this.resrvSub = this.reservation.value;
        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
            console.log('This is the first reservation');
            this.couchbaseService.createDocument({"reservations": [this.resrvSub]}, this.docId);
        }
        else {
            this.reservations = doc.reservations;
            this.reservations.push(this.resrvSub);
            this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});
        }
        this.animateForm();
    }

    animateForm() {
        this.formView = <View>this.page.getViewById<View>("formView");
        this.submissionView = <View>this.page.getViewById<View>("submissionView");
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: this.formView,
            scale: { x: 0, y: 0 },
            translate: { x: 0, y: -200 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);

        let a2: AnimationDefinition = {
            target: this.submissionView,
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a2);

        let animationSet = new Animation(definitions);

        animationSet.play().then(() => {
            this.showSubmission = true;
        })
        .catch((e) => {
            console.log(e.message);
        });
    } 
    
    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }
}
