const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");
if (!id) {
	window.location.href = "./index.html";
}
const worker = new Worker(new URL("./db.ts", import.meta.url), { type: "module" });
const $form = document.querySelector("#registerForm") as HTMLFormElement,
	$saveButton = document.querySelector("#saveButton") as HTMLButtonElement,
	$backButton = document.querySelector("#backButton") as HTMLButtonElement,
	$deleteButton = document.querySelector("#deleteButton") as HTMLButtonElement,
	$name = document.querySelector("#name") as HTMLInputElement,
	$birthDate = document.querySelector("#birthDate") as HTMLInputElement;

const habilitarBotones = () => {
	[$saveButton, $deleteButton, $backButton].forEach(element => element.disabled = false);
	$saveButton.textContent = "Guardar";
	$deleteButton.textContent = "Eliminar";
	$backButton.textContent = "Volver";
};
let person: Person;
worker.postMessage(["init"]);
worker.onmessage = event => {
	const action = event.data[0];
	const actionArgs = event.data[1];
	switch (action) {
		case "ready":
			worker.postMessage(["get_person_details", { id }]);
			$deleteButton.addEventListener("click", () => {
				if (!confirm("¿Seguro?")) {
					return;
				}
				$deleteButton.textContent = "Eliminando...";
				[$saveButton, $deleteButton, $backButton].forEach(element => element.disabled = true);
				worker.postMessage(["delete_person", { id }]);
			});
			$backButton.addEventListener("click", () => {
				$backButton.textContent = "Cargando...";
				[$saveButton, $deleteButton, $backButton].forEach(element => element.disabled = true);
				worker.postMessage(["close_db"]);
			});
			$form.addEventListener("submit", (event) => {
				event.preventDefault();
				const name = $name.value, birthDate = $birthDate.value;
				[$saveButton, $deleteButton, $backButton].forEach(element => element.disabled = true);
				$saveButton.textContent = "Guardando...";
				worker.postMessage(["update_person", { name, birthDate, id }]);
			});
			break;
		case "person_deleted":
			worker.postMessage(["close_db"]);
			break;
		case "person_updated":
			habilitarBotones();
			alert("Guardado");
			break;
		case "person_fetched":
			person = actionArgs as Person;
			document.title = `${person.name}'s details`;
			$name.value = person.name;
			$birthDate.value = person.birthDate;
			habilitarBotones();
			break;
		case "db_closed":
			window.location.href = "./index.html";
			break;
	}
}