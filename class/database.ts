export interface User {
    id: number;
    user_name: string;
    email: string;
    password: string;
    gender: string;
    level: number;
    experience: number;
    introduction?: Text;
    rating: number;
    user_icon?: string;
    is_admin: boolean;
}

export interface Event {
    id: number;
    event_name: string;
    organizer: number;
    meeting_point: string;
    date: Date;
    time: string;
    max_number_of_member: number;
    joining_number_of_member: number;
    hiking_trail_id: number;
    detail: Text;
    is_active: boolean;
}
