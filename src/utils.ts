const formater = new Intl.DateTimeFormat("es-MX", { dateStyle: "full" });
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

export const getThisYearsBirthday = (birthDate: string): Date => {
	const now = new Date();
	const thisYearsBirthday = new Date(birthDate);
	thisYearsBirthday.setFullYear(now.getFullYear());
	return thisYearsBirthday;
}

export const getNextBirthday = (birthdate: string) => {
	const thisYearsBirthday = getThisYearsBirthday(birthdate);
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
	return formater.format(new Date(birthDate));
}

export const getReadableAge = (birthDateAsString: string): string => {
	let birthDate = new Date(birthDateAsString);
	let result = "";
	const now = new Date();
	const birthdayAlreadyHappened: boolean = now.getTime() > getThisYearsBirthday(birthDateAsString).getTime();
	let years = now.getFullYear() - birthDate.getFullYear() + (birthdayAlreadyHappened ? 0 : -1);
	let months: number, days: number;
	const thisMonthDate = new Date();
	thisMonthDate.setDate(birthDate.getDate());
	if (now.getDate() < thisMonthDate.getDate()) {
		days = now.getDate() + (daysInPreviousMonth() - birthDate.getDate()) + 1;
	} else {
		days = now.getDate() - birthDate.getDate();
	}
	if (birthdayAlreadyHappened) {
		months = now.getMonth() - birthDate.getMonth() - 1;
		if (months < 0) {
			months = 0;
		}
	} else {
		months = (11 - birthDate.getMonth()) + now.getMonth();
	}
	if (years > 0) {
		result += `${years} años`;
	}
	if (months > 0) {
		result += `, ${months} meses`;
	}
	if (days > 0) {
		result += `, ${days} días`;
	}

	return result;
};

export const getReadableNextBirthday = (birthDate: string): string => {
	return formater.format(getNextBirthday(birthDate))
}