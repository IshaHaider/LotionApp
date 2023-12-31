import { v4 as uuidv4 } from "uuid";


export async function getNotes() {
  console.log("GET NOTE CALLED")
  let notes = JSON.parse(localStorage.getItem("notes"));
  if (!notes) notes = [];

  // let email = localStorage.getItem("email");
  // let accessToken = localStorage.getItem("accessToken");

  // console.log(email);
  // const res = await fetch(
  //   `https://jttvwmwixbgl4iap36zj73slmy0tncko.lambda-url.ca-central-1.on.aws?email=${email}`,
  //   {
  //     // mode:'no-cors',
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authentication": accessToken
  //     }
  //   }
  // );
  
  // const data = await res;
  // console.log("The data: " + data.data);

  return notes; //returns array of notes
}

export async function createNote({ title, content, date }) {
  let id = uuidv4();
  let note = { id, title, content, date };
  let notes = await getNotes();
  notes.unshift(note); //unshift adds new note to beginning of array

  // send a request to the backend to be saved
  console.log("CREATE NOTE CALLED")
  let email = localStorage.getItem("email");
  let accessToken = localStorage.getItem("accessToken");

  const res = await fetch(
    "https://bj22dnfdy5gvbpwnzbju6eemtu0vjtrr.lambda-url.ca-central-1.on.aws/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authentication": accessToken
      },
      body: JSON.stringify({ ...note, email: email }),
    }
  );

  return note; //returns new note 
}

export async function updateNote({ id, title, content, date }) {
  const note = await getNote(id); //finds note with the specified id
  let notes = await getNotes(); //retrieves array of notes
  let index = notes.findIndex((note) => note.id === id); //finds index of note from specified id 
  const updatedNote = { ...note, title, content, date };
  notes[index] = updatedNote; //updates notes array with the updated note at specified index
  await set(notes); // sets local storage to new notes array

  // send a request to the backend to be saved
  console.log("UPDATE NOTE CALLED")
  let email = localStorage.getItem("email");
  let accessToken = localStorage.getItem("accessToken");

  const res = await fetch(
    "https://bj22dnfdy5gvbpwnzbju6eemtu0vjtrr.lambda-url.ca-central-1.on.aws/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authentication": accessToken
      },
      body: JSON.stringify({ ...updatedNote, email: email }),
    }
  );

  return updatedNote; //returns updated note object 
}

export async function getNote(id) {
  let notes = JSON.parse(localStorage.getItem("notes"));
  let note = notes.find((note) => note.id === id); //returns note object with the specified id 
  return note ?? null; //returns note object or null - if it doesn't exist with that id
}

export async function deleteNote(id, accessToken) {
  let notes = JSON.parse(localStorage.getItem("notes"));
  let index = notes.findIndex((note) => note.id === id);
  if (index > -1) {
    notes.splice(index, 1);  //start modifying array at index, and remove 1 element
    await set(notes); // sets local storage to new notes array

    let email = localStorage.getItem("email");
    let accessToken = localStorage.getItem("accessToken");

    { accessToken ? console.log(accessToken) : console.log("not work") };
    const res = await fetch(
      "https://hydxcwnf656pytmab63uq4klxq0olnuo.lambda-url.ca-central-1.on.aws/",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authentication": accessToken

        },
        body: JSON.stringify(
          { id: id, email: email }
        ),
      });

    return true; //if note deleted = true
  }
  return false; //if no note deleted = false
}

function set(notes) { // sets local storage to new notes array
  localStorage.setItem("notes", JSON.stringify(notes)); //stringify converts object to string
} 
