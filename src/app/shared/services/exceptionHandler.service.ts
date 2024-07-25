/**
 * Revisited from https://medium.com/@keithstric/global-angular-error-handling-8569fe8228f
 * by Keith Strickland
 * Revision in order to match with https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 * by Kent C. Dodds
 * and typescript and angular documentation https://angular.dev/api/core/ErrorHandler
 */

import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { isErrorWithMessage, toErrorWithMessage } from '../util/errors';
import { MessageHubService } from './messageHub.service';
import { IErrorDismissedMessage, IErrorMessage } from '../interfaces/IMessage';
import { AlertController } from '@ionic/angular';
//import { ToastController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

    constructor(
        //private toastController: ToastController,
        private alertController: AlertController,
        private messageService: MessageHubService,
        private zone: NgZone) { }

    async presentAlert(message: IErrorMessage) {
        const alert = await this.alertController.create({
            header: message.name ?? 'Error',
            message: message.content,
            buttons: [
                {
                    text: 'Entendido',
                    role: 'cancel',
                    handler: () => {
                        console.log('Alert error Cancel clicked');
                    }
                }
            ],
        });
        alert.onDidDismiss().then((val) => {
            console.log('Alert error Dismissed');
            const dismissedMessage: IErrorDismissedMessage = { tag: "dismissError", content: undefined }
            this.messageService.sendMessage(dismissedMessage);
        });
        await alert.present();
    }

    // private async presentToast(position: 'top' | 'middle' | 'bottom',
    //                         message: IErrorMessage) {
    //   const toast = await this.toastController.create({
    //     message: (message.name?? 'Error') + ': ' + message.content,
    //     buttons: [
    //         {
    //           text: 'Entendido',
    //           role: 'cancel',
    //           handler: () => {
    //             console.log('Toast error Cancel clicked');
    //           }
    //         }
    //       ],
    //     position: position,
    // });
    // toast.onDidDismiss().then((val) => {  
    //     console.log('Toast error Dismissed');
    //     const dismissedMessage: IErrorDismissedMessage = { tag: "dismissError", content: undefined }
    //     this.messageService.sendMessage(dismissedMessage);
    //   });  
    // await toast.present();
    //}


    /**
     * This function is a global javascript error handler. It will catch all javascript errors
     * produced within the application. The docs at https://angular.dev/api/core/ErrorHandler
     *
     * @param err {any}
     */
    handleError(err: any) {
        // if (!(err instanceof HttpErrorResponse)) {
        //     err = err.rejection; // get the error object
        // }
        try {
            console.log("Global error handler reached.")
            this.zone.run(() => {
                try {
                    console.log(`ErrorService.handleError, ${err['name'] ?? "err"}` + " -> ", err);
                    if (!isErrorWithMessage(err)) err = toErrorWithMessage(err);
                    const errText = err["message"];
                    const message = {
                        tag: "error",
                        name: err["name"] ?? "Error",
                        content: errText
                    } as IErrorMessage
                    this.messageService.sendMessage(message);
                    this.presentAlert(message);
                }
                catch (err) {
                    console.log("Error handler run error: ", toErrorWithMessage(err));
                }
            }
            );
        }
        catch (err) {
            console.log("Error handler error: ", toErrorWithMessage(err));
        }
    }
}