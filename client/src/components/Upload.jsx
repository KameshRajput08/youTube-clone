import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import app from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Upload = ({ setToggleUpload }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [tags, setTags] = useState([]);
  const [inputs, setInputs] = useState({
    userId: user?._id,
  });

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "img"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.floor(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "video");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "img");
  }, [img]);

  const handleUpload = async (e) => {
    console.log("working...");
    e.preventDefault();
    try {
      const res = await axios.post(`/video`, { ...inputs, tags });
      console.log(res);
      setToggleUpload(false);
      navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Close onClick={() => setToggleUpload(false)}>X</Close>
          <Title>Create a New Video</Title>
          <Label>Video:</Label>
          {videoPerc > 0 ? (
            "Uploading" + videoPerc + "%"
          ) : (
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          )}

          <Input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />
          <Desc
            placeholder="Description"
            name="desc"
            rows={10}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="Separate the tags with commas."
            onChange={handleTags}
          />
          <Label>Image:</Label>
          {imgPerc > 0 ? (
            "Uploading " + imgPerc + "%"
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}
          <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
      </Container>
    </>
  );
};

export default Upload;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 99;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: start;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  z-index: 999;
`;
const Label = styled.label`
  font-size: 14px;
`;
