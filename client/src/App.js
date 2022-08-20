import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./Theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import { useSelector } from "react-redux";
import Search from "./components/Search";
import Profile from "./pages/Profile";
import ExtendedMenu from "./components/ExtendedMenu";
import Menu from "./components/Menu";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [showExtendedMenu, setShowExtendedMenu] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          {showExtendedMenu ? (
            <ExtendedMenu
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setShowExtendedMenu={setShowExtendedMenu}
            />
          ) : (
            <Menu setShowExtendedMenu={setShowExtendedMenu} />
          )}
          <Main>
            <Navbar setShowExtendedMenu={setShowExtendedMenu} />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route path="/" element={<Home type={"random"} />} />
                  <Route path="/trends" element={<Home type={"trend"} />} />
                  <Route path="/subcriptions" element={<Home type={"sub"} />} />
                  <Route
                    path="/signin"
                    element={!currentUser ? <SignIn /> : <Navigate to="/" />}
                  />
                  <Route path="/video/:id" element={<Video />} />
                  <Route path="/search" element={<Search />} />
                </Route>
                <Route exact path="/profile/:id" element={<Profile />} />
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  position: relative;
  /* overflow: hidden; */

  &::-webkit-scrollbar-thumb {
    background: #fff;
  }
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
  min-height: 100vh;
`;
const Wrapper = styled.div``;
