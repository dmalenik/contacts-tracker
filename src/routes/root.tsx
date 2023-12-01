// Outlet - where to render root children
// Link - allows to switch to another page without its requesting from the server
// useLoaderData - access and render data
import { Outlet, Link, useLoaderData, Form, redirect } from "react-router-dom";
import { getContacts, createContact } from "../contacts";

async function action() {
  const contact = await createContact();
  
  return redirect(`/contacts/${contact.id}/edit`);
}

async function loader() {
  const contacts = await getContacts(null);

  return { contacts };
}

function Root(): JSX.Element {
  const { contacts } = useLoaderData();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              type="search"
              name="q"
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
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
              {contacts.map((contact: unknown) => (
                <li key={contact.id}>
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
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default Root;
export { action, loader };
