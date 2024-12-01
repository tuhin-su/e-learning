export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponce {
    token: string;
    lable: string;
    info: string | null;
    massage: string | null;
}
