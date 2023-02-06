import React, { useState } from 'react';
import styles from "./TweetInput.module.css";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth, storage, db } from '../firebase';
import { Avatar, Button, IconButton } from '@material-ui/core';
import firebase from 'firebase/app';
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { url } from 'inspector';

const TweetInput = () => {
  const user = useSelector(selectUser);

  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();//submitによる画面のリフレッシュを防ぐ
    if (tweetImage) {
      const S ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,

        () => {},
        (err) => {
          alert(err.message);
        }, async () => {
          await storage.ref("images").child(fileName).getDownloadURL().then(
            async (url) => {
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              })
            }
          )
        }
      )
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: '',
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      })
    }
    setTweetImage(null);
    setTweetMsg("");
  }

  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut();
      }}/>
    </div>
  )
}

export default TweetInput