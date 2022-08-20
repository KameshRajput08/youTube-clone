import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  VideoCallOutlined,
  AccountCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import Upload from "./Upload";
import { signOut } from "../redux/userSlice";

const Navbar = ({ setShowExtendedMenu }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [toggleUpload, setToggleUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const handleChange = async (e) => {
    navigate(`/search?sr=${e.target.value}`);
  };
  console.log(showSearch);
  return (
    <>
      <Container>
        <Wrapper>
          <Logo>
            <MenuOutlined
              fontSize="large"
              className="menuBtn"
              onClick={() => setShowExtendedMenu(true)}
            />
            <img src={logo} alt="" />
            <span>YouTube</span>
          </Logo>
          <SearchBar className={showSearch ? "search" : ""}>
            <Input placeholder="Search" onChange={handleChange} />
            <SearchOutlinedIcon />
          </SearchBar>
          {!currentUser ? (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          ) : (
            <User>
              <SearchOutlinedIcon
                className="icon"
                onClick={() => setShowSearch(!showSearch)}
              />
              <VideoCallOutlined
                fontSize="large"
                onClick={() => setToggleUpload(true)}
                className="btn"
              />
              <LogoutOutlined
                className="btn"
                onClick={() => dispatch(signOut())}
              />
              {currentUser?.img ? (
                <Avatar
                  src={currentUser.img}
                  onClick={() => navigate(`/profile/${currentUser?._id}`)}
                  className="btn"
                />
              ) : (
                <AccountCircleOutlined
                  fontSize="large"
                  onClick={() => navigate(`/profile/${currentUser?._id}`)}
                  className="btn"
                />
              )}
              <span>{currentUser.username}</span>
            </User>
          )}
        </Wrapper>
      </Container>
      {toggleUpload && <Upload setToggleUpload={setToggleUpload} />}
    </>
  );
};

export default Navbar;

const Container = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 9999;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0px 20px;
  position: relative;

  .search {
    top: 100%;
    display: inherit;
    width: 100vw;
    background-color: ${({ theme }) => theme.bgLighter};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;

  img {
    width: 35px;
  }

  .menuBtn {
    color: ${({ theme }) => theme.text};
    @media (min-width: 500px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    gap: 16px;
    span {
      display: none;
    }
  }
`;

const SearchBar = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};

  @media (max-width: 500px) {
    display: none;
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  .btn {
    cursor: pointer;
  }

  .icon {
    @media (min-width: 500px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;
