import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorPage(): JSX.Element {
  const error: unknown = useRouteError();
  console.error(error);

  // apply narrowing due to unknown type
  if (isRouteErrorResponse(error)) {
    return (
      <div id='error-page'>
        <h1>Ooops!</h1>
        <p>Sorry, an unexpected error has occured.</p>
        <h2>{error.status}</h2>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  } else {
    return <div>Oops!</div>;
  }
}

export default ErrorPage;
