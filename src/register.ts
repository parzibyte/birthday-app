const worker = new Worker(new URL("./db.ts", import.meta.url), { type: "module" });
worker.postMessage(["init"]);

worker.onmessage = event => {
	const action = event.data[0];
	const actionArgs = event.data[1];
	switch (action) {
		case "ready":
			[$saveButton].forEach(element => element.disabled = false);
			break;
		case "person_stored":
			window.location.href = "./index.html";
			break;
	}
}

const $form = document.querySelector("#registerForm") as HTMLFormElement,
	$saveButton = document.querySelector("#saveButton") as HTMLButtonElement,
	$name = document.querySelector("#name") as HTMLInputElement,
	$birthDate = document.querySelector("#birthDate") as HTMLInputElement;

$form.addEventListener("submit", (event) => {
	event.preventDefault();
	const name = $name.value, birthDate = $birthDate.value;
	worker.postMessage(["store_person", { name, birthDate }]);
});
