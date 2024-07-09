import { Injectable } from "@angular/core";
import type { Animation } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';


/*
export interface AnimationOptions {
    mode: 'md' | 'ios';
    animated: boolean;
    direction: 'root' | 'forward' | 'back';
    enteringEl: HTMLElement;
    leavingEl: HTMLElement;
    baseEl: HTMLElement;
    progressAnimation: boolean;
    showGoBack: boolean;
    animationBuilder: (_, opts) => {}
    progressionCallback?: () => {};
    duration?: number;
}
*/
@Injectable({
    providedIn: 'root'
})
export class MyCustomAnimation {
    constructor(
        private animationCtrl: AnimationController
    ) {
    }

    customAnimation = (_: HTMLElement, opts: any): Animation => {
        // create root transition
        const rootTransition = this.animationCtrl
            .create()
            .duration(opts.duration || 1200)
            .easing('cubic-bezier(0.7,0,0.3,1.275)');

        //.afterStyles({'transform-style': 'preserve-3d', 'box-shadow': 'rgba(255, 0, 50, 0.4) 0px 4px 16px 6px'})
        //transform-style: preserve-3d
        //cubic-bezier(0.175, 0.885, 0.32, 1.275)
        //cubic-bezier(0.7,0,0.3,1)
        //duration 0.8s
        const enterTransition = this.animationCtrl.create().addElement(opts.enteringEl);
        const exitTransition = this.animationCtrl.create().addElement(opts.leavingEl);

        enterTransition.fromTo('opacity', '0', '1');
        exitTransition.fromTo('opacity', '1', '0');

        if (opts.direction === 'forward') {
            enterTransition.fromTo('transform', 'translateX(-1.5%)', 'translateX(0%)');
            exitTransition.fromTo('transform', 'translateX(0%)', 'translateX(1.5%)');
        } else {
            enterTransition.fromTo('transform', 'translateX(1.5%)', 'translateX(0%)');
            exitTransition.fromTo('transform', 'translateX(0%)', 'translateX(-1.5%)');
        }

        rootTransition.addAnimation([enterTransition, exitTransition]);
        return rootTransition;
    }
}