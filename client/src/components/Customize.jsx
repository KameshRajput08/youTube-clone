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
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/userSlice";

const Upload = ({ setToggleCustomize }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.currentUser);
  const [name, setName] = useState(undefined);
  const [img, setImg] = useState(undefined);
  const [coverImg, setCoverImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [coverPerc, setCoverPerc] = useState(0);
  const [imgUrl, setImgUrl] = useState(user?.img);
  const [coverUrl, setCoverUrl] = useState(user?.coverImg);

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    console.log("uploading");

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "img"
          ? setImgPerc(Math.round(progress))
          : setCoverPerc(Math.floor(progress));
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
          urlType === "img" ? setImgUrl(downloadURL) : setCoverUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    coverImg && uploadFile(coverImg, "coverImg");
  }, [coverImg]);

  useEffect(() => {
    img && uploadFile(img, "img");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/auth/${user._id}`, {
        username: name,
        img: imgUrl,
        coverImg: coverUrl,
      });
      setToggleCustomize(false);
      dispatch(updateUser(user._id));
      navigate(`/profile/${user._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Close onClick={() => setToggleCustomize(false)}>X</Close>
          <Title>Update Channel</Title>
          <Input
            type="text"
            placeholder="Channel Name"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          <Label>Profile Image:</Label>
          {imgPerc > 0 ? (
            "Uploading " + imgPerc + "%"
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}
          <Label>Cover Image:</Label>
          {coverPerc > 0 ? (
            "Uploading " + coverPerc + "%"
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImg(e.target.files[0])}
            />
          )}
          <Button onClick={handleUpload}>Save</Button>
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
  top: 5%;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 400px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
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
