/* eslint-disable react-refresh/only-export-components */
import { Form, useLoaderData, useFetcher, type Params } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

interface ContactObject {
  first: string;
  last: string;
  avatar: string;
  twitter: string;
  notes: string;
  favorite: boolean;
}

async function action({
  request,
  params,
}: {
  request: { formData: () => Promise<FormData> };
  params: Params;
}) {
  const formData = await request.formData();

  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

async function loader({ params }: { params: Params }) {
  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not found",
    });
  }

  return { contact };
}

function Contact(): JSX.Element {
  const { contact } = useLoaderData() as {
    contact: ContactObject;
  };
  // const contact: ContactObject = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placekitten.com/g/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          alt="avatar"
          key={contact.avatar}
          src={contact.avatar || undefined}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: ContactObject }) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

export default Contact;
export { loader, action };
