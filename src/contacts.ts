import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

async function getContacts(query: string) {
  await fakeNetwork(`getContacts:${query}`);

  let contacts: { id: string; createdAt: number }[] | null =
    await localforage.getItem("contacts");

  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }

  return contacts.sort(sortBy("last", "createdAt"));
}

async function createContact() {
  await fakeNetwork(null);

  const id = Math.random().toString(36).substring(2, 9);
  const contact = { id, createdAt: Date.now() };
  const contacts = await getContacts(``);

  contacts.unshift(contact);
  await set(contacts);

  return contact;
}

async function getContact(id: string | undefined) {
  await fakeNetwork(`getContact:${id}`);

  const contacts: { id: string; createdAt: number }[] | null =
    await localforage.getItem("contacts");

  const contact: { id: string; createdAt: number } | undefined = contacts?.find(
    (contact) => contact.id === id,
  );

  return contact ?? null;
}

async function updateContact(id: string | undefined, updates: unknown) {
  await fakeNetwork(`updateContact:${id}`);

  const contacts: { id: string; createdAt: number }[] | null =
    await localforage.getItem("contacts");
  const contact = contacts?.find((contact) => contact.id === id);

  if (!contact) throw new Error(`No contact found for ${id}`);

  Object.assign(contact, updates);

  await set(contacts);

  return contact;
}

async function deleteContact(id: string | undefined) {
  const contacts: { id: string; createdAt: number }[] | null | undefined =
    await localforage.getItem("contacts");
  const index: number | undefined = contacts?.findIndex(
    (contact) => contact.id === id,
  );

  if (index !== undefined) {
    if (index > -1) {
      contacts?.splice(index, 1);
      await set(contacts);
      return true;
    }
  }
  return false;
}

function set(contacts: { id: string; createdAt: number }[] | null | undefined) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: { [key: string]: boolean } = {};

async function fakeNetwork(key: string | null | undefined) {
  if (!key) {
    fakeCache = {};
  }

  if (typeof key === "string") {
    if (fakeCache[key]) {
      return;
    }

    fakeCache[key] = true;
  }

  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

export { getContacts, createContact, getContact, updateContact, deleteContact };
