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
			[$saveButton].forEach(element => element.disabled = false);
			$backButton.addEventListener("click", () => {
				worker.postMessage(["close_db"]);
			});
			$form.addEventListener("submit", (event) => {
				event.preventDefault();
				const name = $name.value, birthDate = $birthDate.value;
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