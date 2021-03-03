export function save(state) {
    window.localStorage.setItem('studyBuddyData', JSON.stringify(state));
}
  
export function load() {
    return window.localStorage.getItem('studyBuddyData');
}
  
export function rando(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// HERE: randoID fxn that creates a random ID, quite helpful for keys and such
export function randoID() {
    let dateseed = new Date();
    const randoResult = dateseed.getFullYear() + '' + numToAlpha(dateseed.getMonth()) + numToAlpha(dateseed.getDate()) + numToAlpha(dateseed.getHours()) + '' + dateseed.getMinutes() + '' + dateseed.getSeconds() + '' + rando(0,9) + '' + rando(0,9) + '' + rando(0,9) + '' + rando(0,9) + '' + rando(0,9) + '' + rando(0,9) + '';
    console.log(`Generated a random ID: ${randoResult}`);
    return randoResult;
}

function numToAlpha(num) {
    return String.fromCharCode(+num + 64);
}