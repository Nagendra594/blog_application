export interface Check {
    isValid: boolean;
    touched: boolean;
}

export interface EmailState extends Check {
    email: string;

}
export interface PasswordState extends Check {
    password: string;
}
export interface UserNameState extends Check {
    username: string;
}
export interface ActionState {

    value: string;
}

