const formatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "full" });
export const debounce = (callback: Function, wait: number) => {
	let timerId: number;
	return (...args: any[]) => {
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			callback(...args);
		}, wait);
	};
};

export const getPersonHtml = (person: Person): string => {
	return `<h1 class="text-2xl font-bold">${person.name}<small class="text-zinc-700"> ${getReadableBirthDate(person.birthDate)}</small></h1>
<p class="my-2"><strong class="font-bold bg-green-500 text-white rounded-md p-1 mr-1 ">Edad</strong>
<span class="person-age"></span></p>
<p class="my-2"><strong class="font-bold bg-red-500 text-white rounded-md p-1 mr-1 ">Precisa</strong>
<span class="person-actual-age"></span>
</p>
<p class="my-2"><strong class="font-bold bg-sky-500 text-white rounded-md p-1 mr-1 ">Siguiente</strong>
<span class="person-next-birthday"></span>
</p>`;

}
export const getReadableTimeDifference = (differenceInMilliseconds: number): string => {
	const daysInAYear = 365.25;
	const daysInAMonth = 30.437;
	const millisecondsInASecond = 1000;
	const millisecondsInAMinute = millisecondsInASecond * 60;
	const millisecondsInAHour = millisecondsInAMinute * 60;
	const millisecondsInADay = millisecondsInAHour * 24;
	const millisecondsInAMonth = millisecondsInADay * daysInAMonth;
	const millisecondsInAYear = millisecondsInADay * daysInAYear;
	const years = Math.floor(differenceInMilliseconds / millisecondsInAYear);
	differenceInMilliseconds -= years * millisecondsInAYear;
	const months = Math.floor(differenceInMilliseconds / millisecondsInAMonth);
	differenceInMilliseconds -= months * millisecondsInAMonth;
	const days = Math.floor(differenceInMilliseconds / millisecondsInADay);
	differenceInMilliseconds -= days * millisecondsInADay;
	const hours = Math.floor(differenceInMilliseconds / millisecondsInAHour);
	differenceInMilliseconds -= hours * millisecondsInAHour;
	const minutes = Math.floor(differenceInMilliseconds / millisecondsInAMinute);
	differenceInMilliseconds -= minutes * millisecondsInAMinute;
	const seconds = Math.floor(differenceInMilliseconds / millisecondsInASecond);
	differenceInMilliseconds -= seconds * millisecondsInASecond;
	let result = "";
	if (years > 0) {
		result += `${years} años, `;
	}
	if (months > 0) {
		result += `${months} meses, `;
	}
	if (days > 0) {
		result += `${days} días, `;
	}
	if (hours > 0) {
		result += `${hours} horas, `;
	}
	if (minutes > 0) {
		result += `${minutes} minutos, `;
	}
	if (seconds > 0) {
		result += `${seconds} segundos`;
	}
	return result;
}

export const getActualAge = (birthDateAsString: string) => {
	const now = new Date();
	const birthDate = new Date(birthDateAsString);
	let differenceInMilliseconds = now.getTime() - birthDate.getTime();
	return getReadableTimeDifference(differenceInMilliseconds);
}


export const getNextBirthday = (birthdate: string, currentDate: Date) => {
	const thisYearsBirthday = getThisYearsBirthday(birthdate, currentDate);
	const now = new Date();
	if (now.getTime() > thisYearsBirthday.getTime()) {
		thisYearsBirthday.setFullYear(thisYearsBirthday.getFullYear() + 1);
	}
	return thisYearsBirthday;
}

export const daysInPreviousMonth = (): number => {
	const now = new Date();
	now.setMonth(now.getMonth() - 1, 0);
	return now.getDate();
}


export const getReadableBirthDate = (birthDate: string): string => {
	return formatter.format(new Date(birthDate));
}


export const getYears = (birthDate: Date, currentDate: Date, thisYearsBirthday: Date) => {
	let years = currentDate.getFullYear() - birthDate.getFullYear();
	if (currentDate.getTime() < thisYearsBirthday.getTime()) {
		years--;
	}
	return years;
}

export const getMonths = (currentDate: Date, thisYearsBirthday: Date) => {
	let months = 0;
	if (currentDate.getTime() < thisYearsBirthday.getTime()) {
		months = currentDate.getMonth() + 12 - thisYearsBirthday.getMonth();
	} else {
		months = currentDate.getMonth() - thisYearsBirthday.getMonth();
	}
	if (currentDate.getDate() < thisYearsBirthday.getDate()) {
		months--;
	}
	return months;
}
export const dayCountInPreviousMonth = (fecha: Date) => {
	const clon = new Date(fecha.getTime());
	clon.setMonth(clon.getMonth(), 0);
	return clon.getDate();
}

export const dayCounInCurrentMonth = (fecha: Date) => {
	const clon = new Date(fecha.getTime());
	clon.setMonth(clon.getMonth() + 1, 0);
	return clon.getDate();
}
export const getDays = (currentDate: Date, thisYearsBirthday: Date) => {
	if (currentDate.getTime() < thisYearsBirthday.getTime()) {
		const daysInPreviousMonth = dayCountInPreviousMonth(thisYearsBirthday);
		const birthDate = thisYearsBirthday.getDate();
		const thisMonthDate = currentDate.getDate();
		let daysElapsedInPreviousMonth = daysInPreviousMonth - birthDate;
		if (daysElapsedInPreviousMonth < 0) {
			daysElapsedInPreviousMonth = 0;
		}
		return daysElapsedInPreviousMonth + thisMonthDate;
	} else {
		if (thisYearsBirthday.getDate() <= currentDate.getDate()) {
			return currentDate.getDate() - thisYearsBirthday.getDate();
		} else {
			let daysElapsedInPreviousMonth = dayCountInPreviousMonth(currentDate) - thisYearsBirthday.getDate();
			if (daysElapsedInPreviousMonth < 0) {
				daysElapsedInPreviousMonth = 0;
			}
			return daysElapsedInPreviousMonth + currentDate.getDate();
		}
	}
}

export const getThisYearsBirthday = (birthDateAsString: string, currentDate: Date) => {
	const thisYearsBirthday = new Date(birthDateAsString);
	thisYearsBirthday.setFullYear(currentDate.getFullYear());
	return thisYearsBirthday;
}

export const addLetterIfNeccesary = (str: string, count: number, sufix: string = "s") => {
	if (count === 1) {
		return str;
	}
	return str + sufix;
}

export const getReadableAge = (birthDateAsString: string, currentDate: Date): string => {
	let birthDate = new Date(birthDateAsString);
	let result = "";
	const thisYearsBirthday = getThisYearsBirthday(birthDateAsString, currentDate);
	let years = getYears(birthDate, currentDate, thisYearsBirthday)
	let months = getMonths(currentDate, thisYearsBirthday);
	let days = getDays(currentDate, thisYearsBirthday);
	if (years > 0) {
		result += `${years} ${addLetterIfNeccesary("año", years)}`;
	}
	if (months > 0) {
		if (years > 0) {
			result += ", "
		}
		result += `${months} ${addLetterIfNeccesary("mes", months, "es")}`;
	}
	if (days > 0) {
		if (months > 0 || years > 0) {
			result += ", "
		}
		result += `${days} ${addLetterIfNeccesary("día", days)}`;
	}

	return result;
};

export const getReadableNextBirthday = (birthDate: string, currentDate: Date): string => {
	return formatter.format(getNextBirthday(birthDate, currentDate))
}