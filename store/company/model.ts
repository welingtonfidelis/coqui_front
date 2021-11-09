export interface CompanyItemReducerInterface {
    id: string;
    name: string;
    email: string;
    cnpj: string;
    logo: string;
    active: boolean;

    loadingItemAction: boolean;
}

export interface CompanyListReducerInterface {
    loadingList: boolean;
    loadingSave: boolean;
    list: CompanyItemReducerInterface[];
}
