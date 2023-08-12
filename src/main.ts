const worker = new Worker(new URL("./db.ts", import.meta.url), { type: "module" });
worker.postMessage(["init"]);
const $container = document.querySelector("#container") as HTMLDivElement;
const formater = new Intl.DateTimeFormat("es-MX", { dateStyle: "full" });

const obtenerCumpleañosDeEsteAño = (birthDate: string): Date => {
    const ahora = new Date();
    const cumpleañosDeEsteAño = new Date(birthDate);
    cumpleañosDeEsteAño.setFullYear(ahora.getFullYear());
    return cumpleañosDeEsteAño;
}

const obtenerProximoCumpleaños = (birthdate: string) => {
    const cumpleañosDeEsteAño = obtenerCumpleañosDeEsteAño(birthdate);
    const ahora = new Date();
    if (ahora.getTime() > cumpleañosDeEsteAño.getTime()) {
        cumpleañosDeEsteAño.setFullYear(cumpleañosDeEsteAño.getFullYear() + 1);
    }
    return cumpleañosDeEsteAño;
}

const cantidadDeDiasEnMesAnterior = (): number => {
    const ahora = new Date();
    ahora.setMonth(ahora.getMonth() - 1, 0);
    return ahora.getDate();
}


const getReadableBirthDate = (birthDate: string): string => {
    return formater.format(new Date(birthDate));
}

const getReadableAge = (birthDate: string): string => {
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

    return `${resultado} siguiente ${formater.format(obtenerProximoCumpleaños(birthDate))}`;
};

const getReadableNextBirthday = (birthDate: string): string => {
    return "En 5 años";
}

worker.onmessage = event => {
    const action = event.data[0];
    const actionArgs = event.data[1];
    switch (action) {
        case "ready":
            worker.postMessage(["get_people"]);
            break;
        case "people_fetched":
            const people = actionArgs;
            for (const person of people) {
                const smallBirthDate = document.createElement("small") as HTMLElement;
                smallBirthDate.textContent = ` (${getReadableBirthDate(person.birthDate)})`;
                const personNameTitle = document.createElement("h1") as HTMLHeadingElement;
                personNameTitle.textContent = person.name;
                personNameTitle.className = "text-2xl font-bold";
                personNameTitle.appendChild(smallBirthDate);
                const div = document.createElement("div") as HTMLDivElement;
                div.className = "bg-lime-100 rounded-md p-1 mb-2";
                const spanAge = document.createElement("span") as HTMLSpanElement;
                spanAge.className = "font-bold bg-indigo-400 text-white rounded-md p-1 mr-1";
                spanAge.textContent = getReadableAge(person.birthDate);
                const smallNextBirthday = document.createElement("small") as HTMLElement;
                smallNextBirthday.textContent = getReadableNextBirthday(person.birthDate);
                const paragraphAgeAndNextBirthday = document.createElement("p") as HTMLParagraphElement;
                paragraphAgeAndNextBirthday.className = "my-2";
                paragraphAgeAndNextBirthday.appendChild(spanAge);
                paragraphAgeAndNextBirthday.appendChild(smallNextBirthday);
                div.appendChild(personNameTitle);
                div.appendChild(paragraphAgeAndNextBirthday);
                $container.append(div);
            }
            console.log({ argumentos: actionArgs });
            break;
    }
}
