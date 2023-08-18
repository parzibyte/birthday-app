const worker = new Worker(new URL("./db.ts", import.meta.url), { type: "module" });
const $form = document.querySelector("#registerForm") as HTMLFormElement,
	$saveButton = document.querySelector("#saveButton") as HTMLButtonElement,
	$backButton = document.querySelector("#backButton") as HTMLButtonElement,
	$name = document.querySelector("#name") as HTMLInputElement,
	$birthDate = document.querySelector("#birthDate") as HTMLInputElement;
worker.postMessage(["init"]);

worker.onmessage = event => {
	const action = event.data[0];
	switch (action) {
		case "ready":
			$saveButton.textContent = "Guardar";
			$backButton.textContent = "Volver";
			[$saveButton, $backButton].forEach(element => element.disabled = false);
			$backButton.addEventListener("click", () => {
				$backButton.textContent = "Cargando...";
				[$saveButton, $backButton].forEach(element => element.disabled = true);
				worker.postMessage(["close_db"]);
			});
			$form.addEventListener("submit", (event) => {
				event.preventDefault();
				const name = $name.value, birthDate = $birthDate.value;
				[$saveButton, $backButton].forEach(element => element.disabled = true);
				$saveButton.textContent = "Guardando...";
				worker.postMessage(["store_person", { name, birthDate }]);
			});
			break;
		case "person_stored":
			worker.postMessage(["close_db"]);
			break;
		case "db_closed":
			window.location.href = "./index.html";
			break;
	}
}