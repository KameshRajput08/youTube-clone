import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { loginUser, googleAuth, registerUser } from "../redux/userSlice";
import { provider, auth } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";

const SignIn = () => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isError, setisError] = useState("");
  const [loginLoading, setloginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(undefined);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignIn = async (e) => {
    e.preventDefault();

    setloginLoading(true);
    const { username, ...loginDetails } = userDetails;
    const res = await dispatch(loginUser(loginDetails));
    if (res.type === "auth/login/rejected") setisError("signInErr");
    setloginLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setSignUpLoading(true);
    const res = await dispatch(registerUser(userDetails));
    if (res.type === "auth/register/rejected") setisError("signUpErr");
    setSignUpLoading(false);
  };

  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const authDetails = {
          username: res.user.displayName,
          email: res.user.email,
          img: res.user.photoURL,
        };
        dispatch(googleAuth(authDetails));
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to LamaTube</SubTitle>
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <Input
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        {isError === "signInErr" && <Error>Something went wrong...</Error>}
        <Button onClick={handleSignIn}>
          {loginLoading ? <ClipLoader color={"#fff"} size={20} /> : "Sign In"}
        </Button>
        <Button onClick={googleSignIn}>Signin with Google</Button>
        <Title>or</Title>
        <Input name="username" placeholder="username" onChange={handleChange} />
        <Input name="email" placeholder="email" onChange={handleChange} />
        <Input
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        {isError === "signUpErr" && <Error>Something went wrong...</Error>}
        <Button onClick={handleSignUp}>
          {signUpLoading ? <ClipLoader color={"#fff"} size={20} /> : "Sign Up"}
        </Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const Error = styled.span`
  font-size: 14px;
  color: #d74848;
  text-align: start;
`;
