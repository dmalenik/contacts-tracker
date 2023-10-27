import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query: string | null) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts: { id: string; createdAt: number }[] | null =
    await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork(null);
  const id = Math.random().toString(36).substring(2, 9);
  const contact = { id, createdAt: Date.now() };
  const contacts = await getContacts(null);
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);
  const contacts: { id: string; createdAt: number }[] | null =
    await localforage.getItem("contacts");
  const contact: { id: string; createdAt: number } | undefined = contacts.find(
    (contact) => contact.id === id,
  );
  return contact ?? null;
}

export async function updateContact(id: string, updates: unknown) {
  await fakeNetwork(null);
  const contacts: { id: string; createdAt: number }[] | null =
    await localforage.getItem("contacts");
  const contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error(`No contact found for ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  const contacts: { id: string; createdAt: number }[] | null | undefined =
    await localforage.getItem("contacts");
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: { id: string; createdAt: number }[] | null | undefined) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key: string | null) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;

  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
