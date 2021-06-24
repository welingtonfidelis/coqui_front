import Router from 'next/router';

export const handleUnauthorized = (statusCode: number) => {
    if (statusCode && statusCode === 401) {
        Router.replace('/');

        return 'Token inválido ou expirado. Por favor, faça o login novamente.'
    }
}