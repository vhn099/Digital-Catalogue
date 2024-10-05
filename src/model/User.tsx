export class User {
    email: string | null;
    phoneNumber: string | null;
    displayName: string | null;
    login: boolean

    constructor(email: string, phoneNumber: string, firstName: string, lastName: string) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.displayName = `${firstName} ${lastName}`;
        this.login = false;
    }
}