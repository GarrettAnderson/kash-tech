import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/Authentication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/NavBar.css";

function NavBar(props) {
  let { logout } = useAuth();
  let navigate = useNavigate();
  let [showProfileLinks, setShowProfileLinks] = useState(false);

  console.log(props.userInfo);
  let profileNavLinks = "NavBar--profile-nav-link";
  //   update profile nav link class to show the links when profile icon is clicked
  // if showProfileLinks state variable is equal to true
  if (showProfileLinks) {
    profileNavLinks += "-show";
  } else {
    profileNavLinks += "-hide";
  }

  const userLogout = () => {
    logout();
    navigate("/login");
  };

  const changePW = () => {
    navigate("/update-password");
  };

  return (
    <nav className="NavBar">
      <Link to="/" className="NavBar--logo-link">
        <svg
          // width="92"
          // height="92"
          viewBox="0 0 92 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="NavBar--svg-logo"
        >
          <g clip-path="url(#clip0_1481_227)">
            <circle cx="46" cy="46" r="46" fill="#C5DBE0" />
            <rect
              x="59.1221"
              y="25.5371"
              width="10.3814"
              height="28.9379"
              transform="rotate(45 59.1221 25.5371)"
              fill="#0F3D57"
            />
            <rect x="24" y="24" width="14" height="44" fill="#0F3D57" />
            <path d="M29 24H38V32L29 24Z" fill="#C5DBE0" />
            <path d="M29 68H38V60L29 68Z" fill="#C5DBE0" />
            <rect
              x="66.4629"
              y="59.1226"
              width="10.3814"
              height="28.9534"
              transform="rotate(135 66.4629 59.1226)"
              fill="#0F3D57"
            />
            <path
              d="M53.7436 67.2778L67.2778 53.7436V67.2778H53.7436Z"
              fill="#0F3D57"
              stroke="#0F3D57"
              stroke-width="1.44444"
            />
            <path
              d="M67.2778 38.2564L53.7436 24.7222L67.2778 24.7222L67.2778 38.2564Z"
              fill="#0F3D57"
              stroke="#0F3D57"
              stroke-width="1.44444"
            />
            <rect x="24" y="24" width="44" height="44" fill="#C5DBE0" />
            <rect
              x="59.1221"
              y="25.5371"
              width="10.3814"
              height="28.9379"
              transform="rotate(45 59.1221 25.5371)"
              fill="#0F3D57"
            />
            <rect x="24" y="24" width="14" height="44" fill="#0F3D57" />
            <path d="M32 24H38V32L32 24Z" fill="#C5DBE0" />
            <path d="M32 68H38V60L32 68Z" fill="#C5DBE0" />
            <rect
              x="66.4629"
              y="59.1226"
              width="10.3814"
              height="28.9534"
              transform="rotate(135 66.4629 59.1226)"
              fill="#0F3D57"
            />
            <path
              d="M53.7436 67.2778L67.2778 53.7436V67.2778H53.7436Z"
              fill="#0F3D57"
              stroke="#0F3D57"
              stroke-width="1.44444"
            />
            <path
              d="M67.2778 38.2564L53.7436 24.7222L67.2778 24.7222L67.2778 38.2564Z"
              fill="#0F3D57"
              stroke="#0F3D57"
              stroke-width="1.44444"
            />
            <rect x="64" y="43" width="20" height="5" fill="#FFA755" />
            <rect
              x="77"
              y="44"
              width="20"
              height="6"
              transform="rotate(90 77 44)"
              fill="#FFA755"
            />
            <path
              d="M41.0227 76.1818C41.0227 77.4773 40.7708 78.5701 40.267 79.4602C39.7633 80.3466 39.0833 81.0189 38.2273 81.4773C37.3712 81.9318 36.4167 82.1591 35.3636 82.1591C34.303 82.1591 33.3447 81.9299 32.4886 81.4716C31.6364 81.0095 30.9583 80.3352 30.4545 79.4489C29.9545 78.5587 29.7045 77.4697 29.7045 76.1818C29.7045 74.8864 29.9545 73.7955 30.4545 72.9091C30.9583 72.0189 31.6364 71.3466 32.4886 70.892C33.3447 70.4337 34.303 70.2045 35.3636 70.2045C36.4167 70.2045 37.3712 70.4337 38.2273 70.892C39.0833 71.3466 39.7633 72.0189 40.267 72.9091C40.7708 73.7955 41.0227 74.8864 41.0227 76.1818ZM37.7727 76.1818C37.7727 75.4848 37.6799 74.8977 37.4943 74.4205C37.3125 73.9394 37.0417 73.5758 36.6818 73.3295C36.3258 73.0795 35.8864 72.9545 35.3636 72.9545C34.8409 72.9545 34.3996 73.0795 34.0398 73.3295C33.6837 73.5758 33.4129 73.9394 33.2273 74.4205C33.0455 74.8977 32.9545 75.4848 32.9545 76.1818C32.9545 76.8788 33.0455 77.4678 33.2273 77.9489C33.4129 78.4261 33.6837 78.7898 34.0398 79.0398C34.3996 79.286 34.8409 79.4091 35.3636 79.4091C35.8864 79.4091 36.3258 79.286 36.6818 79.0398C37.0417 78.7898 37.3125 78.4261 37.4943 77.9489C37.6799 77.4678 37.7727 76.8788 37.7727 76.1818ZM42.4844 82V70.3636H47.5071C48.3707 70.3636 49.1264 70.5341 49.7741 70.875C50.4219 71.2159 50.9257 71.6951 51.2855 72.3125C51.6454 72.9299 51.8253 73.6515 51.8253 74.4773C51.8253 75.3106 51.6397 76.0322 51.2685 76.642C50.901 77.2519 50.384 77.7216 49.7173 78.0511C49.0545 78.3807 48.2798 78.5455 47.3935 78.5455H44.3935V76.0909H46.7571C47.1283 76.0909 47.4446 76.0265 47.706 75.8977C47.9711 75.7652 48.1738 75.5777 48.3139 75.3352C48.4579 75.0928 48.5298 74.8068 48.5298 74.4773C48.5298 74.1439 48.4579 73.8598 48.3139 73.625C48.1738 73.3864 47.9711 73.2045 47.706 73.0795C47.4446 72.9508 47.1283 72.8864 46.7571 72.8864H45.6435V82H42.4844ZM59.2571 74C59.2268 73.6212 59.0848 73.3258 58.831 73.1136C58.581 72.9015 58.2003 72.7955 57.6889 72.7955C57.3632 72.7955 57.0961 72.8352 56.8878 72.9148C56.6832 72.9905 56.5317 73.0947 56.4332 73.2273C56.3348 73.3598 56.2836 73.5114 56.2798 73.6818C56.2723 73.822 56.2969 73.9489 56.3537 74.0625C56.4143 74.1723 56.509 74.2727 56.6378 74.3636C56.7666 74.4508 56.9313 74.5303 57.1321 74.6023C57.3329 74.6742 57.5715 74.7386 57.848 74.7955L58.8026 75C59.4465 75.1364 59.9976 75.3163 60.456 75.5398C60.9143 75.7633 61.2893 76.0265 61.581 76.3295C61.8726 76.6288 62.0866 76.9659 62.223 77.3409C62.3632 77.7159 62.4351 78.125 62.4389 78.5682C62.4351 79.3333 62.2438 79.9811 61.8651 80.5114C61.4863 81.0417 60.9446 81.4451 60.2401 81.7216C59.5393 81.9981 58.6965 82.1364 57.7116 82.1364C56.7003 82.1364 55.8177 81.9867 55.0639 81.6875C54.3139 81.3883 53.7306 80.928 53.3139 80.3068C52.901 79.6818 52.6927 78.8826 52.6889 77.9091H55.6889C55.7079 78.2652 55.7969 78.5644 55.956 78.8068C56.1151 79.0492 56.3385 79.233 56.6264 79.358C56.9181 79.483 57.2647 79.5455 57.6662 79.5455C58.0033 79.5455 58.2855 79.5038 58.5128 79.4205C58.7401 79.3371 58.9124 79.2216 59.0298 79.0739C59.1473 78.9261 59.2079 78.7576 59.2116 78.5682C59.2079 78.3902 59.1491 78.2348 59.0355 78.1023C58.9257 77.9659 58.7438 77.8447 58.4901 77.7386C58.2363 77.6288 57.8935 77.5265 57.4616 77.4318L56.3026 77.1818C55.2723 76.9583 54.4598 76.5852 53.8651 76.0625C53.2741 75.536 52.9806 74.8182 52.9844 73.9091C52.9806 73.1705 53.1776 72.5246 53.5753 71.9716C53.9768 71.4148 54.5317 70.9811 55.2401 70.6705C55.9522 70.3598 56.7685 70.2045 57.6889 70.2045C58.6283 70.2045 59.4408 70.3617 60.1264 70.6761C60.812 70.9905 61.3404 71.4337 61.7116 72.0057C62.0866 72.5739 62.276 73.2386 62.2798 74H59.2571Z"
              fill="#83B4E2"
            />
          </g>
          <defs>
            <clipPath id="clip0_1481_227">
              <rect width="92" height="92" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Link>

      <div className="NavBar--nav-links">
        <ol className="NavBar--nav-links-list">
          <li className="NavBar--user-hub-link-container">
            <Link to="/" className="NavBar--user-hub-link">
              User Hub
            </Link>
          </li>

          <li className="NavBar--control-center-link-container">
            <Link to="/control-center" className="NavBar--control-center-link">
              Control Center
            </Link>
          </li>
          <li>
            <p className="kash_operations_home--user-welcome-msg">
              Welcome, {/* <span id="kash_ops_user--first-name"> */}
              {props.userInfo.FirstName}
              {/* </span> */}!
            </p>
          </li>
          <li
            className="NavBar--user-icon"
            onClick={() => setShowProfileLinks(!showProfileLinks)}
          >
            <FontAwesomeIcon icon={faUser} />
          </li>
        </ol>
        <div className={profileNavLinks}>
          <ol>
            <li className="NavBar--username-nav-display">
              <span>
                <p className="NavBar--username-nav-display-label">User:</p>
                <p className="NavBar--username-display">
                  {props.userInfo.KashOperationsUsn}
                </p>
              </span>
              <span onClick={() => setShowProfileLinks(!showProfileLinks)}>
                x
              </span>
            </li>
            <li className="NavBar--logout-link" onClick={userLogout}>
              Logout
            </li>
            <li className="NavBar--change-password-link" onClick={changePW}>
              Change Password
            </li>
          </ol>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
