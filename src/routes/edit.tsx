/* eslint-disable react-refresh/only-export-components */
import { Form, useLoaderData, redirect, useNavigate, Params } from "react-router-dom";
import { updateContact } from "../contacts";

async function action({
  request,
  params,
}: {
  request: { formData: () => Promise<FormData> };
  params: Params;
}) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  await updateContact(params.contactId, updates);

  return redirect(`/contacts/${params.contactId}`);
}

function EditContact() {
  const { contact } = useLoaderData() as {
    contact: {
      first: string;
      last: string;
      twitter: string;
      avatar: string;
      notes: string;
    };
  };
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}

export default EditContact;
export { action };
