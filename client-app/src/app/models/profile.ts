import { User } from "./user";

export class Profile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
    username: string;
    displayName: string;
    image?: string;
    photos?: Photo[];
    followersCount = 0;
    followingCount = 0;
    following = false;
    bio?: string;
}

export interface Photo {
    id: string,
    url: string,
    isMain: boolean
}

export interface UserActivity {
    id: string;
    title: string;
    category: string;
    date: Date;
}