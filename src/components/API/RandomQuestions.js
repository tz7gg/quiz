export function RandomQuestions(count, diff) {
    if (diff === 'mixed') {
        diff = ''
    } else {
        diff = `&difficulty=${diff}`
    }
    return fetch(`https://the-trivia-api.com/api/questions?limit=${count}${diff}`)
        .then(r => r.json().then(r => r))
}