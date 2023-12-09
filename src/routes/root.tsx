/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Outlet - where to render root children
// Link - allows to switch to another page without its requesting from the server
// useLoaderData - access and render data
import {
  Outlet,
  NavLink,
  Link,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";
import { useSubmit } from "react-router-dom";

interface ContactsObject {
  id: string;
  length: number;
  first: string;
  last: string;
  favorite: string;
}

async function action() {
  const contact = await createContact();

  return redirect(`/contacts/${contact.id}/edit`);
}

async function loader({ request }: { request: { url: string } }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);

  return { contacts, q };
}

function Root(): JSX.Element {
  const { contacts, q } = useLoaderData() as {
    contacts: ContactsObject[];
    q: string;
  };
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    (document!.querySelector("#q") as HTMLInputElement)!.value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              type="search"
              name="q"
              value={q}
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          {/* <form method="post">
            <button type="submit">New</button>
          </form> */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact: ContactsObject) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite && <span>&starf;</span>}
                    </Link>
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          {/* <ul>
            <li>
              <Link to={`/contacts/1`}>Your Name</Link>
            </li>
            <li>
              <Link to={`/contacts/2`}>Your Friend</Link>
            </li>
          </ul> */}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}

export default Root;
export { action, loader };
