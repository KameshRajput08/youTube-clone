import React, { useRef } from "react";
import styled from "styled-components";
import logo from "../img/logo.png";
import {
  Home,
  ExploreOutlined,
  SubscriptionsOutlined,
  VideoLibraryOutlined,
  HistoryOutlined,
  LibraryMusicOutlined,
  SportsEsportsOutlined,
  SportsBasketballOutlined,
  MovieOutlined,
  ArticleOutlined,
  LiveTvOutlined,
  AccountCircleOutlined,
  SettingsOutlined,
  FlagOutlined,
  HelpOutlineOutlined,
  SettingsBrightnessOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  max-width: 180px;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  z-index: 99999;
  transition: ease-in-out 0.1s;

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.scroll};
  }

  Link {
    color: inherit;
  }
`;
const Wrapper = styled.div`
  padding: 18px 0px;

  Link {
    color: inherit;
    text-decoration: none;
  }
`;

const MenuCon = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  cursor: pointer;
  margin-bottom: 10px;

  img {
    width: 42px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 20px;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
  padding: 0 18px;
`;

const Login = styled.div`
  padding: 0 18px;
`;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
  padding: 0 18px;
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const ExtendedMenu = ({ darkMode, setDarkMode, setShowExtendedMenu }) => {
  const navigate = useNavigate();
  const contRef = useRef();
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Container ref={contRef}>
      <MenuWrapper>
        <Wrapper>
          <MenuCon>
            <img src={logo} alt="" />
            <CloseOutlined
              fontSize="large"
              fontWeight="bold"
              onClick={() => setShowExtendedMenu(false)}
            />
          </MenuCon>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <Home />
              Home
            </Item>
          </Link>
          <Link
            to={"/trends"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Item>
              <ExploreOutlined />
              Explore
            </Item>
          </Link>
          <Link
            to={"/subcriptions"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Item>
              <SubscriptionsOutlined />
              Subscriptions
            </Item>
          </Link>
          <Hr />

          <Item>
            <VideoLibraryOutlined />
            Library
          </Item>
          <Item>
            <HistoryOutlined />
            History
          </Item>
          <Hr />
          {!user && (
            <>
              <Login>
                Sign in to like videos, comment, and subscribe.
                <Link to="signin" style={{ textDecoration: "none" }}>
                  <Button>
                    <AccountCircleOutlined />
                    SIGN IN
                  </Button>
                </Link>
              </Login>
              <Hr />
            </>
          )}
          <Title>BEST OF YOUTUBE</Title>
          <Item>
            <LibraryMusicOutlined />
            Music
          </Item>
          <Item>
            <SportsBasketballOutlined />
            Sports
          </Item>
          <Item>
            <SportsEsportsOutlined />
            Gaming
          </Item>
          <Item>
            <MovieOutlined />
            Movies
          </Item>
          <Item>
            <ArticleOutlined />
            News
          </Item>
          <Item>
            <LiveTvOutlined />
            Live
          </Item>
          <Hr />
          <Item onClick={() => navigate(`/profile/${user?._id}`)}>
            <SettingsOutlined />
            Settings
          </Item>
          <Item>
            <FlagOutlined />
            Report
          </Item>
          <Item>
            <HelpOutlineOutlined />
            Help
          </Item>
          <Item onClick={() => setDarkMode(!darkMode)}>
            <SettingsBrightnessOutlined />
            {darkMode ? "Light" : "Dark"} Mode
          </Item>
        </Wrapper>
      </MenuWrapper>
    </Container>
  );
};

export default ExtendedMenu;
