import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import axios from "axios";
import {
  MoreVertOutlined,
  PlaylistAddOutlined,
  WatchLaterOutlined,
  ShareOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`/auth/find/${video?.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video?.userId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/video/${video?._id}`);
      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container type={type}>
      <Link to={`/video/${video?._id}`} style={{ textDecoration: "none" }}>
        <Image type={type} src={video?.img} />
      </Link>
      <Details type={type}>
        <>
          <Link
            to={`/profile/${channel?._id}`}
            style={{ textDecoration: "none" }}
          >
            <ChannelImage type={type} src={channel?.img} />
          </Link>
          <Texts>
            <Title>{video?.title}</Title>
            <ChannelName>{channel?.username}</ChannelName>
            <Info>
              {video?.views} views • {format(video?.createdAt)}
            </Info>
          </Texts>
        </>
        <MoreVertOutlined
          className="icon"
          onClick={() => setShowMenu(!showMenu)}
        />
      </Details>
      {showMenu && (
        <Menu>
          <Item>
            <WatchLaterOutlined />
            Add to Watch Later
          </Item>
          <Item>
            <PlaylistAddOutlined />
            Add to Playlist
          </Item>
          <Item>
            <ShareOutlined />
            Share
          </Item>
          {channel?._id === user?._id && (
            <Item onClick={handleDelete}>
              <DeleteOutlineOutlined />
              Delete Video
            </Item>
          )}
        </Menu>
      )}
    </Container>
  );
};

export default Card;

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "300px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
  position: relative;

  @media (max-width: 500px) {
    width: 100vw;
  }
`;

const Menu = styled.div`
  position: absolute;
  bottom: 35%;
  right: 0%;
  background-color: ${({ theme }) => theme.bgLighter};
  z-index: 999;
  transition: 0.2s ease-in-out;

  @media(max-width: 500px){
    bottom: 100%;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 8px 25px;
  width: 100%;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "100px" : "170px")};
  background-color: #999;
  flex: 1;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
  position: relative;

  .icon {
    color: ${({ theme }) => theme.text};
    z-index: 999;
    position: absolute;
    right: 0;
    display: none;

    @media (max-width: 500px) {
      right: 6px;
    }
  }

  &:hover {
    .icon {
      display: inherit;
    }
  }

  @media (max-width: 500px) {
    padding: 0 10px;
  }
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;
