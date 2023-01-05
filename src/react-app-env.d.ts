/// <reference types="react-scripts" />


declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_HOST: string;
        REACT_APP_REDIRECT_KAKAO: string;
        REACT_APP_REDIRECT_NAVER: string;
        REACT_APP_REDIRECT_GOOGLE: string;
    }
}