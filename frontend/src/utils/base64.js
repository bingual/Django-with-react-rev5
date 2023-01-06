export function getBase64FromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // 파일읽기
        reader.onload = () => resolve(reader.result); // 로딩됐을시 resolve 호출
        reader.onerror = (error) => reject(error); // 에러났을시 reject 호출
    });
}
