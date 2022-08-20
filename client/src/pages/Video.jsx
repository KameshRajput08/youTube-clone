import React, { useEffect } from "react";
import styled from "styled-components";
import {
  ThumbUp,
  ThumbDownOffAltOutlined,
  ThumbUpOffAltOutlined,
  ThumbDown,
  AddTaskOutlined,
  ReplyOutlined,
} from "@mui/icons-material";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { dislikeVideo, fetchVideo, likeVideo } from "../redux/videoSlice";
import { format } from "timeago.js";
import { suscription } from "../redux/userSlice";
import Recommendations from "../components/Recommendations";

const Video = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const videoId = location.pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const video = useSelector((state) => state.video.currentVideo);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const addView = async () => {
      await axios.put(`/video/view/${videoId}`);
    };
    addView();
  }, [videoId]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(fetchVideo(videoId));
      const channelres = await axios.get(`/auth/find/${res.payload.userId}`);
      setChannel(channelres.data);
    };
    fetchData();
  }, [videoId, dispatch]);

  const handleLike = async () => {
    await axios.put(`/auth/like/${videoId}`, { withCredentials: true });
    dispatch(likeVideo(user._id));
  };

  const handleDislike = async () => {
    await axios.put(`/auth/dislike/${videoId}`, { withCredentials: true });
    dispatch(dislikeVideo(user._id));
  };

  const handleSuscription = async () => {
    if (user.suscribedChannels.includes(channel._id)) {
      await axios.put(`/auth/unsuscribe/${channel._id}`);
    } else {
      await axios.put(`/auth/suscribe/${channel._id}`);
    }
    dispatch(suscription(channel._id));
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={video?.video} controls />
        </VideoWrapper>
        <Title>{video?.title}</Title>
        <Details>
          <Info>
            {video?.views} views • {format(video?.createdAt)}
          </Info>
          <Buttons>
            <Button>
              {video?.likes.includes(user?._id) ? (
                <ThumbUp />
              ) : (
                <ThumbUpOffAltOutlined onClick={handleLike} />
              )}
              {video?.likes?.length}
            </Button>
            <Button>
              {video?.dislikes.includes(user?._id) ? (
                <ThumbDown />
              ) : (
                <ThumbDownOffAltOutlined onClick={handleDislike} />
              )}
              Dislike
            </Button>
            <Button>
              <ReplyOutlined /> Share
            </Button>
            <Button>
              <AddTaskOutlined /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel?.img && channel.img} alt="" />
            <ChannelDetail>
              <ChannelName>{channel?.username}</ChannelName>
              <ChannelCounter>{channel?.suscribers}</ChannelCounter>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSuscription}>
            {user?.suscribedChannels.includes(channel._id)
              ? "SUBSCRIBEB"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Description>{video?.desc}</Description>
        <Hr />
        <Comments videoId={video?._id} />
      </Content>
      <Recommendations tags={video?.tags} />
    </Container>
  );
};

export default Video;

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 22px 30px;

  @media (max-width: 500px) {
    padding: 0;
    flex-direction: column;
  }
`;

const Content = styled.div`
  flex: 4;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  padding: 0 15px;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 15px;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 500px) {
    padding: 0 10px;
  }
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  padding: 6px 20px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;
