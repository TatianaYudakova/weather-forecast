var json;
var weatherForecastArray = [];
var currentweatherForecastArray = [];
var change = 0;
var rightButton = document.getElementById('right-button');
var leftButton = document.getElementById('left-button');

class Property {
	constructor(description, styleClass) {
		this.description = description;
		this.styleClass = styleClass;
	}
}

window.onload = function() {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?id=499099&units=metric&lang=ru&appid=22d697eb938c6d57b2a4ec8f405bcf84', false);
	
	xhr.send();

	if (xhr.status != 200) {
	  alert( xhr.status + ': ' + xhr.statusText ); 
	} else {
	 fillWeatherForecastArray(xhr.responseText);
	 insertWeather(currentweatherForecastArray);
	 checkedDisabledButtons();
	}
};

function fillWeatherForecastArray(data) {
	json = JSON.parse(data);
	let fixCount = findNewDate(json);
	let currentCount = 0;
	weatherForecastArray.push(getWeatherForecast(currentCount));

	let i = 0; 
	currentCount = fixCount + i*8 + 4;

	while (currentCount < json.list.length) {
		weatherForecastArray.push(getWeatherForecast(currentCount));
		i++;
		currentCount = fixCount + i*8 + 4;
	}

	for (i = 0; i < 4; i++) {
		currentweatherForecastArray.push(weatherForecastArray[i]);
	}
}

function getWeatherForecast(changeCount) {
	let weatherForecast = {};
	let dateDate = new Date(json.list[changeCount].dt * 1000);

	if (changeCount == 0) {
		weatherForecast.day = new Property('Сегодня', '');
		weatherForecast.dayTemp = new Property(Math.round(json.list[changeCount].main.temp) + ' °C', 'temperature-today');
	} else {
		weatherForecast.day = new Property(upperFirstCharacter(dateDate.toLocaleString("ru", {weekday: 'long'})), '');
		weatherForecast.dayTemp = new Property('Днем ' + Math.round(json.list[changeCount].main.temp) + ' °C', 'temperature-day');
		weatherForecast.nightTemp = new Property('Ночью ' + Math.round(json.list[changeCount - 4].main.temp) + ' °C', 'temperature-night');
	}
	weatherForecast.date = new Property(dateDate.getUTCDate() + ' ' + replaceLastCharacter(dateDate), 'date-of-day');
	weatherForecast.iconCode = new Property('http://openweathermap.org/img/w/' + json.list[changeCount].weather[0].icon + '.png', 'icon');
	weatherForecast.weather = new Property(json.list[changeCount].weather[0].description, 'weather');
	weatherForecast.wind = new Property('Ветер ' + json.list[changeCount].wind.speed + ' м/с', 'wind');
	return weatherForecast;
}

function insertWeather(data) {
	let table = document.getElementById('table');
	let tr = document.createElement('tr');
	tr.id = 'tr';
	table.appendChild(tr);
	console.log(data);
	for (let i = 0; i < 4; i++) {
		let day = document.createElement('li');
		let date = document.createElement('li');
		let icon = document.createElement('li');
		let iconCode = document.createElement('img');
		let dayTemp = document.createElement('li');
		let nightTemp = document.createElement('li');
		let weather = document.createElement('li');
		let wind = document.createElement('li');

		day.innerHTML = data[i].day.description;
		dayTemp.innerHTML = data[i].dayTemp.description;
		dayTemp.className = data[i].dayTemp.styleClass;

		if (data[i].day.description !== 'Сегодня') {
			nightTemp.innerHTML = data[i].nightTemp.description;
			nightTemp.className = data[i].nightTemp.styleClass;
		}

		date.innerHTML = data[i].date.description;
		date.className = data[i].date.styleClass;

		iconCode.src = data[i].iconCode.description;
		iconCode.className = data[i].iconCode.styleClass;
		icon.appendChild(iconCode);

		weather.innerHTML = data[i].weather.description;
		weather.className = data[i].weather.styleClass;

		wind.innerHTML = data[i].wind.description;
		wind.className = data[i].wind.styleClass;

		if (data[i].day.description === 'Сегодня') {
			addListToday(day, date, icon, dayTemp, weather, wind, tr);
		} else {
			addList(day, date, icon, dayTemp, nightTemp, weather, wind, tr);
		}
	}
}

function addList(day, date, icon, dayTemp, nightTemp, weather, wind, tr) {
	let td = document.createElement('td');

	let div = document.createElement('div');
	div.className = 'bloсk-of-day';

	let ul = document.createElement('ul');

	ul.appendChild(day);
	ul.appendChild(date);
	ul.appendChild(icon);
	ul.appendChild(dayTemp);
	ul.appendChild(nightTemp);
	ul.appendChild(weather);
	ul.appendChild(wind);

	div.appendChild(ul);
	td.appendChild(div);
	tr.appendChild(td);
}

function addListToday(day, date, icon, temp, weather, wind, tr) {
	let td = document.createElement('td');

	let div = document.createElement('div');
	div.className = 'bloсk-of-day';

	let ul = document.createElement('ul');

	ul.appendChild(day);
	ul.appendChild(date);
	ul.appendChild(icon);
	ul.appendChild(temp);
	ul.appendChild(weather);
	ul.appendChild(wind);

	div.appendChild(ul);
	td.appendChild(div);
	tr.appendChild(td);
}

function findNewDate(json) {
	let i = 1;
	let date1 = new Date(json.list[0].dt * 1000);
	let date2;
	while(true) {
		date2 = new Date(json.list[i].dt * 1000);
		if (date1.getUTCDate() < date2.getUTCDate()) {
			if (date2.getUTCDate() != 1) {
				break;
			}
		}
		i++;
	}
	return i;
}

function upperFirstCharacter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function replaceLastCharacter(date) {
	let numMonth = date.getUTCMonth();
	let month = date.toLocaleString("ru", {month: 'long'});
	if (numMonth !== 2 && numMonth !== 7) {
		month = month.substring(0, month.length - 1) + 'я';
	} else {
		month += 'a';
	}

	return month;
}

function changeButtons(buttonId) {
	
	if (buttonId == 'left-button') {
		change--;
		updateWeather('left');
	} else if (buttonId == 'right-button') {
		change++;
		updateWeather('right');
	}

	checkedDisabledButtons();
}

function checkedDisabledButtons() {
	if (change == 0) {
		leftButton.disabled = true;
		leftButton.classList.add('disabled-button');
		leftButton.classList.remove('active-button');
	} else {
		leftButton.disabled = false;
		leftButton.classList.add('active-button');
		leftButton.classList.remove('disabled-button');
	}

	if (change == weatherForecastArray.length - 4) {
		rightButton.disabled = true;
		rightButton.classList.add('disabled-button');
		rightButton.classList.remove('active-button');
	} else {
		rightButton.disabled = false;
		rightButton.classList.add('active-button');
		rightButton.classList.remove('disabled-button');
	}
}

function updateWeather(direction) {
	if (direction == 'right') {
		currentweatherForecastArray.shift();
		currentweatherForecastArray.push(weatherForecastArray[change+3]);
		document.getElementById('tr').remove();
		insertWeather(currentweatherForecastArray);
	} else {
		currentweatherForecastArray.pop();
		currentweatherForecastArray.unshift(weatherForecastArray[change]);
		document.getElementById('tr').remove();
		insertWeather(currentweatherForecastArray);
	}
}