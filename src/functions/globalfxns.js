export function save(state) {
    window.localStorage.setItem('studyBuddyData', JSON.stringify(state));
}
  
export function load() {
    return window.localStorage.getItem('studyBuddyData');
}
  
export function rando(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}