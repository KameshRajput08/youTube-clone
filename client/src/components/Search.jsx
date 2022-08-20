import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 22px 50px;

  @media(max-width: 500px) {
    padding: 0;
  }
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const sr = useLocation().search;
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/video/search${sr}`);
      console.log(res);
      setVideos(res.data);
    };
    fetchVideos();
  }, [sr]);
  return (
    <>
      <Container>
        {videos.map((v) => {
          return <Card key={v._id} video={v} />;
        })}
      </Container>
    </>
  );
};

export default Search;
