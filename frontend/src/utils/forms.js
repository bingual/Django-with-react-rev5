// fieldsErrorMessages => { username: "m1 m2", password: [] } 위와 같은형태 에러출력
export function parseErrorMessages(fieldsErrorMessages) {
    // entries : key, value를 한쌍의 배열로 반환해줌
    // reduce : 첫번째 인자로 결과를 누적할 변수, 두번째로 누적할 시킬 값을 변수를 받음
    return Object.entries(fieldsErrorMessages).reduce(
        (acc, [fieldName, errors]) => {
            // errors : ["m1", "m2"].join(" ") => "m1 "m2" 배열을 문자열로 변환
            if (typeof fieldsErrorMessages === 'string') {
                acc[fieldName] = {
                    validateStatus: 'error',
                    help: errors,
                };
            } else {
                acc[fieldName] = {
                    validateStatus: 'error',
                    help: errors.join(),
                };
            }
            return acc;
        },
        {}, // 빈 오브젝트를 만들고 안에 결과를 누적시키겠다.,
    );
}
