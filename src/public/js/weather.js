function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const API_KEY = "fc6eb4cf4aea0b0a9acba37f030f6bb4";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(url).then(response => response.json()).then((data)=> {
        const weather = document.querySelector("#weather span:last-child");
        const city = document.querySelector("#weather span:first-child");
        city.innerText = data.name.toString();
        weather.innerText =  data.weather[0].main.toString();
        const tempMax = document.querySelector("#temperature span:first-child");
        const tempMin = document.querySelector("#temperature span:last-child");
        tempMax.innerText = `최고 ${Math.floor((data.main.temp_max)-273.15)} ℃`;
        tempMin.innerText = `최저 ${Math.floor((data.main.temp_min)-273.15)} ℃`;
        });
    console.log("you live in", lat, lon);
    console.log(url);
}
function onGeoError() { alert("위치를 확인 할 수 없습니다.");}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
