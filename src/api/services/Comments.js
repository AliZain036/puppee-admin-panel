const apiUrl = "https://network-desk-backend.herokuapp.com/api/";

async function getComments(url, reqBody) {
  try {
    let comments = {};
    comments = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        debugger;
        return data;
      });
    return comments;
  } catch (error) {
    console.log(error);
  }
}

export { getComments }