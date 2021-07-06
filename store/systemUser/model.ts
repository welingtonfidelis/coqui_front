export interface SystemUserItemReducerInterface {
    id: string;
    name: string;
    email: string;
    user: string;
    companyName: string;
    birth: Date;
    profileImage: string;
    phone?: string;
    address?: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;

    loadingItemAction: boolean;
}

export interface SystemUserListReducerInterface {
    loadingList: boolean;
    loadingSave: boolean;
    list: SystemUserItemReducerInterface[];
}
