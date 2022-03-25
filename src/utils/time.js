function getHours(ms) {
    const hours = ms / (60 * 60 * 1000)
    if (hours < 1) {
        const minutes = Math.floor(ms / 60 / 1000)
        return minutes ? `${minutes}分钟前` : `${Math.ceil(ms/60/1000)}秒前`
    } else {
        const flooredHours = Math.floor(hours)
        return `${flooredHours}小时前`
    }
}

export default function formatTime(ms) {
    let date = new Date(ms)
    const today = new Date()
    const curTime = today.getTime()
    const gapTime = curTime - ms
    if (gapTime < 7 * 24 * 60 * 60 * 1000) {
        const gapDay = Math.ceil(gapTime / (24 * 60 * 60 * 1000))
        if (gapDay == 1) {
            return getHours(gapTime)
        } else if (gapDay == 2) {
            return '昨天'
        } else {
            return `${gapDay}天前`
        }
    }
    const year = date.getFullYear()
    const rawMonth = date.getMonth() + 1;
    const dDate = date.getDate() > 9 ? date.getDate() : '0' + String(date.getDate())
    const month = rawMonth > 9 ? rawMonth : '0' + String(rawMonth)
    return `${year}-${month}-${dDate}`
}