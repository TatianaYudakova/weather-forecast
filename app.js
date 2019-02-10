var data;

window.onload = function() {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?id=499099&units=metric&lang=ru&appid=22d697eb938c6d57b2a4ec8f405bcf84', false);
	
	xhr.send();

	if (xhr.status != 200) {
	  alert( xhr.status + ': ' + xhr.statusText ); 
	} else {
	 insertData(xhr.responseText);
	}
};

function insertData(data) {
	var json = JSON.parse(data);

	var fixCount = findNewDate(json);
	var changeCount;

	var divs = document.getElementsByClassName('blok-of-day');

	for (var i = 0; i < divs.length; i++) {
		var day = document.createElement('li');
		var date = document.createElement('li');
		var icon = document.createElement('li');
		var iconCode = document.createElement('img');
		var dayTemp = document.createElement('li');
		var nightTemp = document.createElement('li');
		var weather = document.createElement('li');
		var wind = document.createElement('li');

		date.className = 'date-of-day';
		iconCode.className = 'icon';
		nightTemp.className = 'temperature-night';
		weather.className = 'weather';
		wind.className = 'wind';

		if (i == 0) {
			changeCount = 0;

			day.innerHTML = 'Сегодня';
			dayTemp.innerHTML = Math.round(json.list[0].main.temp) + ' °C';

			dayTemp.className = 'temperature-today';
		} else {
			changeCount = fixCount + (i - 1)*8 + 4;

			dayTemp.innerHTML = 'Днем ' + Math.round(json.list[changeCount].main.temp) + ' °C';
			nightTemp.innerHTML = 'Ночью ' + Math.round(json.list[changeCount - 4].main.temp) + ' °C';

			dayTemp.className = 'temperature-day';
		}

		dateDate = new Date(json.list[changeCount].dt * 1000);
		date.innerHTML = dateDate.getUTCDate() + ' ' + replaceLastCharacter(dateDate);

		iconCode.src = "http://openweathermap.org/img/w/" + json.list[changeCount].weather[0].icon + ".png";
		icon.appendChild(iconCode);

		weather.innerHTML = json.list[changeCount].weather[0].description;
		wind.innerHTML = 'Ветер ' + json.list[changeCount].wind.speed + ' м/с';

		if (i == 0) {
			addListToday(day, date, icon, dayTemp, weather, wind, divs[0]);
		} else {
			day.innerHTML = upperFirstCharacter(dateDate.toLocaleString("ru", {weekday: 'long'}));
			addList(day, date, icon, dayTemp, nightTemp, weather, wind, divs[i]);
		}
	}
}

function addList(day, date, icon, dayTemp, nightTemp, weather, wind, div) {
	var ul = div.getElementsByTagName('ul');

	ul[0].appendChild(day);
	ul[0].appendChild(date);
	ul[0].appendChild(icon);
	ul[0].appendChild(dayTemp);
	ul[0].appendChild(nightTemp);
	ul[0].appendChild(weather);
	ul[0].appendChild(wind);
}

function addListToday(day, date, icon, temp, weather, wind, div) {
	var ul = div.getElementsByTagName('ul');

	ul[0].appendChild(day);
	ul[0].appendChild(date);
	ul[0].appendChild(icon);
	ul[0].appendChild(temp);
	ul[0].appendChild(weather);
	ul[0].appendChild(wind);
}

function findNewDate(json) {
	var i = 1;
	var date1 = new Date(json.list[0].dt * 1000).getUTCDate();
	var date2;
	while(true) {
		date2 = new Date(json.list[i].dt * 1000).getUTCDate();
		if (date1 < date2) {
			break;
		}
		i++;
	}
	return i;
}

function upperFirstCharacter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function replaceLastCharacter(date) {
	var numMonth = date.getMonth();
	var month = date.toLocaleString("ru", {month: 'long'});
	if (numMonth !== 2 || numMonth !== 7) {
		month = month.substring(0, month.length - 1) + 'я';
	} else {
		month += 'a';
	}

	return month;
}