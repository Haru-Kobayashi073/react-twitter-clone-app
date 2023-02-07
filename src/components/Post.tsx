import React, { useState } from 'react'
import styles from './Post.module.css';
import { db } from '../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MessageIcon from "@material-ui/icons/Message";
import SendIcon from "@material-ui/icons/Send";

interface PROPS {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}

const Post: React.FC<PROPS> = (props) => {
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts").doc(props.postId).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  }

  return (
    <div className={styles.post}>
      <div className={styles.post_avator}></div>
      <Avatar src={props.avatar}/>
      <div className={styles.post_body}>
        <div>
            <div className={styles.post_header}>
              <h3>
                <span className={styles.post_headerUser}>@{props.username}</span>
                <span className={styles.post_headerTime}>
                  {new Date(props.timestamp?.toDate()).toLocaleString()}
                </span>
              </h3>
            </div>
            <div className={styles.post_tweet}>
              <p>{props.text}</p>
            </div>
          </div>
          {props.image && (
          <div className={styles.post_tweetImage}>
            <img src={props.image} alt="tweet" />
          </div>
          )}
          <form onSubmit={newComment}>
            <div className={styles.post_form}>
              <input
                className={styles.post_input}
                type="text"
                placeholder="Type new comment..."
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setComment(e.target.value)
                }
              />
              <button
                disabled={!comment}
                className={
                  comment ? styles.post_button : styles.post_buttonDisable
                }
                type="submit"
              > 
                <SendIcon className={styles.post_sendIcon} />
              </button>
            </div>
          </form>
          
        </div>
      </div>
  )
}

export default Post