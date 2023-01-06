import React, { createContext, useContext } from 'react';
import { getStorageItem, setStorageItem } from 'utils/useLocalStorage';
import useReducerWithSideEffects, {
    UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';

// Context api 생성
const AppContext = createContext();

// dispatch로 전달받은 action의 type과 payload로 로직수행
// 현재는 getStorageItem로 얻는 bearerToken 오브젝트가 prevState에 해당함
const reducer = (prevState, action) => {
    const { type } = action;
    if (type === SET_TOKEN) {
        const { payload } = action;
        const { access: bearerToken, username } = payload;
        const newState = {
            ...prevState,
            bearerToken,
            username,
            isAuthenticated: true,
        };
        // Update랑 다른점은 newState와 dispatch 콜백함수를 수신한다는점의 차이
        return UpdateWithSideEffect(newState, (state, dispatch) => {
            setStorageItem('bearerToken', bearerToken); // 토큰변경
            setStorageItem('username', username); // 유저이름 변경
        });
    } else if (type === DELETE_TOKEN) {
        const newState = {
            ...prevState,
            bearerToken: '',
            username: '',
            isAuthenticated: false,
        };
        return UpdateWithSideEffect(newState, (state, dispatch) => {
            setStorageItem('bearerToken', ''); // 토큰삭제
            setStorageItem('username', ''); // 유저이름 삭제
        });
    }
    return prevState;
};

export const AppProvider = ({ children }) => {
    const bearerToken = getStorageItem('bearerToken', ''); // 토큰얻어옴
    const username = getStorageItem('username', ''); // 유저이름 얻어옴
    // 사이드 이펙트를 실행하기위해 useReducer를 useReducerWithSideEffects로 대체
    const [store, dispatch] = useReducerWithSideEffects(reducer, {
        bearerToken,
        username,
        isAuthenticated: bearerToken.length > 0,
    });
    return (
        <AppContext.Provider value={{ store, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

// Actions
const SET_TOKEN = 'APP/SET_TOKEN';
const DELETE_TOKEN = 'APP/DELETE_TOKEN';

// Action Creators
export const setToken = (token) => ({ type: SET_TOKEN, payload: token }); // 얻은 토큰값을 dispatch로 통해 전달
export const deleteToken = () => ({ type: DELETE_TOKEN });
