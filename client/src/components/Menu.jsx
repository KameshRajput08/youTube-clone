import React from "react";
import styled from "styled-components";
import {
  Home,
  ExploreOutlined,
  SubscriptionsOutlined,
  VideoLibraryOutlined,
  HistoryOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Menu = ({ setShowExtendedMenu }) => {
  return (
    <Container>
      <Wrapper>
        <div className="menuBtn">
          <MenuOutlined
            fontSize="large"
            onClick={() => setShowExtendedMenu(true)}
          />
        </div>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="item">
            <Home />
            Home
          </div>
        </Link>
        <Link
          to={"/trends"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="item">
            <ExploreOutlined />
            Explore
          </div>
        </Link>
        <Link
          to={"/subcriptions"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="item">
            <SubscriptionsOutlined />
            Subscriptions
          </div>
        </Link>
        <div className="item">
          <VideoLibraryOutlined />
          Library
        </div>
        <div className="item">
          <HistoryOutlined />
          History
        </div>
      </Wrapper>
    </Container>
  );
};

export default Menu;

const Container = styled.div`
  flex: 0.5;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
  transition: ease-in-out 0.1s;

  @media(max-width: 500px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  padding: 55px 0px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 11px;
    padding: 15px 0;
    gap: 5px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.soft};
    }
  }

  .menuBtn {
    position: absolute;
    top: 3%;
    left: 30%;
    cursor: pointer;
  }
`;
