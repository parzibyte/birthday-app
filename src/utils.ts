const formater = new Intl.DateTimeFormat("es-MX", { dateStyle: "full" });

export const getPersonHtml = (person: Person, ahora: Date): string => {
	return `<h1 class="text-2xl font-bold">${person.name}<small class="text-zinc-700"> ${getReadableBirthDate(person.birthDate)}</small></h1>
                <p class="my-2"><strong class="font-bold bg-green-500 text-white rounded-md p-1 mr-1 ">Edad</strong>${getReadableAge(person.birthDate)}</p>
                <p class="my-2"><strong class="font-bold bg-red-500 text-white rounded-md p-1 mr-1 ">Precisa</strong>${getActualAge(person.birthDate)}</p>
                <p class="my-2"><strong class="font-bold bg-sky-500 text-white rounded-md p-1 mr-1 ">Siguiente</strong>${getReadableNextBirthday(person.birthDate)} (en ${getReadableTimeDifference(obtenerProximoCumpleaños(person.birthDate).getTime() - ahora.getTime())})</p>`;

}
export const getReadableTimeDifference = (diferenciaEnMilisegundos: number): string => {
	const diasQueTieneUnAño = 365.25;
	const diasQueTieneUnMes = 30.437;
	const unSegundoEnMilisegundos = 1000;
	const unMinutoEnMilisegundos = unSegundoEnMilisegundos * 60;
	const unaHoraEnMilisegundos = unMinutoEnMilisegundos * 60;
	const unDiaEnMilisegundos = unaHoraEnMilisegundos * 24;
	const unMesEnMilisegundos = unDiaEnMilisegundos * diasQueTieneUnMes;
	const unAñoEnMilisegundos = unDiaEnMilisegundos * diasQueTieneUnAño;
	const años = Math.floor(diferenciaEnMilisegundos / unAñoEnMilisegundos);
	diferenciaEnMilisegundos -= años * unAñoEnMilisegundos;
	const meses = Math.floor(diferenciaEnMilisegundos / unMesEnMilisegundos);
	diferenciaEnMilisegundos -= meses * unMesEnMilisegundos;
	const dias = Math.floor(diferenciaEnMilisegundos / unDiaEnMilisegundos);
	diferenciaEnMilisegundos -= dias * unDiaEnMilisegundos;
	const horas = Math.floor(diferenciaEnMilisegundos / unaHoraEnMilisegundos);
	diferenciaEnMilisegundos -= horas * unaHoraEnMilisegundos;
	const minutos = Math.floor(diferenciaEnMilisegundos / unMinutoEnMilisegundos);
	diferenciaEnMilisegundos -= minutos * unMinutoEnMilisegundos;
	const segundos = Math.floor(diferenciaEnMilisegundos / unSegundoEnMilisegundos);
	diferenciaEnMilisegundos -= segundos * unSegundoEnMilisegundos;
	let resultado = "";
	if (años > 0) {
		resultado += `${años} años, `;
	}
	if (meses > 0) {
		resultado += `${meses} meses, `;
	}
	if (dias > 0) {
		resultado += `${dias} días, `;
	}
	if (horas > 0) {
		resultado += `${horas} horas, `;
	}
	if (minutos > 0) {
		resultado += `${minutos} minutos, `;
	}
	if (segundos > 0) {
		resultado += `${segundos} segundos`;
	}
	return resultado;
}

export const getActualAge = (birthDateAsString: string) => {
	const now = new Date();
	const birthDate = new Date(birthDateAsString);
	let diferenciaEnMilisegundos = now.getTime() - birthDate.getTime();
	return getReadableTimeDifference(diferenciaEnMilisegundos);
}

export const obtenerCumpleañosDeEsteAño = (birthDate: string): Date => {
	const ahora = new Date();
	const cumpleañosDeEsteAño = new Date(birthDate);
	cumpleañosDeEsteAño.setFullYear(ahora.getFullYear());
	return cumpleañosDeEsteAño;
}

export const obtenerProximoCumpleaños = (birthdate: string) => {
	const cumpleañosDeEsteAño = obtenerCumpleañosDeEsteAño(birthdate);
	const ahora = new Date();
	if (ahora.getTime() > cumpleañosDeEsteAño.getTime()) {
		cumpleañosDeEsteAño.setFullYear(cumpleañosDeEsteAño.getFullYear() + 1);
	}
	return cumpleañosDeEsteAño;
}

export const cantidadDeDiasEnMesAnterior = (): number => {
	const ahora = new Date();
	ahora.setMonth(ahora.getMonth() - 1, 0);
	return ahora.getDate();
}


export const getReadableBirthDate = (birthDate: string): string => {
	return formater.format(new Date(birthDate));
}

export const getReadableAge = (birthDate: string): string => {
	let nacimiento = new Date(birthDate);
	let resultado = "";
	const ahora = new Date();
	const cumpleañosYaHaPasado: boolean = ahora.getTime() > obtenerCumpleañosDeEsteAño(birthDate).getTime();
	let años = ahora.getFullYear() - nacimiento.getFullYear() + (cumpleañosYaHaPasado ? 0 : -1);
	let meses: number, dias: number;
	const diaEnEsteMes = new Date();
	diaEnEsteMes.setDate(nacimiento.getDate());
	if (ahora.getDate() < diaEnEsteMes.getDate()) {
		dias = ahora.getDate() + (cantidadDeDiasEnMesAnterior() - nacimiento.getDate()) + 1;
	} else {
		dias = ahora.getDate() - nacimiento.getDate();
	}
	if (cumpleañosYaHaPasado) {
		meses = ahora.getMonth() - nacimiento.getMonth() - 1;
		if (meses < 0) {
			meses = 0;
		}
	} else {
		meses = (11 - nacimiento.getMonth()) + ahora.getMonth();
	}
	if (años > 0) {
		resultado += `${años} años`;
	}
	if (meses > 0) {
		resultado += `, ${meses} meses`;
	}
	if (dias > 0) {
		resultado += `, ${dias} días`;
	}

	return resultado;
};

export const getReadableNextBirthday = (birthDate: string): string => {
	return formater.format(obtenerProximoCumpleaños(birthDate))
}