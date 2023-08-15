const worker = new Worker(new URL("./db.ts", import.meta.url), { type: "module" });
worker.postMessage(["init"]);
const $container = document.querySelector("#container") as HTMLDivElement,
    $registerButton = document.querySelector("#registerButton") as HTMLButtonElement,
    $searchInput = document.querySelector("#searchInput") as HTMLInputElement;

let divElements: HTMLDivElement[] = [];
import { debounce, getActualAge, getPersonHtml, getReadableAge, getReadableNextBirthday, getReadableTimeDifference, getNextBirthday } from "./utils";

const updateDates = () => {
    const now = new Date();
    for (const divElement of divElements) {
        (divElement.querySelector(".person-age") as HTMLElement).textContent = getReadableAge(divElement.dataset.birthDate!);
        (divElement.querySelector(".person-actual-age") as HTMLElement).textContent = getActualAge(divElement.dataset.birthDate!);
        (divElement.querySelector(".person-next-birthday") as HTMLElement).textContent = `${getReadableNextBirthday(divElement.dataset.birthDate!)} (en ${getReadableTimeDifference(getNextBirthday(divElement.dataset.birthDate!).getTime() - now.getTime())})`;
    }
};

const updateDatesPeriodically = () => {
    setInterval(updateDates, 500);
};

worker.onmessage = event => {
    const action = event.data[0];
    const actionArgs = event.data[1];
    switch (action) {
        case "ready":
            $registerButton.addEventListener("click", () => {
                window.location.href = "./register.html";
            });
            $searchInput.addEventListener("input", debounce(() => {
                worker.postMessage(["get_people", { criteria: $searchInput.value }]);
            }, 250));
            worker.postMessage(["get_people", {}]);
            updateDatesPeriodically();
            break;
        case "people_fetched":
            while ($container.firstChild) {
                $container.removeChild($container.firstChild);
            }
            divElements.length = 0;
            const people = actionArgs as Person[];
            for (const person of people) {
                const div = document.createElement("div") as HTMLDivElement;
                div.dataset.birthDate = person.birthDate;
                div.addEventListener("click", () => {
                    window.location.href = `./details.html?id=${person.id}`;
                });
                div.className = "bg-white rounded-md p-1 mb-2 shadow border-gray-200 border cursor-pointer ";
                div.innerHTML = getPersonHtml(person);
                divElements.push(div);
                $container.appendChild(div);
            }
            updateDates();
            break;
    }
}
