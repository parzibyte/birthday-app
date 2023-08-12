import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
const NOMBRE_BASE_DE_DATOS = "birth_data.sqlite"
let db: any;
const init = async () => {
	const sqlite3 = await sqlite3InitModule({
		print: console.log,
		printErr: console.error,
	});
	if ('opfs' in sqlite3) {
		db = new sqlite3.oo1.OpfsDb(NOMBRE_BASE_DE_DATOS);
	} else {
		db = new sqlite3.oo1.DB(NOMBRE_BASE_DE_DATOS, 'ct');
	}
	await db.exec(`CREATE TABLE IF NOT EXISTS people(
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				birthDate TEXT NOT NULL)`);
}

const storePerson = async (name: string, birthDate: string) => {
	const rows = await db.exec({
		sql: "INSERT INTO people(name, birthDate) VALUES (?, ?) RETURNING *",
		bind: [name, birthDate],
		returnValue: "resultRows",
		rowMode: "object",
	});
	return rows[0];
}
const getPeople = async () => {
	return await db.exec({
		sql: "SELECT id, name, birthDate FROM people",
		returnValue: "resultRows",
		rowMode: "object",
	});
}
self.onmessage = async (event) => {
	const action = event.data[0];
	const actionArgs = event.data[1];
	switch (action) {
		case "init":
			await init();
			self.postMessage(["ready"]);
			break;
		case "store_person":
			const storedPerson = await storePerson(actionArgs.name, actionArgs.birthDate);
			self.postMessage(["person_stored", storedPerson]);
			break;
		case "get_people":
			const people = await getPeople();
			self.postMessage(["people_fetched", people]);
			break;
	}
}