export const splitTimestamp = (timestamp, utcOffect) => {
    const date = new Date(timestamp + utcOffect * 3600000);

    // 格式化日期為 yyyy-mm-dd
    const formattedDate = date.toISOString().split("T")[0];

    // 格式化時間為 hh:mm
    const formattedTime = date.toTimeString().split(" ")[0].substring(0, 5);

    return {
        date: formattedDate,
        time: formattedTime,
    };
};

export const createFakeDateTime = (setTime) => {
    const { years, minMonth, maxMonth, days } = setTime;
    // 生成隨機月份和日期
    const fakeMonth = Math.floor(Math.random() * (maxMonth - minMonth + 1)) + minMonth;
    const fakeDay = Math.floor(Math.random() * days) + 1;

    // 創建日期物件
    const fakeDate = new Date(years, fakeMonth - 1, fakeDay);

    // 轉換為 ISO 字符串並格式化為 MySQL datetime 格式
    const formattedDate = fakeDate.toISOString().slice(0, 19).replace("T", " ");

    return formattedDate;
};

export const createFakeTime = (dateString, dayOffset) => {
    // 解析傳入的日期字符串
    const date = new Date(dateString);

    // 加上天數偏移
    date.setDate(date.getDate() + dayOffset);

    // 將結果轉換為 MySQL datetime 格式
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};