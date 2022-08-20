import React, { useEffect, useState } from "react";
import styled from "styled-components";
import uploadPng from "../img/upload.png";
import Upload from "../components/Upload";
import Card from "../components/Card";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { suscription } from "../redux/userSlice";
import Customize from "../components/Customize";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [toggleUpload, setToggleUpload] = useState(false);
  const [toggleCustomize, setToggleCustomize] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isSuscribed = currentUser?.suscribedChannels.includes(user?._id);

  const handleSuscription = async () => {
    if (currentUser !== null) {
      if (currentUser.suscribedChannels.includes(user._id)) {
        await axios.put(`/auth/unsuscribe/${user._id}`);
      } else {
        await axios.put(`/auth/suscribe/${user._id}`);
      }
      dispatch(suscription(user._id));
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/auth/find/${userId}`);
      setUser(res.data);
    };
    fetchUser();
    const fetchVideos = async () => {
      const res = await axios.get(`/video/findAll/${userId}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [userId]);

  return (
    <>
      <Container>
        <CoverPic
          src={
            user?.coverImg
              ? user.coverImg
              : "https://i.pinimg.com/originals/57/c2/62/57c262fa445b9051ded9e0dff0e58745.jpg"
          }
          alt=""
        />
        <Wrapper>
          <Details>
            <ChannelImage src={user?.img} />
            <Texts>
              <h4>{user?.username}</h4>
              <p>
                {user?.suscribers} <span>suscribers</span>
              </p>
            </Texts>
          </Details>
          <Buttons>
            {userId !== currentUser?._id ? (
              <Button
                type="sub"
                className={isSuscribed ? "suscribed" : ""}
                onClick={handleSuscription}
              >
                {isSuscribed ? "SUSCRIBED" : "SUSCRIBE"}
              </Button>
            ) : (
              <>
                <Button type="nonsub" onClick={() => setToggleCustomize(true)}>
                  CUSTOMIZE CHANNEL
                </Button>
                <Button type="nonsub" onClick={() => setShowVideos(true)}>
                  MANAGE VIDEOS
                </Button>
              </>
            )}
          </Buttons>
        </Wrapper>
        <Menu>
          <button
            className={!showVideos ? "active" : undefined}
            onClick={() => setShowVideos(false)}
          >
            HOME
          </button>
          <button
            className={showVideos ? "active" : undefined}
            onClick={() => setShowVideos(true)}
          >
            VIDEOS
          </button>
        </Menu>
        {!showVideos ? (
          <UploadSec>
            <img src={uploadPng} alt="" />
            <h3>Create a video</h3>
            <Button onClick={() => setToggleUpload(true)}>UPLOAD VIDEO</Button>
            <span>
              Share it with anyone or everyone. Public videos will appear here.
            </span>
            <p>
              Learn more about
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.youtube.com/creators/how-things-work/getting-started/?hl=en-GB"
              >
                how to get started
              </a>
            </p>
          </UploadSec>
        ) : (
          <VideoSection>
            {videos?.map((v) => {
              return <Card key={v._id} video={v} />;
            })}
          </VideoSection>
        )}
      </Container>
      {toggleUpload && <Upload setToggleUpload={setToggleUpload} />}
      {toggleCustomize && <Customize setToggleCustomize={setToggleCustomize} />}
    </>
  );
};

export default Profile;

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 500px) {
    padding: 30px 0px;
    flex-direction: column;
    gap: 20px;
  }
`;

const CoverPic = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (max-width: 500px) {
    height: 120px;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  color: ${({ theme }) => theme.text};

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ChannelImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div`
  margin-left: 10px;
  color: ${({ theme }) => theme.text};
  h4 {
    font-size: 22px;
    font-weight: 400;
  }

  p {
    font-size: 18px;
    font-weight: 300;

    @media (max-width: 500px) {
      text-align: center;
    }
    span {
      font-size: 16px;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
`;

const Button = styled.button`
  padding: 10px 22px;
  font-weight: 500;
  font-size: 14px;
  outline: none;
  border: none;
  color: ${({ type }) => (type === "sub" ? "#fff" : "#000")};
  background-color: ${({ type }) => (type === "sub" ? "#cc1a00" : "#3ea6ff")};
  border-radius: 4px;
  cursor: pointer;

  .suscribed {
    background-color: ${({ theme }) => theme.bgLighter};
  }

  @media (max-width: 500px) {
    padding: 10px 8px;
    font-size: 12px;
    margin: 0 6px;
  }
`;

const UploadSec = styled.div`
  width: 100%;
  padding: 150px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.text};
  gap: 20px;
  background-color: ${({ theme }) => theme.bgLighter};

  @media (max-width: 500px) {
    padding: 60px 0px;
  }

  h3 {
    font-size: 2rem;
    font-weight: 300;
  }
  span {
    color: #6e6d6d;
    font-size: 15px;
  }
  p {
    font-size: 14px;

    span {
      color: #3ea6ff;
      text-decoration: none;
      list-style: none;
    }
  }
`;

const Menu = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    flex: 1;
    padding: 20px;
    background-color: transparent;
    outline: none;
    border: none;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    cursor: pointer;

    @media (max-width: 500px) {
      padding: 8px;
      font-size: 14px;
    }
  }

  .active {
    border-bottom: 2px solid ${({ theme }) => theme.text};
  }
`;

const VideoSection = styled.div`
  padding: 50px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.bgLighter};

  @media (max-width: 500px) {
    padding: 0px;
  }
`;
