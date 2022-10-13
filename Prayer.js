
// Display Flags tab
let isclicked = true;
document.getElementById('language').addEventListener('click', () => {

    isclicked = !isclicked
    let flags  = document.getElementById('flags')
    if (!isclicked) {
        flags.style.display = 'block';
    }else {
        flags.style.display = 'none';
    }
})

let cities = [
    {
        city: "Riyadh",
        country: "Saudi Arabia"
    },
    {
        city: "Makkah",
        country: "Saudi Arabia"
    },
    {
        city: "Manila",
        country: "Philippines"
    },
    {
        city: "London",
        country: "United Kingdom"
    }
] 

// Change Prayer Times Depend on City
let changeCity = document.getElementById('change-city');
let citiesTab = document.getElementById('cities-tab')
let theChossenCity = 'Riyadh';
let theChossenCountry = 'Saudi Arabia';

for (let city of cities) {
    citiesTab.innerHTML += `<option class="c-white p-10 pb-5">${city.city}</option>`

    citiesTab.onchange = () => {

        theChossenCity = citiesTab.value
        changeCity.innerHTML = theChossenCity
        document.getElementById('chossenCity').innerHTML = theChossenCity

        theChossenCountry = city.country

        getPrayerTimes(theChossenCity, theChossenCountry)
    }
}

getPrayerTimes(theChossenCity, theChossenCountry)

function getPrayerTimes(city, country) {

    axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`)
    .then((response) => {
        let data = response.data.data
        const prayerTime = data.timings

        let hoursArr = []
        let pTime = document.getElementsByClassName(`time`);
        for (el of pTime) {
            for (thePray in prayerTime) {
                if (el.classList.contains(`${thePray}`)) {
                    let timing = prayerTime[thePray].substr(0, 5)
                    el.innerHTML = timing
    
                    let hoursPray = (timing.substr(0, 2))
                    let MinutesPray = timing.substr(3, 5)
                    
                    hoursArr.push(Number(`${hoursPray}.${MinutesPray}`))
                }
            }
        }

        let todaysDate = data.date.readable
        let HijriDate = data.date.hijri

        // Display Date
        document.getElementById('date-french').innerHTML = todaysDate
        document.getElementById('date-hijri').innerHTML = `${HijriDate.day} ${HijriDate.month.en}, ${HijriDate.year}`

        let activePrayer = document.getElementsByClassName('active')
        for (el of activePrayer) {
            el.classList.remove('active')
        }
        
        upcomingPrayer(hoursArr)
    })
    .catch(error => error)
}


//  upcomingPrayer(currentTime, hoursArr)
function upcomingPrayer(hrsArray) {

    // French Date
    let date = new Date();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    let currentTime = Number(`${date.getHours()}.${minutes}`); 
    let currentPray;

    if (currentTime > hrsArray[0] && currentTime <= hrsArray[2]) {

        document.getElementById('Dhuhr').classList.add('active')
        currentPray = 'Dhuhr';

    } else if (currentTime > hrsArray[2] && currentTime <= hrsArray[3]) {

        document.getElementById('Asr').classList.add('active')
        currentPray = 'Asr';

    } else if (currentTime > hrsArray[3] && currentTime <= hrsArray[4]) {

        document.getElementById('Maghrib').classList.add('active')
        currentPray = 'Maghrib';

    } else if (currentTime > hrsArray[4] && currentTime <= hrsArray[5]) {

        document.getElementById('Isha').classList.add('active')
        currentPray = 'Isha';

    }else {
        document.getElementById('Fajr').classList.add('active')
        currentPray = 'Fajr';
    }
    
    let prayersDiv = document.querySelectorAll('.prayer-times .prayer-box')
    prayersDiv.forEach(div => {
        
        if (div.classList.contains(`${currentPray}`)) {
            
            if ( div.lastElementChild.classList.contains('upcoming') ) {
                div.removeChild(div.lastElementChild)
            }
            div.innerHTML += `<h3 class="upcoming">Upcoming Prayer</h3>`
        }
    })
}