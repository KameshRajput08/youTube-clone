import { DeleteOutlineOutlined, MoreVertOutlined } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { format } from "timeago.js";
import { deleteComment } from "../redux/commentSlice";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  position: relative;
  cursor: pointer;

  .icon {
    color: ${({ theme }) => theme.text};
    z-index: 99;
    position: absolute;
    right: 0;

    @media (max-width: 500px) {
      right: 10px;
    }
  }

  @media (max-width: 500px) {
    padding: 0 10px;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [show, setshow] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const video = useSelector((state) => state.video.currentVideo);

  const handleDelete = async () => {
    await dispatch(deleteComment(comment._id));
    setshow(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/auth/find/${comment.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, []);

  return (
    <Container>
      <Avatar src={user.img} />
      <Details>
        <Name>
          {user.username} <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
      {(comment.userId === currentUser?._id ||
        video.userId === currentUser?._id) && (
        <MoreVertOutlined className="icon" onClick={() => setshow(!show)} />
      )}
      {show && (
        <Menu>
          <Item onClick={handleDelete}>
            <DeleteOutlineOutlined />
            Delete Comment
          </Item>
        </Menu>
      )}
    </Container>
  );
};

export default Comment;

const Menu = styled.div`
  position: absolute;
  bottom: -30%;
  right: 0%;
  background-color: ${({ theme }) => theme.bgLighter};
  z-index: 999;
  transition: 0.2s ease-in-out;
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
