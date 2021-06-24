export const maskValue = (value: number) => {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const maskDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
}