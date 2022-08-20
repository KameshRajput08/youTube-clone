import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";

const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 22px 50px;

  @media(max-width: 500px){
    padding: 0;
  }
`;

const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/video/${type}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.map((v) => {
        return <Card key={v._id} video={v} />;
      })}
    </Container>
  );
};

export default Home;
