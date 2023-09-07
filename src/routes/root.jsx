import { Fragment, useState, useEffect} from "react";
import { useLoaderData, Link, Outlet, useLocation } from "react-router-dom";
import { Card } from "../components/Card";
import { getNotes } from "../notes";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import jwt_decode from "jwt-decode";

export async function loader() {
  return getNotes();
}

export default function Root(props) {
  const userss = props.userss
  const notes = useLoaderData();
  const location = useLocation();
  const [email, setEmail] = useState(null); 
  const [userName, setUserName] = useState(""); 
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState(null);
  const [accessToken, setaccessToken] = useState(null); 

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
      () => {
          if (user) {setaccessToken(user.access_token);

            localStorage.setItem("accessToken", user.access_token);
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                      setProfile(res.data);
                      localStorage.setItem("email", res.data.email);
                  })
                  .catch((err) => console.log(err));
          }
          
      },
      [ user ]
  );

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      googleLogout();
      setProfile(null);
      
  };

  const onMenuClick = () => {
    document.getElementsByTagName("body")[0].classList.toggle("minimized");
  };

  // if we have no user: sign in button
  // if we have a user: show the log out button
  
  return (
    <Fragment> {true && 
      <header className="flex border-t-4 border-t-red-400 border-b-[1px] border-b-gray-300">
        <button
          className="w-16 flex justify-center items-center hover:bg-red-400 hover:text-white"
          onClick={() => onMenuClick()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </button>
        <div className="w-full flex justify-center">
          <Link to="/">
            <div className="flex flex-col py-2 text-center">
              <h1 className="font-bold text-4xl">Lotion</h1>
              <span className="font-semibold text-gray-500">
                Like Notion, but worse.
              </span>
            </div>
          </Link>
          {profile && <button onClick={logOut}>Welcome {profile.name} (log out)</button>}
        </div>
      </header>} 


      {!profile  ? (<button onClick={() => login()}>Sign in to Lotion with Google</button>):
      (<main className="flex-grow flex">
        <aside className="notes-sidebar w-72 min-w-[18rem] flex flex-col border-b-[1px] border-b-gray-300">
          <div className="flex justify-between">
            <h2 className="font-semibold py-2 px-4 text-2xl">Notes</h2>
            <Link to={"/new"}>
              <button className="font-bold py-2 w-14 text-2xl hover:bg-red-400 hover:text-white">
                +
              </button>
            </Link>
          </div>
          {(notes === [] || notes.length === 0 || (!notes)) && (
            <span className="text-l text-gray-500 border-t-[1px] border-t-gray-300 p-4">
              <i>No Note Yet</i>
            </span>
          )}
          <section className="border-t-gray-300 border-t-[1px]">
            {location.pathname === "/new" && (
              <Card title="Untitled" date={new Date()} content={""} isActive={true}/>
            )}
            {notes.map((note) => (
              <Link key={note.id} to={`/note/${note.id}`}>
                <Card
                  title={note.title}
                  date={note.date}
                  content={note.content}
                />
              </Link>
            ))}
          </section>
        </aside>
        <section className="flex-grow border-l-gray-300 border-l-[1px] flex flex-col">
          <Outlet />
        </section>
      </main>)
      }

    </Fragment>
  );
}
