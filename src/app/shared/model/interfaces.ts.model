export interface IVacanca {
    id?: string;
    nom: string;
    preu: number;
    descripcio: string;
    actiu: boolean;
    user?: string;
}

export interface IPushNotification {
    actionId: string;
    notification: {
        id: string;
        data: {
            google: {
                delivered_priority: string;
                original_priority: string;
            },
            descripcio: string;
            id: string;
            nom: string;
            from: string;
            preu: string;
            actiu: string;
            collapse_key: string;
        }
    }
}

export interface IUser {
  id?: string;
  email: string;
  pushToken: string;
  avatarImg?: string;
}
