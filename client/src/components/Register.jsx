import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
//import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField, Button, Container, Typography, Box, Grid2, Divider } from '@mui/material';
import { Link } from '@mui/material';
import GoogleIcon from "@mui/icons-material/Google";


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const REGISTER_URL = 'http://localhost:8000/api/users/register';

const Register = () => {

  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);


  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setValidFirstName(USER_REGEX.test(firstName));
  }, [firstName])

  useEffect(() => {
    setValidLastName(USER_REGEX.test(lastName));
  }, [lastName])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [firstName, lastName, email, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(firstName);
    const v2 = USER_REGEX.test(lastName);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PWD_REGEX.test(pwd);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(REGISTER_URL,
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: pwd
        }

      );

      //clear state and controlled inputs
      setFirstName('');
      setLastName('');
      setEmail('');
      setPwd('');
      setMatchPwd('');
      navigate('/add-quizz');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else if (err.response?.status === 404) {
        setErrMsg('Email already exists');
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus();
    }
  }

  const handleGoogleRegister = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:8000/api/users/google";
  };

  return (
    <>

      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 8,
            padding: 3,
            border: '1px solid #ddd',
            borderRadius: 2,
          }}
        >
          <Typography
            color="primary"
            align="center"
            gutterBottom={true}
            variant="h5"
          >Sign Up to test your skills</Typography>
          <form onSubmit={handleSubmit} noValidate>
            <Grid2 container spacing={2}>
              <Grid2 xs={12}>
                <span>
                  <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? "hide" : "invalid"} />
                </span>

                <TextField

                  type="text"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-invalid={firstName ? "false" : "true"}
                  aria-describedby="uidnote"
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                  autoFocus
                />
                <p id="uidnote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </Grid2>
              <Grid2 xs={12}>
                <span>
                  <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? "hide" : "invalid"} />
                </span>

                <TextField
                  type="text"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setLastName(e.target.value)}
                  aria-invalid={lastName ? "false" : "true"}
                  aria-describedby="uidnote"
                  variant="outlined"
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                />
                <p id="uidnote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </Grid2>
              <Grid2 xs={12}>
                <span>
                  <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                </span>

                <TextField

                  type="text"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={email ? "false" : "true"}
                  aria-describedby="uidnote"
                  variant="outlined"
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  value={email}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must be valid.<br />
                </p>
              </Grid2>
              <Grid2 xs={12}>
                <span>
                  <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </span>
                <TextField
                  type="password"
                  id="password"
                  label="Password"
                  name="pwd"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  fullWidth
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.<br />
                  Must include uppercase and lowercase letters, a number and a special character.<br />
                  Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>
              </Grid2>
              <Grid2 xs={12}>
                <span>
                  <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </span>
                <TextField
                  type="password"
                  id="confirm_pwd"
                  label="Confirm Password"
                  name="matchPwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  fullWidth
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </Grid2>
            </Grid2>
            <Button
              disabled={!validPwd || !validMatch ? true : false}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </form>
          <Divider sx={{ my: 1 }}>OR</Divider>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleRegister}
            fullWidth
            sx={{
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Sign Up with Google
          </Button>
          <Divider sx={{ my: 1 }}></Divider>
          <Typography
            color="primary"
            align="center"
            gutterBottom={true}
            variant="p"
          > Already registered?

            <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Sign In</Link>
          </Typography>
        </Box>
      </Container>

    </>
  )
}

export default Register