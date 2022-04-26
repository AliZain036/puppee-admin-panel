const apiUrl = "https://network-desk-backend.herokuapp.com/api/";

async function getPost(url, reqBody) {
  try {
    let post = {};
    post = await fetch(`${apiUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((response) => response.json())
      .then((data) => {
        debugger
        return data;
      });
    return post;
  } catch (error) {
    console.log(error);
  }
}

export { getPost };
