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
const getPersonById = async (id: string) => {
	const rows = await db.exec({
		sql: "SELECT id, name, birthDate FROM people WHERE id = ?",
		bind: [id],
		returnValue: "resultRows",
		rowMode: "object",
	});
	return rows[0] as Person;
}
const deletePerson = async (id: string) => {
	await db.exec({
		sql: "DELETE FROM people WHERE id = ?",
		bind: [id],
	});
}
const updatePerson = async (name: string, birthDate: string, id: string) => {
	const rows = await db.exec({
		sql: "UPDATE people SET name = ?, birthDate = ? WHERE id = ? RETURNING *",
		bind: [name, birthDate, id],
		returnValue: "resultRows",
		rowMode: "object",
	});
	return rows[0];
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
		case "get_person_details":
			const person = await getPersonById(actionArgs.id);
			self.postMessage(["person_fetched", person]);
			break;
		case "delete_person":
			await deletePerson(actionArgs.id);
			self.postMessage(["person_deleted"]);
			break;
		case "update_person":
			const updatedPerson = await updatePerson(actionArgs.name, actionArgs.birthDate, actionArgs.id);
			self.postMessage(["person_updated", updatedPerson]);
			break;
	}
}