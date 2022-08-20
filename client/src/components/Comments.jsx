import { AccountCircleOutlined } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { addComment, fetchComments } from "../redux/commentSlice";
import Comment from "./Comment";
import ClipLoader from "react-spinners/ClipLoader";

const Comments = ({ videoId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const descRef = useRef();
  const comments = useSelector((state) => state.comments?.currentComments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchComments(videoId));
  }, [videoId, dispatch]);

  const handleComment = async (e) => {
    if (descRef.current.value !== "") {
      setLoading(true);
      const res = await axios.post("/comment/", {
        videoId,
        desc: descRef.current.value,
      });
      dispatch(addComment(res.data));
      setLoading(false);
    }
  };

  return (
    <Container>
      {user && (
        <NewComment>
          {user.img ? (
            <Avatar src={user.img} />
          ) : (
            <AccountCircleOutlined fontSize="large" sx={{ color: "#fff" }} />
          )}
          <Input ref={descRef} placeholder="Add a comment..." />
          <Button onClick={handleComment} disabled={loading}>
            {loading ? (
              <ClipLoader color={"#fff"} size={20} className="loader" />
            ) : (
              "COMMENT"
            )}
          </Button>
        </NewComment>
      )}
      {comments.map((c) => {
        return <Comment key={c._id} comment={c} />;
      })}
    </Container>
  );
};

export default Comments;

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 500px) {
    padding: 0 15px;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.button`
  min-width: 100px;
  padding: 8px 15px;
  font-weight: 500;
  font-size: 14px;
  outline: none;
  border: none;
  color: #000;
  background-color: #3ea6ff;
  border-radius: 4px;
  cursor: pointer;
`;
