import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

async function action({ params }: { params: { contactId: string } }) {
  throw new Error("oh dang!");

  await deleteContact(params.contactId);

  return redirect("/");
}

export { action };
