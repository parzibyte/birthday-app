const worker = new Worker(new URL("./db.ts", import.meta.url), { type: "module" });
worker.postMessage(["init"]);
const $container = document.querySelector("#container") as HTMLDivElement,
    $registerButton = document.querySelector("#registerButton") as HTMLButtonElement;
import { getPersonHtml } from "./utils";

worker.onmessage = event => {
    const action = event.data[0];
    const actionArgs = event.data[1];
    switch (action) {
        case "ready":
            $registerButton.addEventListener("click", () => {
                window.location.href = "./register.html";
            });
            worker.postMessage(["get_people"]);
            break;
        case "people_fetched":
            const people = actionArgs as Person[];
            const ahora = new Date();
            for (const person of people) {
                const div = document.createElement("div") as HTMLDivElement;
                div.addEventListener("click", () => {
                    window.location.href = `./details.html?id=${person.id}`;
                });
                div.className = "bg-white rounded-md p-1 mb-2 shadow border-gray-200 border cursor-pointer ";
                div.innerHTML = getPersonHtml(person, ahora);
                $container.appendChild(div);
            }
            console.log({ argumentos: actionArgs });
            break;
    }
}
