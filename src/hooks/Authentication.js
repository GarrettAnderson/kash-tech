import React, { useEffect, useState, useRef, createContext } from "react";
import AlertMessage from "../components/AlertMessage";
import { useLocalStorage } from "./LocalStorage";
import { domain } from "../assets/api/apiEndpoints";
const authContext = React.createContext;

export function useAuth() {
  let alertMessage = useRef();
  let [message, setMessage] = useState("");
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useLocalStorage("user", null);
  let [loggedInUser, setLoggedInUser] = useLocalStorage("loggedInUserInfo", {});
  let [isAdmin, setIsAdmin] = useLocalStorage("adminLevel", null);
  let [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    fetch(`${domain}GenericResultBuilderService/buildResults`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _keyword_: "KASH_OPERATIONS_USER_TABLE" }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("all users", res);
        setAllUsers(res.data);
      })
      .catch((err) => {
        alert(`Unable to load users from database. Error: ${err}`);
        // setMessage(
        //   alertMessageDisplay(
        //     `Unable to load users from database. Error: ${err}`
        //   )
        // );
        // alertMessage.current.showModal();
      });
  };

  const alertMessageDisplay = (entry) => {
    return entry;
  };

  const closeAlert = () => {
    alertMessage.current.close();
  };

  return {
    // authed,
    user,
    message: (
      <AlertMessage ref={alertMessage} close={closeAlert} message={message} />
    ),
    login(username, password) {
      console.log("password base64", password);
      return new Promise((res) => {
        fetch(`${domain}AppContextService/KshSignIn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _keyword_: "KASH_OPERATIONS_USER_TABLE",
            username: username,
            password: password,
            secretkey: "2bf52be7-9f68-4d52-9523-53f7f267153b",
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            if (data.success === "false") {
              alert(
                "Unable to login. Check username and password are correct."
              );
              // setMessage(
              //   alertMessageDisplay(
              //     "Unable to login. Check username and paassword are correct."
              //   )
              // );
              // alertMessage.current.showModal();
            } else {
              // get the first name of the employee that is logged in
              let userArrObject = allUsers.filter(
                (name) => data.EmpId === name.EmpId
              );
              console.log(userArrObject);

              // save logged in user first name to state
              // get the first name of the logged in user by getting emp id from the response of the logged in fetch
              setLoggedInUser(userArrObject[0]);
              let basicUserString = "Basic User";
              if (data.IsAdmin === "Admin" || data.IsAdmin === "Super Admin") {
                setIsAdmin(data.IsAdmin);
              } else {
                setIsAdmin(basicUserString);
              }

              setUser(data.username);
              res();
            }
          })
          .catch((error) => {
            alert(`Unable to login. Error: ${error}`);
            // setMessage(alertMessageDisplay(`Unable to login. Error: ${error}`));
            // alertMessage.current.showModal();
          });
      });
    },
    logout() {
      console.log("de-authorize on logout");
      return new Promise((res) => {
        // setAuthed(false);
        setLoggedInUser(null);
        setIsAdmin(null);
        setUser(null);
        res();
      });
    },
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
