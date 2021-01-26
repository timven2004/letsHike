export class User {
    id:number
    user_name: string
    email:string
    password:string
    gender:string
    level:number
    experience:number
    introduction?:string
    rating:number
    user_icon?:string
    comments:{}[];
}

export interface Event{
    id: number,
    event_name: string,
    meeting_point: string,
    date: Date,
    time: string,
    max_number_of_member: number,
    joining_number_of_member?: number,
    hiking_trail_id: number,
    detail: string
    is_active?: boolean
}