import { Check } from "./LoginOrRegisterModel";


export interface titleState extends Check {
    title: string
}

export interface contentState extends Check {
    content: string
}
export interface imageState extends Check {
    image: string | File | null
}

