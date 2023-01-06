import { useState } from 'react';
import React from 'react';

// 스트로지에 저장된 정보를 가져오는 함수
export function getStorageItem(key, initialValue) {
    try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // item이 있다면 item의 value값을 파싱함, 있다면 기본값 설정
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        // 에러가 발생시 기본값 설정
        console.log(error);
        return initialValue;
    }
}

// 스트로지에 정보를 저장하는 함수
export function setStorageItem(key, value) {
    try {
        if (typeof window !== 'undefined') {
            // 가져온 스트로지 정보에서 key와 value로 직렬화 수행
        }
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
}

// Hook
export default function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        return getStorageItem(key, initialValue); // 로컬스토리지 얻어옴
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        const valueToStore =
            value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore); // 상태값 반영
        setStorageItem(key, valueToStore); // 로컬스토리지 반영
    };
    return [storedValue, setValue];
}
