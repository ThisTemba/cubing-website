export default function readJSON(path, callback) {
  // Source: https://www.pluralsight.com/guides/fetch-data-from-a-json-file-in-a-react-app
  // Source: https://reactjs.org/docs/faq-ajax.html#example-using-ajax-results-to-set-local-state
  fetch(path, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((data) => data.json())
    .then(callback);

  // TODO: fix this utility function
}
